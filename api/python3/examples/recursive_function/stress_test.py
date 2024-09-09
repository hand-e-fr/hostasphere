import random
import time
from random import randint
from time import sleep

import requests

from profiler.core import Profiler

profiler = Profiler(
    address='localhost:50051',
    token='hsp_2c284057717697990f8b5bebcd48781ad85d602ddc05e4d69ba01a8ed7066984',
    session_tag='hard_function_2'
)


@profiler.track()
def recursive_func(n, max_depth):
    # CPU usage
    if randint(0, 15) == 0:
        print('Calculating CPU usage')
        profiler.get_session().add_annotation('Calculating CPU usage', '#008000')
        x = 0
        for i in range(100000):
            x += i * i
        time.sleep(random.uniform(0, 1))

    # Memory usage
    if randint(0, 15) == 0:
        print('Allocating memory')
        profiler.get_session().add_annotation('Allocating memory', '#89CFF0')
        lst = [i for i in range(100000)]
        time.sleep(random.uniform(0, 1))

    # Disk usage (writing to a file)
    if randint(0, 15) == 0:
        print('Writing to a file')
        profiler.get_session().add_annotation('Writing to a file', '#FF7F00')
        with open('test.txt', 'a') as f:
            f.write(str(n) + '\n')
        time.sleep(random.uniform(0, 1))

    # Network usage (making a request to a website)
    if randint(0, 15) == 0:
        print('Making a request to example.com')
        profiler.get_session().add_annotation('Making a request to example.com', '#FF0000')
        try:
            response = requests.get('http://example.com')
        except requests.exceptions.RequestException as e:
            print(e)
        time.sleep(random.uniform(0, 1))

    # Recursive call
    if n < max_depth:
        recursive_func(n + 1, max_depth)

if __name__ == "__main__":
    recursive_func(0, 60)
