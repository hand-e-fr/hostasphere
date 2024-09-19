from time import sleep
from profiler.core import Profiler

profiler = Profiler(
    address='california-a.tensordockmarketplace.com:20411',
    token='hsp_329922bd8cc43eb3de686a54f14c1beb22cee405b0203ccfe5c901754046c334',
    session_tag='decorator'
)

def print_func_name_decorator(func):
    def wrapper(*args, **kwargs):
        print(f"Calling function: {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@print_func_name_decorator
@profiler.track()
def wait(n):
    sleep(n)
    print("Done")


if __name__ == "__main__":
    wait(1)
