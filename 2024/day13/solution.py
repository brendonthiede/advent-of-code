#!/usr/bin/env python3

import os
import re
from dataclasses import dataclass
from typing import List, Tuple

@dataclass
class MachineConfig:
    button_a: Tuple[int, int]
    button_b: Tuple[int, int]
    prize: Tuple[int, int]

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
            prize=parse_line(lines[i + 2])
        ))
    return machine_configs

def can_win_prize(a_moves: List[int], b_moves: List[int], prize: List[int], max_presses: int = 10000) -> Tuple[int, int]:
    for a in range(max_presses + 1):
        for b in range(max_presses + 1):
            x = a * a_moves[0] + b * b_moves[0]
            y = a * a_moves[1] + b * b_moves[1]
            if x == prize[0] and y == prize[1]:
                return (a, b)
            if x > prize[0] or y > prize[1]:
                break
    return None

def calculate_tokens(a_presses: int, b_presses: int) -> int:
    return a_presses * 3 + b_presses

def solve(machines: List[MachineConfig]) -> int:
    total_cost = 0
    
    for machine in machines:
        result = can_win_prize(machine.button_a, machine.button_b, machine.prize)
        if result:
            a_presses, b_presses = result
            tokens = calculate_tokens(a_presses, b_presses)
            total_cost += tokens
            
    return total_cost

with open(os.path.join(os.path.dirname(__file__), "input.txt"), "r") as file:
    lines = [line.strip() for line in file]

machine_configs = parse_input(lines)
print("Answer for part 1:", solve(machine_configs))
