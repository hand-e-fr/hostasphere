##
## Hand-e project, 2024
## hostasphere python profiler api
## File description:
## Makefile
##

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

fclean: clean
	rm -rf .tox .pytest_cache .coverage
	rm -f profiler/profiler_output_pb2.py profiler/profiler_output_pb2_grpc.py
	rm -f profiler/token_pb2.py profiler/token_pb2_grpc.py
	rm -f profiler/session_pb2.py profiler/session_pb2_grpc.py

generate_grpc:
	python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. ./profiler/profiler_output.proto
	python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. ./profiler/token.proto
	python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. ./profiler/session.proto

.PHONY: all build upload clean generate_grpc
