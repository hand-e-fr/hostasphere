from profiler import probe
import numpy as np

@probe()
def process_large_dataset():
    data = np.random.rand(1000, 1000)
    return np.mean(data, axis=0)

if __name__ == "__main__":
    process_large_dataset()