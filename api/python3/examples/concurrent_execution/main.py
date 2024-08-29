from profiler.core import Profiler
import concurrent.futures
import time

profiler = Profiler(
    address='localhost:50051',
    token='shs_qsdsq8d79qdsq65d4q6d84sqd68qsd64qsd48q68sf'
)

@profiler.probe()
def simulate_task(duration):
    time.sleep(duration)
    return duration

if __name__ == "__main__":
    durations = [1, 2, 3, 4, 5]
    with concurrent.futures.ThreadPoolExecutor() as executor:
        results = list(executor.map(simulate_task, durations))