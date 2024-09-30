import os

from OpenHosta import emulate, config
from profiler.core import Profiler
from profiler.tokens_usage import get_tokens_usage

gpt4omini = config.Model(
    model="gpt-4o-mini",
    base_url="https://api.openai.com/v1/chat/completions",
    api_key=os.getenv('OPENAI_API_KEY')
)

profiler = Profiler(
    address='california-a.tensordockmarketplace.com:20411',
    token='hsp_3025e1ed24d554b4709f19fca36e9aa474567736793a8a6e1147185ba438f56f',
    session_tag='openhosta-6'
)


@profiler.track()
def translate(text: str) -> str:
    """
    Translate text to french.
    """
    return emulate(model=gpt4omini)

@profiler.track()
def chatbot(text: str) -> str:
    """
    Chatbot.
    """
    return emulate(model=gpt4omini)


if __name__ == '__main__':
    profiler.get_session().add_annotation("first prompt")
    print(translate("Hello, how are you?"))
    profiler.get_session().add_annotation("second prompt")
    print(translate("How are you?"))
    profiler.get_session().add_annotation("third prompt")
    print(chatbot("I've walked 10 miles today, and on my way I saw a cat. BUT!! It was not a cat, it was a giant beer, complete my story."))
    profiler.get_session().add_annotation("fourth prompt")
    print(chatbot("In my physics class, I learned about the theory of relativity. Can you explain it to me? in 300 words at least."))
    profiler.get_session().add_annotation("end of session")
    print(get_tokens_usage())