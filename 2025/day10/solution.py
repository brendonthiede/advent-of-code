#!/usr/bin/env python3

from pathlib import Path
from itertools import combinations
import re
from scipy.optimize import milp, LinearConstraint, Bounds
import numpy


def parse_machine(line):
    # between [ ]
    target_str = line[line.index('[')+1:line.index(']')]
    target_state = [c == '#' for c in target_str]
    
    # between ] and {
    button_section = line[line.index(']')+1:line.index('{')].strip()
    buttons = []
    # loop over all ( ) groups
    for match in re.findall(r'\(([^)]+)\)', button_section):
        indices = set(int(x) for x in match.split(','))
        buttons.append(indices)
    
    # between { }
    joltage_str = line[line.index('{')+1:line.index('}')]
    joltages = [int(x) for x in joltage_str.split(',')]
    
    return target_state, buttons, joltages


def part_one(target_state, buttons):
    light_count = len(target_state)
    button_count = len(buttons)
    
    for num_of_presses in range(button_count + 1):
        # test combinations of increasing length; return first success
        for combo in combinations(range(button_count), num_of_presses):
            current_state = [False] * light_count
            for btn_idx in combo:
                for light_idx in buttons[btn_idx]:
                    if light_idx < light_count:
                        current_state[light_idx] = not current_state[light_idx]
            if current_state == target_state:
                return num_of_presses


def part_two(buttons, joltages):    
    button_count = len(buttons)
    joltage_count = len(joltages)
    
    # coefficient matrix A where A[joltage_idx][button_idx] = 1 if that button affects that joltage
    A = numpy.zeros((joltage_count, button_count))
    for btn_idx, button in enumerate(buttons):
        for joltage_idx in button:
            if joltage_idx < joltage_count:
                A[joltage_idx][btn_idx] = 1
    
    # minimize sum of all button presses
    c = numpy.ones(button_count)
    # equality constraints: A @ x = joltages
    constraints = LinearConstraint(A, joltages, joltages)
    # don't allow negative button presses
    bounds = Bounds(0, numpy.inf)
    # all variables must be integers
    integrality = numpy.ones(button_count)
    result = milp(c, constraints=constraints, bounds=bounds, integrality=integrality)

    return int(round(result.fun))


def solution(file_name: str, part: int):
    inputs = Path(__file__).with_name(file_name).read_text()

    total_presses = 0
    for line in inputs.splitlines():
        target_state, buttons, joltages = parse_machine(line)
        if part == 1:
            min_presses = part_one(target_state, buttons)
        else:
            min_presses = part_two(buttons, joltages)
        total_presses += min_presses
    
    return total_presses


sample_part1_expected = 7
sample_part1_actual = solution("sample.txt", 1)
assert (
    sample_part1_actual == sample_part1_expected
), f"Part 1: expected {sample_part1_expected}, got {sample_part1_actual}"

print("Answer for part 1:", solution("input.txt", 1))

sample_part2_expected = 33
sample_part2_actual = solution("sample.txt", 2)
assert (
    sample_part2_actual == sample_part2_expected
), f"Part 2: expected {sample_part2_expected}, got {sample_part2_actual}"

print("Answer for part 2:", solution("input.txt", 2))
