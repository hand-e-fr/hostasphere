from time import sleep

from profiler.core import Profiler

profiler = Profiler(
    address='localhost:50051',
    token='hsp_a743609784aa3568b2f4f34f91330d8fc81316abd9361f3f603fed2650c5a16a'
)

@profiler.probe()
def wait(n):
    sleep(n)
    print("Done")

if __name__ == "__main__":
    wait(2)