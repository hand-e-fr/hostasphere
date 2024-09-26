from abc import ABC, abstractmethod
from typing import Callable

from .builtin.openhosta import OpenHostaTracer


class CustomTracer(ABC):
    @abstractmethod
    def inspect_func(self, func: Callable) -> dict[str, str]:
        pass


_tracer_registry = {
    "openhosta": OpenHostaTracer(),
}

def get_tracer(tracer_name: str) -> CustomTracer:
    return _tracer_registry[tracer_name]

def call_custom_tracers(func: Callable) -> dict[str, dict[str, str]]:
    result = {}
    for tracer in _tracer_registry.values():
        result[tracer.__class__.__name__] = tracer.inspect_func(func)
    return result
