from time import sleep

from profiler.core import Profiler

profiler = Profiler(
    address='localhost:50051',
    token='hsp_514ff0e682f285e2320fc7e6e161557344f154e73ac4bb4d122f959c938e6e6b'
)

@profiler.track()
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    sleep(0.1)
    return quicksort(left) + middle + quicksort(right)

if __name__ == "__main__":
    quicksort([3, 6, 8, 10, 1, 2, 1])