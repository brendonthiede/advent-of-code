#!/usr/bin/env python3

import os
import re
from dataclasses import dataclass
from typing import List, Tuple
import numpy

@dataclass
class MachineConfig:
    button_a: Tuple[int, int]
    button_b: Tuple[int, int]
    prize_location: Tuple[int, int]

def parse_line(line: str) -> Tuple[int, int]:
    match = re.search(r'X[\+=](-?\d+),\s*Y[\+=](-?\d+)', line)
    if match:
        return (int(match.group(1)), int(match.group(2)))
    return (0, 0)

def parse_input(lines: List[str]) -> List[MachineConfig]:
    machine_configs = []
    for i in range(0, len(lines), 4):
        if i + 3 > len(lines):
            break
        machine_configs.append(MachineConfig(
            button_a=parse_line(lines[i]),
            button_b=parse_line(lines[i + 1]),
            prize_location=parse_line(lines[i + 2])
        ))
    return machine_configs

# a_presses * a_x + b_presses * b_x = prize_location_x
# a_presses * a_y + b_presses * b_y = prize_location_y
def can_win_prize(machine: MachineConfig, part: int) -> Tuple[int, int]:
    prize_location_offset = 10000000000000 if part == 2 else 0
    btn_a_delta_x = machine.button_a[0]
    btn_a_delta_y = machine.button_a[1]
    btn_b_delta_x = machine.button_b[0]
    btn_b_delta_y = machine.button_b[1]
    # Adjust prize location with the offset
    prize_x = machine.prize_location[0] + prize_location_offset
    prize_y = machine.prize_location[1] + prize_location_offset
    
    # Create the coefficient matrix and result vector from button coordinates and prize location
    coeff_matrix = numpy.array([[btn_a_delta_x, btn_b_delta_x], [btn_a_delta_y, btn_b_delta_y]])
    result_vector = numpy.array([prize_x, prize_y])
    
    solution = numpy.linalg.solve(coeff_matrix, result_vector)
    
    # convert the solution to integers
    solution = numpy.round(solution).astype(int)
    if solution[0] * btn_a_delta_x + solution[1] * btn_b_delta_x != prize_x or solution[0] * btn_a_delta_y + solution[1] * btn_b_delta_y != prize_y:
        return None

    return tuple(solution)

def calculate_tokens(a_presses: int, b_presses: int) -> int:
    return a_presses * 3 + b_presses

def solve(machines: List[MachineConfig], part: int) -> int:
    total_cost = 0
    
    for machine in machines:
        result = can_win_prize(machine, part)
        if result:
            a_presses, b_presses = result
            tokens = calculate_tokens(a_presses, b_presses)
            total_cost += tokens
            
    return total_cost

with open(os.path.join(os.path.dirname(__file__), "input.txt"), "r") as file:
    lines = [line.strip() for line in file]

machine_configs = parse_input(lines)
print("Answer for part 1:", solve(machine_configs, 1))
print("Answer for part 2:", solve(machine_configs, 2))
