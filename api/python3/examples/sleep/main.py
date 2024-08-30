from time import sleep

from profiler.core import Profiler

profiler = Profiler(
    address='localhost:50051',
    token='hsp_0d6d562910026e3ba0b511dd2c99a47d374f810055003c149eb5fbcdad693319'
)

@profiler.probe()
def wait(n):
    sleep(n)
    print("Done")

if __name__ == "__main__":
    wait(2)