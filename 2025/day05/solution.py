#!/usr/bin/env python3

from pathlib import Path

def solution(file_name: str, part: int):
    inputs = Path(__file__).with_name(file_name).read_text()

    # split input into ranges and ingredients
    ranges_section, ingredients_section = inputs.split("\n\n", maxsplit=1)
    ranges_lines = ranges_section.strip().splitlines()
    ingredients_lines = ingredients_section.strip().splitlines()

    ranges = []
    for line in ranges_lines:
        parts = line.split("-")
        start = int(parts[0])
        end = int(parts[1])
        ranges.append((start, end))
    
    ranges.sort()
    combined_ranges = []
    current_start, current_end = ranges[0]
    for start, end in ranges[1:]:
        if start <= current_end:
            current_end = max(current_end, end)
        else:
            combined_ranges.append((current_start, current_end))
            current_start, current_end = start, end
    combined_ranges.append((current_start, current_end))
    ranges = combined_ranges
    
    if part == 1:
        available_ingredients = []
        for line in ingredients_lines:
            ingredient = int(line)
            is_available = False
            for start, end in ranges:
                if start <= ingredient <= end:
                    is_available = True
                    break
            if is_available:
                available_ingredients.append(ingredient)
        return len(available_ingredients)
    else:
        total_length = 0
        for start, end in ranges:
            total_length += end - start + 1
        return total_length

sample_part1_expected = 3
sample_part1_actual = solution("sample.txt", 1)
assert sample_part1_actual == sample_part1_expected, f"Part 1: expected {sample_part1_expected}, got {sample_part1_actual}"

print("Answer for part 1:", solution("input.txt", 1))

sample_part2_expected = 14
sample_part2_actual = solution("sample.txt", 2)
assert sample_part2_actual == sample_part2_expected, f"Part 2: expected {sample_part2_expected}, got {sample_part2_actual}"

print("Answer for part 2:", solution("input.txt", 2))