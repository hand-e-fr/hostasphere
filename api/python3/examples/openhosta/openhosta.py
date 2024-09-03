from OpenHosta import *
from profiler.core import Profiler

profiler = Profiler(
    address='localhost:50051',
    token='hsp_3082429f0d874f685c28ba3d0be0f35ad9fb8324203a7941080c2879df13ece8'
)

config.set_default_apiKey("sk-proj-1mRFqps3-6dSOPA5oz9cmYIYVAN0XkFgY9DQxnwPkJ"
                          "VJ5ixY7nX8Ny1G0_WYngpcY9e1ViNzTcT3BlbkFJAnhNT5LbilW"
                          "xvbfLGFvZ-MLr2Bfg2SYDthNpwJsten6YKWPiuSCNOkwDLpSDDoDAphkrowQhIA")

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
