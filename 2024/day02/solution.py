#!/usr/bin/env python3

import os

with open(os.path.join(os.path.dirname(__file__), "input.txt"), "r") as file:
    inputs = file.read()

reports = []
for line in inputs.splitlines():
    reports.append(list(map(int, line.split())))

def is_safe(levels):
    max_diff = max(abs(x - y) for x, y in zip(levels, levels[1:]))
    min_diff = min(abs(x - y) for x, y in zip(levels, levels[1:]))
    is_increasing = all(x < y for x, y in zip(levels, levels[1:]))
    is_decreasing = all(x > y for x, y in zip(levels, levels[1:]))
    return (is_increasing or is_decreasing) and max_diff <= 3 and min_diff >= 1

def can_be_safe_by_removing_one(levels):
    for i in range(len(levels)):
        if is_safe(levels[:i] + levels[i+1:]):
            return True
    return False

safe_count = sum(1 for levels in reports if is_safe(levels))
print("Answer for part 1:", safe_count)

safe_by_removal_count = sum(1 for levels in reports if can_be_safe_by_removing_one(levels))
print("Answer for part 2:", safe_by_removal_count)
