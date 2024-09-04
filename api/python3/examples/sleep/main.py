from time import sleep

from profiler.core import Profiler

profiler = Profiler(
    address='localhost:50051',
    token='hsp_514ff0e682f285e2320fc7e6e161557344f154e73ac4bb4d122f959c938e6e6b'
)


@profiler.track()
def wait(n):
    sleep(n)
    print("Done")


if __name__ == "__main__":
    wait(0)
