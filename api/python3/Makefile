TOKEN_FILE = token.secret

all: clean generate_grpc build upload

build:
	python setup.py sdist bdist_wheel

upload:
	@echo "Uploading to PyPI..."
	@TOKEN=$$(cat $(TOKEN_FILE)) && \
	twine upload -r pypi -u __token__ -p $$TOKEN dist/*

clean:
	rm -rf dist build *.egg-info
	rm -f profiler/profiler_output_pb2.py profiler/profiler_output_pb2_grpc.py

generate_grpc:
	python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. ./profiler/profiler_output.proto

.PHONY: all build upload clean generate_grpc
