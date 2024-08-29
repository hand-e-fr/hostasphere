from profiler.core import Profiler
import concurrent.futures
import time

profiler = Profiler(
    endpoint_url='http://localhost:5000',
    license_id='1234',
    license_secret='567'
)

@profiler.probe()
def simulate_task(duration):
    time.sleep(duration)
    return duration

if __name__ == "__main__":
    durations = [1, 2, 3, 4, 5]
    with concurrent.futures.ThreadPoolExecutor() as executor:
        results = list(executor.map(simulate_task, durations))