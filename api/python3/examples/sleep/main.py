from time import sleep

from profiler.core import Profiler

profiler = Profiler(
    address='california-a.tensordockmarketplace.com:20411',
    token='hsp_47c0d15c5782c47f6c4c0b9e6768613de9565f6656b1e65e6830db7595b57fef',
    session_tag='sleep'
)


@profiler.track()
def wait(n):
    sleep(n)
    print("Done")


if __name__ == "__main__":
    wait(0)
