from time import sleep

from profiler.core import Profiler

profiler = Profiler(
    address='localhost:50051',
    token='hsp_2c284057717697990f8b5bebcd48781ad85d602ddc05e4d69ba01a8ed7066984'
)


@profiler.track()
def wait(n):
    sleep(n)
    print("Done")


if __name__ == "__main__":
    wait(0)
