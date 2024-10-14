from time import sleep

from profiler.core import Profiler

profiler = Profiler(
    address='california-a.tensordockmarketplace.com:20411',
    token='hsp_8e8df320b8bc8ac29042a56fa123b6506eb937d39856582c4ed122ac1bc8a2a9',
    session_tag='sleep'
)


@profiler.track()
def wait(n):
    sleep(n)
    print("Done")


if __name__ == "__main__":
    wait(0)
