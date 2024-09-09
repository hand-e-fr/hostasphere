import traceback

def track_calls(func):
    def wrapper(*args, **kwargs):
        stack = traceback.extract_stack()
        callers = [f[2] for f in stack[:-1]]
        print(f"Function '{func.__name__}' called by: {callers}")
        return func(*args, **kwargs)
    return wrapper

@track_calls
def function_a():
    pass

def function_b():
    function_a()

def function_c():
    function_b()

if __name__ == "__main__":
    function_c()