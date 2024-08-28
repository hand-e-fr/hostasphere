from profiler import probe

@probe()
def read_large_file(file_path):
    with open(file_path, 'r') as file:
        return file.readlines()

if __name__ == "__main__":
    read_large_file("large_file.txt")