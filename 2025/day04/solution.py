#!/usr/bin/env python3

from pathlib import Path

def solution(file_name: str, part: int):
    inputs = Path(__file__).with_name(file_name).read_text()

    total_forklift_accessible = 0

    grid = [list(line) for line in inputs.splitlines()]
    rows = len(grid)
    cols = len(grid[0])
    
    directions = []
    for dr in [-1, 0, 1]:
        for dc in [-1, 0, 1]:
            if dr == 0 and dc == 0:
                continue
            directions.append((dr, dc))
    
    found_accessible = True
    while found_accessible:
        found_accessible = False
        for row in range(rows):
            for col in range(cols):
                char = grid[row][col]
                if char == '@':
                    adjacent_rolls = 0
                    for dr, dc in directions:
                        new_row, new_col = row + dr, col + dc

                        if 0 <= new_row < rows and 0 <= new_col < cols:
                            if grid[new_row][new_col] == '@':
                                adjacent_rolls += 1
                                if adjacent_rolls == 4:
                                    break
                    if adjacent_rolls < 4:
                        total_forklift_accessible += 1
                        if part == 2:
                            grid[row][col] = 'x'
                            found_accessible = True
    
    return total_forklift_accessible

sample_part1_expected = 13
sample_part1_actual = solution("sample.txt", 1)
assert sample_part1_actual == sample_part1_expected, f"Part 1: expected {sample_part1_expected}, got {sample_part1_actual}"

print("Answer for part 1:", solution("input.txt", 1))

sample_part2_expected = 43
sample_part2_actual = solution("sample.txt", 2)
assert sample_part2_actual == sample_part2_expected, f"Part 2: expected {sample_part2_expected}, got {sample_part2_actual}"

print("Answer for part 2:", solution("input.txt", 2))