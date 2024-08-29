from profiler.core import Profiler
from flask import Flask

app = Flask(__name__)

profiler = Profiler(
    address='localhost:50051',
    token='shs_qsdsq8d79qdsq65d4q6d84sqd68qsd64qsd48q68sf'
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