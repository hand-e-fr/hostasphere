from profiler.core import Profiler
import concurrent.futures
import time

profiler = Profiler(
    address='localhost:50051',
    token='hsp_0d6d562910026e3ba0b511dd2c99a47d374f810055003c149eb5fbcdad693319'
)

@profiler.probe()
def simulate_task(duration):
    time.sleep(duration)
    return duration

if __name__ == "__main__":
    durations = [1, 2, 3, 4, 5]
    with concurrent.futures.ThreadPoolExecutor() as executor:
        results = list(executor.map(simulate_task, durations))