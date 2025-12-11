#!/usr/bin/env python3

from functools import reduce
from pathlib import Path
from typing import NamedTuple


class Range(NamedTuple):
    start: int
    end: int


def parse_range(line: str) -> Range:
    start, end = line.split("-")
    return Range(int(start), int(end))


def merge_range(combined: tuple[Range, ...], current: Range) -> tuple[Range, ...]:
    if not combined:
        return (current,)
    last = combined[-1]
    if current.start <= last.end:
        return combined[:-1] + (Range(last.start, max(last.end, current.end)),)
    return combined + (current,)


def combine_ranges(ranges: tuple[Range, ...]) -> tuple[Range, ...]:
    sorted_ranges = tuple(sorted(ranges))
    return reduce(merge_range, sorted_ranges, ())


def is_in_ranges(value: int, ranges: tuple[Range, ...]) -> bool:
    return any(r.start <= value <= r.end for r in ranges)


def range_length(r: Range) -> int:
    return r.end - r.start + 1


def solution(file_name: str, part: int):
    inputs = Path(__file__).with_name(file_name).read_text()

    # split input into ranges and ingredients
    ranges_section, ingredients_section = inputs.split("\n\n", maxsplit=1)
    
    ranges = combine_ranges(
        tuple(parse_range(line) for line in ranges_section.strip().splitlines())
    )
    ingredients = (int(line) for line in ingredients_section.strip().splitlines())

    if part == 1:
        return sum(1 for ing in ingredients if is_in_ranges(ing, ranges))
    else:
        return sum(range_length(r) for r in ranges)

sample_part1_expected = 3
sample_part1_actual = solution("sample.txt", 1)
assert sample_part1_actual == sample_part1_expected, f"Part 1: expected {sample_part1_expected}, got {sample_part1_actual}"

print("Answer for part 1:", solution("input.txt", 1))

sample_part2_expected = 14
sample_part2_actual = solution("sample.txt", 2)
assert sample_part2_actual == sample_part2_expected, f"Part 2: expected {sample_part2_expected}, got {sample_part2_actual}"

print("Answer for part 2:", solution("input.txt", 2))