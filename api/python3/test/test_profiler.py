import unittest
from profiler.core import Profiler

profiler = Profiler(
    address='localhost:50051',
    token='hsp_3082429f0d874f685c28ba3d0be0f35ad9fb8324203a7941080c2879df13ece8'
)

class TestProfiler(unittest.TestCase):
    @profiler.track()
    def sample_function(self, start, end):
        return sum(range(start, end))

    def test_sample_function(self):
        result = self.sample_function(1, 1000)
        self.assertEqual(result, sum(range(1000)))

if __name__ == '__main__':
    unittest.main()