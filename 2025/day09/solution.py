#!/usr/bin/env python3

from pathlib import Path
from shapely.geometry import Polygon, box
from shapely.prepared import prep

def get_rectangles(red_tiles):
    rectangles = []
    n = len(red_tiles)
    for i in range(n):
        for j in range(i, n):
            x1, y1 = red_tiles[i]
            x2, y2 = red_tiles[j]
            x_min, x_max = min(x1, x2), max(x1, x2)
            y_min, y_max = min(y1, y2), max(y1, y2)
            width = x_max - x_min + 1
            height = y_max - y_min + 1
            area = width * height
            rectangles.append((area, x_min, y_min, x_max, y_max))
    
    rectangles.sort(reverse=True)
    return rectangles

def part_one(rectangles):
    return rectangles[0][0]

def part_two(rectangles, red_tiles):
    poly = Polygon(red_tiles)
    # for faster repeated boundary checks
    prepared_poly = prep(poly)
    
    # find the largest rectangle that fits in the polygon
    for area, x_min, y_min, x_max, y_max in rectangles:
        rect = box(x_min, y_min, x_max, y_max)
        if prepared_poly.covers(rect):
            return area
    
    return 0

def solution(file_name: str, part: int):
    inputs = Path(__file__).with_name(file_name).read_text().strip()
    
    red_tiles = []
    lines = inputs.splitlines()
    
    for line in lines:
        x, y = map(int, line.split(','))
        red_tiles.append((x, y))
    
    rectangles = get_rectangles(red_tiles)

    if part == 1:
        return part_one(rectangles)
    else:
        return part_two(rectangles, red_tiles)

sample_part1_expected = 50
sample_part1_actual = solution("sample.txt", 1)
assert (
    sample_part1_actual == sample_part1_expected
), f"Part 1: expected {sample_part1_expected}, got {sample_part1_actual}"

print("Answer for part 1:", solution("input.txt", 1))

sample_part2_expected = 24
sample_part2_actual = solution("sample.txt", 2)
assert (
    sample_part2_actual == sample_part2_expected
), f"Part 2: expected {sample_part2_expected}, got {sample_part2_actual}"

print("Answer for part 2:", solution("input.txt", 2))