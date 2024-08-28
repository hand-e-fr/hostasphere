from profiler import probe

class CustomClass:
    @probe()
    def method_one(self):
        return "Method One Executed"

    @probe()
    def method_two(self, value):
        return f"Method Two Executed with {value}"

if __name__ == "__main__":
    obj = CustomClass()
    obj.method_one()
    obj.method_two("Test Value")