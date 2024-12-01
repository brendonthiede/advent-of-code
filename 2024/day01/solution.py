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

# Sort the columns
first_column.sort()
second_column.sort()

sum_of_differences = sum(abs(a - b) for a, b in zip(first_column, second_column))
print("Answer for part 1:", sum_of_differences)

frequency = [0] * len(first_column)
for i, value in enumerate(first_column):
    frequency[i] = second_column.count(value)

frequency_weighted_sum = sum(first_column[i] * frequency[i] for i in range(len(first_column)))
print("Answer for part 2:", frequency_weighted_sum)
