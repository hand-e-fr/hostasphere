import os

from OpenHosta import emulate, config
from profiler.core import Profiler

config.set_default_apiKey(os.getenv('OPENAI_API_KEY'))

profiler = Profiler(
    address='california-a.tensordockmarketplace.com:20411',
    token='hsp_3025e1ed24d554b4709f19fca36e9aa474567736793a8a6e1147185ba438f56f',
    session_tag='openhosta-2'
)


@profiler.track()
def translate(text: str) -> str:
    """
    Translate text to french.
    """
    return emulate()


if __name__ == '__main__':
    print(translate("Hello, how are you?"))