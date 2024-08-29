import grpc
from concurrent import futures
import calculator_pb2
import calculator_pb2_grpc
from profiler.core import Profiler

profiler = Profiler(
    endpoint_url='http://localhost:5000',
    license_id='1234',
    license_secret='567'
)

class CalculatorServicer(calculator_pb2_grpc.CalculatorServicer):
    @profiler.probe()
    def Add(self, request, context):
        result = request.num1 + request.num2
        print(f"Received request: {request.num1} + {request.num2} = {result}")
        return calculator_pb2.AddResponse(result=result)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    calculator_pb2_grpc.add_CalculatorServicer_to_server(CalculatorServicer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    serve()