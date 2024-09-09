import inspect
import json
from functools import wraps
from typing import Any, Callable, Dict, List
from graphviz import Digraph

# Global dictionary to store the call tree
call_tree: Dict[str, List[Dict[str, Any]]] = {}


def track_calls(func: Callable) -> Callable:
    """Decorator to track function calls, parameters, and results."""

    @wraps(func)
    def wrapper(*args, **kwargs):
        # Get the caller's frame
        caller_frame = inspect.currentframe().f_back
        caller_name = caller_frame.f_code.co_name

        # Get the current function's name
        func_name = func.__name__

        # Capture the parameters
        params = inspect.signature(func).bind(*args, **kwargs).arguments
        params = {k: v for k, v in params.items()}

        # Call the original function and capture the result
        result = func(*args, **kwargs)

        # Initialize the list of callees if not already
        if caller_name not in call_tree:
            call_tree[caller_name] = []

        # Add the current function call details to the caller's list of callees
        call_tree[caller_name].append({
            'function': func_name,
            'params': params,
            'result': result
        })

        return result

    return wrapper


# Example functions with the track_calls decorator
@track_calls
def function_a(x, y):
    return function_b(x) + function_c(y)


@track_calls
def function_b(x):
    return function_d(x * 2)


@track_calls
def function_c(y):
    return y * 3


@track_calls
def function_d(z):
    return z + 1

@track_calls
def generate_call_tree():
    # Start the function calls to populate the call tree
    result = function_a(5, 10)

    # Output the call tree to a JSON file
    with open('call_tree.json', 'w') as f:
        json.dump(call_tree, f, indent=4)

    return result


def visualize_call_tree():
    dot = Digraph(comment='Call Tree')

    for caller, callees in call_tree.items():
        for callee in callees:
            if isinstance(callee, dict):  # Ensure callee is a dictionary
                callee_name = callee['function']
                params = ', '.join(
                    f"{k}={v}" for k, v in callee['params'].items())
                result = callee['result']

                # Add nodes and edges with labels
                dot.node(caller, caller)
                dot.node(callee_name, f"{callee_name}({params}) = {result}")
                dot.edge(caller, callee_name)

    # Save the graph as a PNG file
    dot.render('call_tree', format='png', cleanup=True)


import random
import string
import time
from collections import Counter

def generate_random_string(length):
    """Génère une chaîne aléatoire de lettres majuscules et minuscules."""
    return ''.join(random.choices(string.ascii_letters, k=length))

def is_prime(n):
    """Vérifie si un nombre est premier."""
    if n <= 1:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

def fibonacci(n):
    """Retourne le n-ième nombre de la suite de Fibonacci."""
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

def sort_numbers(arr):
    """Trie une liste de nombres."""
    return sorted(arr)

def factorial(n):
    """Calcule la factorielle d'un nombre."""
    if n == 0:
        return 1
    else:
        return n * factorial(n - 1)

def count_vowels(s):
    """Compte le nombre de voyelles dans une chaîne."""
    vowels = 'aeiouAEIOU'
    return sum(1 for char in s if char in vowels)

def reverse_string(s):
    """Inverse une chaîne de caractères."""
    return s[::-1]

def find_most_common_element(lst):
    """Trouve l'élément le plus commun dans une liste."""
    data = Counter(lst)
    return data.most_common(1)[0][0]

@track_calls
def matrix_multiplication(matrix_a, matrix_b):
    """Multiplie deux matrices."""
    result = [[sum(a * b for a, b in zip(row_a, col_b)) for col_b in zip(*matrix_b)] for row_a in matrix_a]
    return result

@track_calls
def stress_test():
    """Exécute un test de stress en appelant toutes les fonctions avec des valeurs aléatoires."""
    # Test de la génération de chaîne aléatoire
    random_string = generate_random_string(1000)
    print(f"Random String: {random_string[:50]}...")

    # Test de la fonction de nombre premier
    primes = [n for n in range(10000, 10100) if is_prime(n)]
    print(f"Primes: {primes}")

    # Test de la suite de Fibonacci
    fib_number = fibonacci(30)
    print(f"30th Fibonacci Number: {fib_number}")

    # Test du tri de nombres
    random_numbers = [random.randint(0, 1000) for _ in range(1000)]
    sorted_numbers = sort_numbers(random_numbers)
    print(f"First 10 Sorted Numbers: {sorted_numbers[:10]}")

    # Test de la factorielle
    factorial_result = factorial(20)
    print(f"Factorial of 20: {factorial_result}")

    # Test du comptage de voyelles
    vowel_count = count_vowels(random_string)
    print(f"Vowel Count: {vowel_count}")

    # Test de l'inversion de chaîne
    reversed_string = reverse_string(random_string)
    print(f"Reversed String: {reversed_string[:50]}...")

    # Test de l'élément le plus commun
    most_common = find_most_common_element(random_numbers)
    print(f"Most Common Element: {most_common}")

    # Test de la multiplication de matrices
    matrix_a = [[random.randint(0, 10) for _ in range(3)] for _ in range(3)]
    matrix_b = [[random.randint(0, 10) for _ in range(3)] for _ in range(3)]
    matrix_result = matrix_multiplication(matrix_a, matrix_b)
    print(f"Matrix Multiplication Result: {matrix_result}")


if __name__ == "__main__":
    stress_test()
    generate_call_tree()
    visualize_call_tree()