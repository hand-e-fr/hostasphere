from setuptools import setup, find_packages

setup(
    name="hostasphere_profiler",
    version="0.0.4",
    packages=find_packages(),
    install_requires=[
        "requests",
        "psutil"
    ],
    author="William Jolivet",
    description="Hostasphere Profiler API",
    author_email="william.jolivet@epitech.eu",
    long_description=open('README.md').read(),
    long_description_content_type='text/markdown',
    url="https://github.com/hand-e-fr/hostasphere",
    python_requires='>=3.6',
)