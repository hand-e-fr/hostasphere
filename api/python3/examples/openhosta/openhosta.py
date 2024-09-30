import os

from OpenHosta import emulate, config
from profiler.core import Profiler
from profiler.tokens_usage import get_tokens_usage

config.set_default_apiKey(os.getenv('OPENAI_API_KEY'))

profiler = Profiler(
    address='california-a.tensordockmarketplace.com:20411',
    token='hsp_3025e1ed24d554b4709f19fca36e9aa474567736793a8a6e1147185ba438f56f',
    session_tag='openhosta-4'
)


@profiler.track()
def translate(text: str) -> str:
    """
    Translate text to french.
    """
    return emulate()


if __name__ == '__main__':
    profiler.get_session().add_annotation("first prompt")
    print(translate("Hello, how are you?"))
    profiler.get_session().add_annotation("second prompt")
    print(translate("How are you?"))
    profiler.get_session().add_annotation("third prompt")
    print(translate("I've walked 10 miles today, and on my way I saw a cat. BUT!! It was not a cat, it was a giant beer, complete my story."))
    profiler.get_session().add_annotation("end of session")
    print(get_tokens_usage())