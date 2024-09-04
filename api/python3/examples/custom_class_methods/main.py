from profiler.core import Profiler

profiler = Profiler(
    address='localhost:50051',
    token='hsp_0d6d562910026e3ba0b511dd2c99a47d374f810055003c149eb5fbcdad693319'
)


class CustomClass:
    @profiler.track()
    def method_one(self):
        return "Method One Executed"

    @profiler.track()
    def method_two(self, value):
        return f"Method Two Executed with {value}"


if __name__ == "__main__":
    obj = CustomClass()
    obj.method_one()
    obj.method_two("Test Value")
