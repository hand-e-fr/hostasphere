from profiler.core import Profiler

profiler = Profiler(
    endpoint_url='http://localhost:5000',
    license_id='1234',
    license_secret='567'
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