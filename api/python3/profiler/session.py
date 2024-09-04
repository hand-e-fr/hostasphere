import uuid
from time import sleep

import grpc
import threading
import time
import psutil

from . import session_pb2_grpc, session_pb2

class Session:
    def __init__(self, address: str, token: str, token_id: str):
        self._address = address
        self._token = token
        self.metrics = session_pb2.Session()
        self.metrics.start_time = time.time()
        self.metrics.session_uuid = str(uuid.uuid4())
        self.metrics.token_id = token_id

        # Create a separate thread to save metrics
        self.save_thread = threading.Thread(target=self.save_metrics)
        self.save_thread.start()

    def record_usage(self):
        current_time = time.time()

        # Record memory usage
        memory_usage = psutil.virtual_memory().percent
        self.metrics.memory_usage.append(session_pb2.UsageAtTime(time=current_time, memory_usage=memory_usage))

        # Record CPU usage
        cpu_usage = psutil.cpu_percent(interval=None)
        self.metrics.cpu_usage.append(session_pb2.UsageAtTime(time=current_time, memory_usage=cpu_usage))

        # Record disk usage
        disk_usage = psutil.disk_usage('/').percent
        self.metrics.disk_usage.append(session_pb2.UsageAtTime(time=current_time,memory_usage=disk_usage))

        # Record network usage
        net_io = psutil.net_io_counters()
        network_usage = (net_io.bytes_sent + net_io.bytes_recv) / (1024 * 1024)  # Convert to MB
        self.metrics.network_usage.append(session_pb2.UsageAtTime(time=current_time, memory_usage=network_usage))

    def save_metrics(self):
        try:
            while True:
                self.record_usage()
                print("Recording metrics...")
                sleep(0.2)  # Simulate time interval for metrics recording
        except KeyboardInterrupt:
            self.end_session()

    def end_session(self):
        print("Ending session...")
        self.metrics.end_time = time.time()
        self.metrics.execution_time = (self.metrics.end_time - self.metrics.start_time) * 1000  # milliseconds
        self.save_session()
        print("Session ended.")

    def save_session(self):
        with grpc.insecure_channel(self._address) as channel:
            stub = session_pb2_grpc.SessionServiceStub(channel)
            request = session_pb2.SaveSessionRequest(token=self._token, session=self.metrics)
            response = stub.SaveSession(request)
            return response
