from flask import Flask

from profiler.core import Profiler

app = Flask(__name__)

profiler = Profiler(
    address='localhost:50051',
    token='hsp_0d6d562910026e3ba0b511dd2c99a47d374f810055003c149eb5fbcdad693319'
)


@app.route('/')
@profiler.track()
def hello_world():
    for i in range(100000):
        # calculate sum of first 1000 numbers
        sum(range(1000))
    return 'Hello, World!'


if __name__ == '__main__':
    app.run(debug=True)
