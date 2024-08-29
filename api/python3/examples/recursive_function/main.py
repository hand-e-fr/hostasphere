from profiler.core import Profiler

profiler = Profiler(
    address='localhost:50051',
    token='shs_qsdsq8d79qdsq65d4q6d84sqd68qsd64qsd48q68sf'
)

@profiler.probe()
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

if __name__ == "__main__":
    fibonacci(10)