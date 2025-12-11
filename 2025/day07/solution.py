#!/usr/bin/env python3

from pathlib import Path
from collections import defaultdict

def solution(file_name: str, part: int):
    inputs = Path(__file__).with_name(file_name).read_text()
    grid = inputs.splitlines()
    
    if part == 1:
        active_beams = {grid[0].index('S')}
        split_count = 0
        
        for row_idx in range(2, len(grid), 2):
            row = grid[row_idx]
            new_beams = set()
            
            for col in active_beams:
                cell = row[col]
                if cell == '^':
                    split_count += 1
                    new_beams.add(col - 1)
                    new_beams.add(col + 1)
                else:
                    new_beams.add(col)
            
            active_beams = new_beams
        
        return split_count
    
    else:
        timelines = defaultdict(int)
        timelines[grid[0].index('S')] = 1
        
        for row_idx in range(2, len(grid), 2):
            row = grid[row_idx]
            new_timelines = defaultdict(int)
            
            for col, count in timelines.items():
                cell = row[col]
                if cell == '^':
                    new_timelines[col - 1] += count
                    new_timelines[col + 1] += count
                else:
                    new_timelines[col] += count
            
            timelines = new_timelines
        
        return sum(timelines.values())

sample_part1_expected = 21
sample_part1_actual = solution("sample.txt", 1)
assert sample_part1_actual == sample_part1_expected, f"Part 1: expected {sample_part1_expected}, got {sample_part1_actual}"

print("Answer for part 1:", solution("input.txt", 1))

sample_part2_expected = 40
sample_part2_actual = solution("sample.txt", 2)
assert sample_part2_actual == sample_part2_expected, f"Part 2: expected {sample_part2_expected}, got {sample_part2_actual}"

print("Answer for part 2:", solution("input.txt", 2))