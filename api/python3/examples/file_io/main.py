from profiler.core import Profiler

profiler = Profiler(
    address='localhost:50051',
    token='hsp_a8503d8e080835557917c0da33228a461a22aab822a7a09a994d181ac8450474'
)


@profiler.track()
def read_large_file(file_path):
    with open(file_path, 'r') as file:
        return file.readlines()


if __name__ == "__main__":
    read_large_file("fit_file.txt")
