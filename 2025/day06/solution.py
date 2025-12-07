#!/usr/bin/env python3

from math import prod
from pathlib import Path


def solution(file_name: str, part: int):
    inputs = Path(__file__).with_name(file_name).read_text()
    lines = inputs.splitlines()
    
    if part == 1:
        number_rows = [list(map(int, line.split())) for line in lines[:-1]]
        operators = lines[-1].split()
        problems = [(op, [row[col] for row in number_rows]) for col, op in enumerate(operators)]
    else:
        max_len = max(len(line) for line in lines)
        lines = [line.ljust(max_len) for line in lines]
        number_lines, op_line = lines[:-1], lines[-1]
        
        problems = []
        current_numbers = []
        current_operator = None
        
        for col in range(max_len - 1, -1, -1):
            column_chars = [line[col] for line in number_lines]
            is_separator = all(c == ' ' for c in column_chars)
            
            if not is_separator:
                num_str = ''.join(c for c in column_chars if c.isdigit())
                if num_str:
                    current_numbers.append(int(num_str))
            
            if op_line[col] in '+*':
                current_operator = op_line[col]
            elif is_separator and current_operator:
                problems.append((current_operator, current_numbers))
                current_numbers = []
                current_operator = None
        
        if current_operator and current_numbers:
            problems.append((current_operator, current_numbers))
    
    return sum(sum(nums) if op == '+' else prod(nums) for op, nums in problems)


sample_part1_expected = 4277556
sample_part1_actual = solution("sample.txt", 1)
assert sample_part1_actual == sample_part1_expected, f"Part 1: expected {sample_part1_expected}, got {sample_part1_actual}"

print("Answer for part 1:", solution("input.txt", 1))

sample_part2_expected = 3263827
sample_part2_actual = solution("sample.txt", 2)
assert sample_part2_actual == sample_part2_expected, f"Part 2: expected {sample_part2_expected}, got {sample_part2_actual}"

print("Answer for part 2:", solution("input.txt", 2))