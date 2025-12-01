#!/usr/bin/env python3

from pathlib import Path

def solution(file_name: str, part: int):
    inputs = Path(__file__).with_name(file_name).read_text()

    zero_stops = 0
    zero_passes = 0
    dial_position = 50

    for line in inputs.splitlines():
        direction, amount = line[0], int(line[1:])
        zero_passes += amount // 100
        amount %= 100
        prior_dial_position = dial_position
        
        dial_position += amount if direction == "R" else -amount

        if not 0 <= dial_position <= 100 and prior_dial_position != 0:
            zero_passes += 1

        dial_position %= 100
        
        if dial_position == 0:
            zero_stops += 1
            zero_passes += 1
    return zero_stops if part == 1 else zero_passes

sample_part1_expected = 3
sample_part1_actual = solution("sample.txt", 1)
assert sample_part1_actual == sample_part1_expected, f"Part 1: expected {sample_part1_expected}, got {sample_part1_actual}"

print("Answer for part 1:", solution("input.txt", 1))

sample_part2_expected = 6
sample_part2_actual = solution("sample.txt", 2)
assert sample_part2_actual == sample_part2_expected, f"Part 2: expected {sample_part2_expected}, got {sample_part2_actual}"

print("Answer for part 2:", solution("input.txt", 2))