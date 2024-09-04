from time import sleep

from profiler.core import Profiler

profiler = Profiler(
    address='localhost:50051',
    token='hsp_a8503d8e080835557917c0da33228a461a22aab822a7a09a994d181ac8450474'
)


@profiler.track()
def fibonacci(n):
    if n <= 1:
        return n
    sleep(0.1)
    return fibonacci(n - 1) + fibonacci(n - 2)


if __name__ == "__main__":
    fibonacci(10)
