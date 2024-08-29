from profiler.core import Profiler

profiler = Profiler(
    address='localhost:50051',
    token='shs_qsdsq8d79qdsq65d4q6d84sqd68qsd64qsd48q68sf'
)

class CustomClass:
    @profiler.probe()
    def method_one(self):
        return "Method One Executed"

    @profiler.probe()
    def method_two(self, value):
        return f"Method Two Executed with {value}"

if __name__ == "__main__":
    obj = CustomClass()
    obj.method_one()
    obj.method_two("Test Value")