from time import sleep

from profiler.core import Profiler

profiler = Profiler(
    address='california-a.tensordockmarketplace.com:20411',
    token='hsp_48252dc11bd1b68c45a06f097eccb66c2b4b90b2fe55343d3f898252c3611be9',
    session_tag='sleep'
)


@profiler.track()
def wait(n):
    sleep(n)
    print("Done")


if __name__ == "__main__":
    wait(0)
