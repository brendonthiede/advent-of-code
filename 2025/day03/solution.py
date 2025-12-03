#!/usr/bin/env python3

from pathlib import Path

def next_largest_available(line, starting_index, digits_remaining):
    # grab a substring, starting just past the prior found index, and ending
    # so that there are enough digits left to satisfy digits_remaining
    substring = line[starting_index:len(line) - digits_remaining + 1]
    int_list = [int(c) for c in substring]
    max_value = max(int_list)
    at_index = line.index(str(max_value), starting_index, len(line) - digits_remaining + 1)
    return (max_value, at_index)

def solution(file_name: str, part: int):
    inputs = Path(__file__).with_name(file_name).read_text()
    joltages = []
    for line in inputs.splitlines():
        digits = []
        next_largest = 10
        at_index = -1
        if part == 1:
            for i in range(2):
                next_largest, at_index = next_largest_available(line, at_index + 1, 2 - i)
                digits.append(next_largest)
            joltages.append(int("".join(map(str, digits))))
        else:  # part 2
            for i in range(12):
                next_largest, at_index = next_largest_available(line, at_index + 1, 12 - i)
                digits.append(next_largest)
            joltages.append(int("".join(map(str, digits))))
            
    return sum(joltages)

sample_part1_expected = 357
sample_part1_actual = solution("sample.txt", 1)
assert sample_part1_actual == sample_part1_expected, f"Part 1: expected {sample_part1_expected}, got {sample_part1_actual}"

print("Answer for part 1:", solution("input.txt", 1))

sample_part2_expected = 3121910778619
sample_part2_actual = solution("sample.txt", 2)
assert sample_part2_actual == sample_part2_expected, f"Part 2: expected {sample_part2_expected}, got {sample_part2_actual}"

print("Answer for part 2:", solution("input.txt", 2))