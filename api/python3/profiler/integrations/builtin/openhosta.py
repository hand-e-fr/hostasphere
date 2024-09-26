from typing import Callable

from profiler.integrations.custom_tracer import CustomTracer


class OpenHostaTracer(CustomTracer):
    def inspect_func(self, func: Callable) -> dict[str, str]:
        result = {}
        # check if func have attribute _last_response and add it to result
        if hasattr(func, "_last_response"):
            result["_last_response"] = getattr(func, "_last_response")
        # check if func have attribute _last_request and add it to result
        if hasattr(func, "_last_request"):
            result["_last_request"] = getattr(func, "_last_request")
        return result