#!/usr/bin/env python3

from pathlib import Path
from collections import defaultdict
from functools import lru_cache


def solution(file_name: str, part: int):
    inputs = Path(__file__).with_name(file_name).read_text()
    connections = defaultdict(set)
    for line in inputs.splitlines():
        device, connected_devices = line.split(': ')
        connections[device].update(connected_devices.split())
    
    frozen_connections = {k: frozenset(v) for k, v in connections.items()}

    @lru_cache(maxsize=None)
    def count_paths(current: str, required_1: str = '', required_2: str = '') -> int:
        if current == required_1:
            required_1 = ''
        if current == required_2:
            required_2 = ''
        
        if current == 'out':
            return 1 if ((required_1 == '' and required_2 == '')) else 0
        if current not in frozen_connections:
            return 0
        return sum(count_paths(next_device, required_1, required_2) 
                   for next_device in frozen_connections[current])

    if part == 1:
        return count_paths('you')
    else:
        return count_paths('svr', 'dac', 'fft')


sample_part1_expected = 5
sample_part1_actual = solution("sample.txt", 1)
assert (
    sample_part1_actual == sample_part1_expected
), f"Part 1: expected {sample_part1_expected}, got {sample_part1_actual}"

print("Answer for part 1:", solution("input.txt", 1))

sample_part2_expected = 2
sample_part2_actual = solution("sample2.txt", 2)
assert (
    sample_part2_actual == sample_part2_expected
), f"Part 2: expected {sample_part2_expected}, got {sample_part2_actual}"

print("Answer for part 2:", solution("input.txt", 2))
