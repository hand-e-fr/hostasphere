import grpc
from concurrent import futures
import calculator_pb2
import calculator_pb2_grpc
from profiler.core import Profiler

profiler = Profiler(
    address='localhost:50051',
    token='hsp_0d6d562910026e3ba0b511dd2c99a47d374f810055003c149eb5fbcdad693319'
)

class CalculatorServicer(calculator_pb2_grpc.CalculatorServicer):
    @profiler.track()
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