from profiler.core import Profiler
import ell

profiler = Profiler(
    address='localhost:50051',
    token='hsp_b8d7ccc76cec73bcf92bf22c253c1ee18ce06debc080cdd77c0571f2254e7014'
)

ell.init(store='./logdir', autocommit=True)

@ell.simple(model="gpt-4o")
def chat(input: str) -> str:
    """You act as a chatbot, answering questions."""
    return f"response to {input}"

@profiler.track()
def chat_tracker(input):
    return chat(input)

if __name__ == '__main__':
    chat("Pète et répète sont sur un bateau. Pète tombe à l'eau, qui reste ?")
