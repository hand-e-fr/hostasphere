from OpenHosta import *

config.set_default_apiKey("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")


def print_function_name_decorator(openhosta_function_decorator):
    def wrapper(*args, **kwargs):
        print(f"Calling function: {openhosta_function_decorator.__name__}")
        return openhosta_function_decorator(*args, **kwargs)
    return wrapper





@print_function_name_decorator
def openhosta_function_decorator(input_string: str) -> str:
    """
    this function reverse the string
    """
    return emulate()
openhosta_function_decorator = print_function_name_decorator(openhosta_function_decorator)

def openhosta_function_no_decorator(input_string: str) -> str:
    """
    this function reverse the string
    """
    return emulate()


if __name__ == '__main__':
    print(openhosta_function_decorator("woaw"))
    print(openhosta_function_no_decorator("woaw"))
