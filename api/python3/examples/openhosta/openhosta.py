from profiler.core import Profiler
from OpenHosta import emulate, config

config.set_default_apiKey("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")

profiler = Profiler(
    address='localhost:50051', # required
    token='hsp_d0946b91afbce72c107e51bfb60f52da352cfea16fba71f8232ac1bfe06e9ecb',
    session_tag='uwu' # required
)

@profiler.track()
def translate(text: str) -> str:
    """
    Translate text to french.
    """
    return emulate()


if __name__ == '__main__':
    print(translate("Hello, how are you?"))
