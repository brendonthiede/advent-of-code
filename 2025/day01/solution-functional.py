#!/usr/bin/env python3

from functools import reduce
from pathlib import Path
from typing import NamedTuple

class DialState(NamedTuple):
    position: int
    zero_stops: int
    zero_passes: int


def parse_instruction(line: str) -> tuple[str, int]:
    return line[0], int(line[1:])


def process_instruction(state: DialState, instruction: tuple[str, int]) -> DialState:
    direction, amount = instruction
    
    full_rotations = amount // 100
    remaining = (amount % 100) * (1 if direction == "R" else -1)    
    new_position = state.position + remaining
    
    crossed_zero = not (0 <= new_position <= 100) and state.position != 0
    normalized_position = new_position % 100
    stopped_at_zero = normalized_position == 0
    
    new_zero_passes = (
        state.zero_passes 
        + full_rotations 
        + (1 if crossed_zero else 0)
        + (1 if stopped_at_zero else 0)
    )
    new_zero_stops = state.zero_stops + (1 if stopped_at_zero else 0)
    
    return DialState(normalized_position, new_zero_stops, new_zero_passes)


def instructions(text: str):
    return (parse_instruction(line) for line in text.splitlines())


def solution(file_name: str, part: int):
    inputs = Path(__file__).with_name(file_name).read_text()
    
    initial_state = DialState(position=50, zero_stops=0, zero_passes=0)
    final_state = reduce(process_instruction, instructions(inputs), initial_state)
    
    return final_state.zero_stops if part == 1 else final_state.zero_passes

sample_part1_expected = 3
sample_part1_actual = solution("sample.txt", 1)
assert sample_part1_actual == sample_part1_expected, f"Part 1: expected {sample_part1_expected}, got {sample_part1_actual}"

print("Answer for part 1:", solution("input.txt", 1))

sample_part2_expected = 6
sample_part2_actual = solution("sample.txt", 2)
assert sample_part2_actual == sample_part2_expected, f"Part 2: expected {sample_part2_expected}, got {sample_part2_actual}"

print("Answer for part 2:", solution("input.txt", 2))