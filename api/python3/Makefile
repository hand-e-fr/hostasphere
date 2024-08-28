TOKEN_FILE = token.secret

.PHONY: all build upload clean

all: clean build upload clean

build:
	python setup.py sdist bdist_wheel

upload:
	@echo "Uploading to PyPI..."
	@TOKEN=$$(cat $(TOKEN_FILE)) && \
	twine upload -r pypi -u __token__ -p $$TOKEN dist/*

clean:
	rm -rf dist build *.egg-info