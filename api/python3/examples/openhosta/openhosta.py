from OpenHosta import *
from profiler.core import Profiler

profiler = Profiler(
    address='localhost:50051',
    token='hsp_3082429f0d874f685c28ba3d0be0f35ad9fb8324203a7941080c2879df13ece8'
)

config.set_default_apiKey("sk-proj-...")

def print_function_name_decorator(func):
    def wrapper(*args, **kwargs):
        print(f"Calling function: {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

# Example usage
@print_function_name_decorator
def example_function():
    print("Inside example_function")

@print_function_name_decorator
def openhosta_function(input_string: str) -> str:
    """
    this function reverse the string
    """
    return emulate()


if __name__ == '__main__':
    print(openhosta_function("Hello everyone it's me, the programmer"))
    example_function()
