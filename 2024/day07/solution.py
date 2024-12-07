#!/usr/bin/env python3

import os
from itertools import product

with open(os.path.join(os.path.dirname(__file__), "input.txt"), "r") as file:
    inputs = file.read()

lines = inputs.splitlines()
data = []

for line in lines:
    parts = line.split(":")
    total = int(parts[0])
    values = list(map(int, parts[1].strip().split()))
    data.append((total, values))


def solver(data, operator_options):
    grand_total = 0
    def evaluate_expression(values, operators):
        result = values[0]
        for i in range(1, len(values)):
            if operators[i-1] == '+':
                result += values[i]
            elif operators[i-1] == '*':
                result *= values[i]
            elif operators[i-1] == '||':
                result = int(f'{result}{values[i]}')
        return result

    def try_operators(total, values, operator_options):
        for operators in product(operator_options, repeat=len(values) - 1):
            if evaluate_expression(values, operators) == total:
                return True
        return False

    for total, values in data:
        if try_operators(total, values, operator_options):
            grand_total += total
    return grand_total

print("Answer for part 1:", solver(data, ['+', '*']))
print("Answer for part 2:", solver(data, ['+', '*', '||']))
