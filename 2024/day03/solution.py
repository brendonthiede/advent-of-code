#!/usr/bin/env python3

import os
import re

with open(os.path.join(os.path.dirname(__file__), "input.txt"), "r") as file:
    inputs = file.read()

def multiply_some_numbers(input_text, dont_value):
    pattern = re.compile(r'mul\((\d+),(\d+)\)|do\(\)|don\'t\(\)')
    total = 0
    do_operation = True
    for match in pattern.finditer(input_text):
        if match.group() == "do()":
            do_operation = True
        elif match.group() == "don't()":
            do_operation = dont_value
        elif do_operation:
            first, second = map(int, match.groups()[:2])
            total += first * second
    return total

part_one_value = multiply_some_numbers(inputs, True)
print("Answer for part 1:", part_one_value)

part_two_value = multiply_some_numbers(inputs, False)
print("Answer for part 2:", part_two_value)
