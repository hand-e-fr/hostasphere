from profiler import probe
import concurrent.futures
import time

@probe()
def simulate_task(duration):
    time.sleep(duration)
    return duration

if __name__ == "__main__":
    durations = [1, 2, 3, 4, 5]
    with concurrent.futures.ThreadPoolExecutor() as executor:
        results = list(executor.map(simulate_task, durations))