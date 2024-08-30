from profiler.core import Profiler

profiler = Profiler(
    address='localhost:50051',
    token='hsp_0d6d562910026e3ba0b511dd2c99a47d374f810055003c149eb5fbcdad693319'
)

@profiler.probe()
def read_large_file(file_path):
    with open(file_path, 'r') as file:
        return file.readlines()

if __name__ == "__main__":
    read_large_file("large_file.txt")