import grpc
import calculator_pb2
import calculator_pb2_grpc
from profiler.core import Profiler

profiler = Profiler(
    endpoint_url='http://localhost:5000',
    license_id='1234',
    license_secret='567'
)

@profiler.probe()
def run(num1, num2):
    with grpc.insecure_channel('localhost:50051') as channel:
        stub = calculator_pb2_grpc.CalculatorStub(channel)
        response = stub.Add(calculator_pb2.AddRequest(num1=num1, num2=num2))
    print(f"Result: {response.result}")

if __name__ == '__main__':
    # Get user Input
    num1 = int(input("Please input num1: "))
    num2 = int(input("Please input num2: "))
    run(num1, num2)