import React from 'react';
import { CodeBlock } from 'react-code-blocks';

const HomePage = () => {
    return (
        <>
            <h1 className="text-2xl font-bold mb-8">Hostasphere - Profiler API</h1>

            <div className="card-body p-2 mb-2">
                <h2 className="card-title text-xl">Description</h2>
                <p>
                    The Profiling API allows you to measure execution time, memory usage, and other metrics related to
                    OpenHosta for Python functions.
                    The collected data is sent to your Hostasphere monitoring interface.
                </p>
            </div>

            <div className="card-body p-2 mb-2">
                <h2 className="card-title text-xl">Installation</h2>
                <p className="mb-4">Install the required dependencies with pip:</p>
                <CodeBlock
                    text={`pip install hostasphere-profiler==v1.0-rc3`}
                    language="shell"
                    showLineNumbers={false}
                />
            </div>

            <div className="card-body p-2 mb-2">
                <h2 className="card-title text-xl">Usage</h2>
                <p className="mb-4">To profile a function, use the decorator <code>@profiler.track()</code>:</p>
                <CodeBlock
                    text={`from profiler.core import Profiler

profiler = Profiler(
address='localhost:50051', # required, is the address of the datasource, default is 'localhost:50051'
token='hsp_0d6d562910026e3ba0b511dd2c99a47d374f810055003c149eb5fbcdad693319', # required
refresh_interval=0.1, # optional, double representing the interval in seconds between each refresh of recorded metrics, default is 0.1
session_tag="dev-1", # optional, string representing the session tag, default is None, easier to identify the session in the monitoring interface
)

@profiler.track()
def my_func():
# Function logic
pass`}
                    language="python"
                    showLineNumbers={false}
                />
            </div>

            <div className="card-body p-2 mb-2">
                <h2 className="card-title text-xl">Add Markers</h2>
                <p className="mb-4">You can add markers to your profiling session to help identify specific parts of
                    your code:</p>
                <CodeBlock
                    text={`profiler.get_session().add_annotation('Calculating CPU usage', '#008000')`}
                    language="python"
                    showLineNumbers={false}
                />
                <p className="mt-4">
                    <strong>annotation:</strong> str

                    <strong>color:</strong> str (optional, default is <code
                    className="bg-gray-200 p-1 rounded">#000000</code>)
                </p>
            </div>

            <a href="https://github.com/hand-e-fr/hostasphere/tree/main/api/python3/examples"
               className="btn btn-primary">
                View more examples
            </a>
        </>
    );
};

export default HomePage;
