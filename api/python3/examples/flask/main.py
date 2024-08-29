from profiler.core import Profiler
from flask import Flask

app = Flask(__name__)

profiler = Profiler(
    endpoint_url='http://localhost:5000',
    license_id='1234',
    license_secret='567'
)

@app.route('/')
@profiler.probe()
def hello_world():
    for i in range(100000):
        # calculate sum of first 1000 numbers
        sum(range(1000))
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(debug=True)