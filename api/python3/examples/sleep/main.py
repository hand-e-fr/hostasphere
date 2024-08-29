from time import sleep

from profiler.core import Profiler

profiler = Profiler(
    address='localhost:50051',
    token='shs_qsdsq8d79qdsq65d4q6d84sqd68qsd64qsd48q68sf'
)

@profiler.probe()
def wait(n):
    sleep(n)
    print("Done")

if __name__ == "__main__":
    wait(2)