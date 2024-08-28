from profiler import probe
from flask import Flask

app = Flask(__name__)

@app.route('/')
@probe()
def hello_world():
    for i in range(100000):
        # calculate sum of first 1000 numbers
        sum(range(1000))
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(debug=True)