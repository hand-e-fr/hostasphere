from profiler.core import Profiler
import numpy as np

profiler = Profiler(
    address='localhost:50051',
    token='shs_qsdsq8d79qdsq65d4q6d84sqd68qsd64qsd48q68sf'
)

@profiler.probe()
def process_large_dataset():
    data = np.random.rand(1000, 1000)
    return np.mean(data, axis=0)

if __name__ == "__main__":
    process_large_dataset()