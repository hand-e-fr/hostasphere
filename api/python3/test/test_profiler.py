import unittest
from time import sleep

from profiler.core import Profiler

profiler = Profiler(
    address='localhost:50051',
    token='hsp_012e03f598f302a750ba14b09a41b7871693dc11c2efa8bc6405b3083a2cdb41'
)


class TestProfiler(unittest.TestCase):
    @profiler.track()
    def sample_function(self, start, end):
        sleep(1)
        return sum(range(start, end))

    def test_sample_function(self):
        result = self.sample_function(1, 1000)
        self.assertEqual(result, sum(range(1000)))


if __name__ == '__main__':
    unittest.main()
