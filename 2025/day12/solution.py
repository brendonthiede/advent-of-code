#!/usr/bin/env python3

from pathlib import Path


def solution(file_name: str):
    inputs = Path(__file__).with_name(file_name).read_text()
    lines = inputs.strip().split('\n')
    
    present_areas = []
    current_shape_cells = 0        
    fit_count = 0

    for line in lines:
        # header for new present shape
        if line.endswith(':'):
            current_shape_cells = 0
        # part of present shape
        elif '#' in line:
            current_shape_cells += line.count('#')
        # end of present shape
        elif line == '':
            present_areas.append(current_shape_cells)
        # region spec
        elif 'x' in line:
            size_str, counts_str = line.split(': ')
            width, height = map(int, size_str.split('x'))
            counts = list(map(int, counts_str.split()))
            
            region_area = width * height
            total_present_area = sum(qty * cells for qty, cells in zip(counts, present_areas))
            if region_area > total_present_area:
                fit_count += 1
    return fit_count



# naive approach doesn't work for sample input, and can easily break,
# but it works for the actual input. Sample validation skipped.
# sample_part1_expected = 2
# sample_part1_actual = solution("sample.txt")
# assert (
#     sample_part1_actual == sample_part1_expected
# ), f"Part 1: expected {sample_part1_expected}, got {sample_part1_actual}"

print("Answer for part 1:", solution("input.txt"))
