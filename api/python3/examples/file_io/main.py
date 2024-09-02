from profiler.core import Profiler

profiler = Profiler(
    address='localhost:50051',
    token='hsp_2561346f824a05f7b6ce3b8180e608ca2bb8ca7874658181daaacb851daeef82'
)

@profiler.track()
def read_large_file(file_path):
    with open(file_path, 'r') as file:
        return file.readlines()

if __name__ == "__main__":
    read_large_file("large_file.txt")