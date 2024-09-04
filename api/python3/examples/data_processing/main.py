import numpy as np

from profiler.core import Profiler

profiler = Profiler(
    address='localhost:50051',
    token='hsp_0d6d562910026e3ba0b511dd2c99a47d374f810055003c149eb5fbcdad693319'
)


@profiler.track()
def process_large_dataset():
    data = np.random.rand(1000, 1000)
    return np.mean(data, axis=0)


if __name__ == "__main__":
    process_large_dataset()
