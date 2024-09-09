from time import sleep

from profiler.core import Profiler

profiler = Profiler(
    address='localhost:50051',
    token='hsp_2c284057717697990f8b5bebcd48781ad85d602ddc05e4d69ba01a8ed7066984',
    session_tag='fibonacci_3'
)


@profiler.track()
def fibonacci(n):
    if n <= 1:
        return n
    sleep(0.1)
    return fibonacci(n - 1) + fibonacci(n - 2)


if __name__ == "__main__":
    fibonacci(10)
