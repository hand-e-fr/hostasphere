from profiler.core import Profiler
import numpy as np

profiler = Profiler(
    endpoint_url='http://localhost:5000',
    license_id='1234',
    license_secret='567'
)

@profiler.probe()
def process_large_dataset():
    data = np.random.rand(1000, 1000)
    return np.mean(data, axis=0)

if __name__ == "__main__":
    process_large_dataset()