#!/usr/bin/env python3

import os

with open(os.path.join(os.path.dirname(__file__), "input.txt"), "r") as file:
    inputs = file.read()

first_column = []
second_column = []

# Parse the input
for line in inputs.splitlines():
    a, b = map(int, line.split())
    first_column.append(a)
    second_column.append(b)

sum_of_differences = sum(abs(a - b) for a, b in zip(sorted(first_column), sorted(second_column)))
print("Answer for part 1:", sum_of_differences)

frequency_weighted_sum = sum(i * second_column.count(i) for i in first_column)
print("Answer for part 2:", frequency_weighted_sum)
