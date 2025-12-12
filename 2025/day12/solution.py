#!/usr/bin/env python3

from pathlib import Path


def solution(file_name: str):
    inputs = Path(__file__).with_name(file_name).read_text()
    lines = inputs.strip().split('\n')
    
    present_areas = []
    present_shapes = []
    current_shape_cells = 0
    current_shape_lines = []
    fit_count = 0

    for line in lines:
        # header for new present shape
        if line.endswith(':'):
            current_shape_cells = 0
            current_shape_lines = []
        # part of present shape
        elif '#' in line:
            current_shape_cells += line.count('#')
            current_shape_lines.append(line)
        # end of present shape
        elif line == '':
            present_areas.append(current_shape_cells)
            present_shapes.append(current_shape_lines)
        # region spec
        elif 'x' in line:
            size_str, counts_str = line.split(': ')
            width, height = map(int, size_str.split('x'))
            counts = list(map(int, counts_str.split()))
            
            region_area = width * height
            total_present_area = sum(qty * cells for qty, cells in zip(counts, present_areas))
            
            # gap shapes will require an extra square if there are an odd count
            gap_shape_indices = []
            for i, shape in enumerate(present_shapes):
                # look for a "U" shape
                if len(shape) == 3:
                    top_count = shape[0].count('#')
                    mid_count = shape[1].count('#')
                    bot_count = shape[2].count('#')
                    if top_count == 3 and mid_count < 3 and bot_count < 3:
                        gap_shape_indices.append(i)
            
            extra_area = 0
            for idx in gap_shape_indices:
                if counts[idx] % 2 == 1:
                    shape = present_shapes[idx]
                    cells = present_areas[idx]
                    bounding = len(shape) * len(shape[0])
                    extra_area += 2 * bounding - cells
            
            if region_area > total_present_area + extra_area:
                fit_count += 1
    return fit_count



sample_part1_expected = 2
sample_part1_actual = solution("sample.txt")
assert (
    sample_part1_actual == sample_part1_expected
), f"Part 1: expected {sample_part1_expected}, got {sample_part1_actual}"

print("Answer for part 1:", solution("input.txt"))
