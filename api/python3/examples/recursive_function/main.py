from time import sleep

from profiler.core import Profiler

profiler = Profiler(
    address='localhost:50051',
    token='hsp_68db56c5c3358b168d3a50c1564a9bdfd67bd6b001dba321e5a79a44280b70b8'
)


@profiler.track()
def fibonacci(n):
    if n <= 1:
        return n
    sleep(0.1)
    return fibonacci(n - 1) + fibonacci(n - 2)


if __name__ == "__main__":
    fibonacci(10)
