from time import sleep

from profiler.core import Profiler

profiler = Profiler(
    address='localhost:50051',
    token='hsp_2c284057717697990f8b5bebcd48781ad85d602ddc05e4d69ba01a8ed7066984',
    session_tag='multiple_functions'
)


@profiler.track()
def f_a():
    f_a_a()

@profiler.track()
def f_a_a():
    f_a_a_a()

@profiler.track()
def f_a_a_a():
    pass

@profiler.track()
def f_b():
    f_b_a()

@profiler.track()
def f_b_a():
    f_b_a_a()

@profiler.track()
def f_b_a_a():
    f_a_a()
    pass

if __name__ == "__main__":
    f_a()
    f_b()

