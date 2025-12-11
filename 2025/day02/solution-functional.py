#!/usr/bin/env python3

from pathlib import Path
from typing import NamedTuple, Iterator
from functools import reduce
from itertools import chain, filterfalse
from operator import add


class Range(NamedTuple):
    lower: int
    upper: int


class DigitConfig(NamedTuple):
    num_digits: int
    half_digits: int
    multiplier: int
    base_min: int
    base_max: int
    range_min: int
    range_max: int


def parse_range(range_str: str) -> Range:
    lower, upper = map(int, range_str.split("-"))
    return Range(lower, upper)


def digit_range(lower: int, upper: int) -> Iterator[int]:
    min_digits = len(str(lower))
    max_digits = len(str(upper))
    start = min_digits if min_digits % 2 == 0 else min_digits + 1
    return range(start, max_digits + 1, 2)


def make_digit_config(num_digits: int, lower: int, upper: int) -> DigitConfig:
    half_digits = num_digits // 2
    multiplier = 10 ** half_digits + 1
    base_min = 10 ** (half_digits - 1) if half_digits > 1 else 1
    base_max = 10 ** half_digits - 1
    range_min = max(lower, 10 ** (num_digits - 1)) if num_digits > 1 else lower
    range_max = min(upper, 10 ** num_digits - 1)
    return DigitConfig(num_digits, half_digits, multiplier, base_min, base_max, range_min, range_max)


def sum_for_digit_config(config: DigitConfig) -> int:
    effective_base_min = max(config.base_min, (config.range_min + config.multiplier - 1) // config.multiplier)
    effective_base_max = min(config.base_max, config.range_max // config.multiplier)
    count = effective_base_max - effective_base_min + 1
    return (
        (effective_base_min + effective_base_max) * count // 2 * config.multiplier
        if count > 0 else 0
    )


def sum_half_repeated_in_range(r: Range) -> int:
    configs = (make_digit_config(n, r.lower, r.upper) for n in digit_range(r.lower, r.upper))
    return reduce(add, map(sum_for_digit_config, configs), 0)


def divisors_up_to_half(n: int) -> Iterator[int]:
    return (d for d in range(1, n // 2 + 1) if n % d == 0)


def build_repeated_number(base: int, scale: int, reps: int) -> int:
    return reduce(lambda acc, _: acc * scale + base, range(reps), 0)


def generate_repeated_numbers(sub_len: int, num_digits: int) -> Iterator[int]:
    reps = num_digits // sub_len
    scale = 10 ** sub_len
    base_min = 10 ** (sub_len - 1) if sub_len > 1 else 0
    base_max = 10 ** sub_len - 1
    return (build_repeated_number(base, scale, reps) for base in range(base_min, base_max + 1))


def in_range(range_min: int, range_max: int):
    return lambda num: range_min <= num <= range_max


def unique_repeated_numbers_for_digits(num_digits: int, range_min: int, range_max: int) -> frozenset[int]:
    all_candidates = chain.from_iterable(
        generate_repeated_numbers(sub_len, num_digits)
        for sub_len in divisors_up_to_half(num_digits)
    )
    return frozenset(filter(in_range(range_min, range_max), all_candidates))


def sum_substring_repeated_for_digits(num_digits: int, lower: int, upper: int) -> int:
    range_min = max(lower, 10 ** (num_digits - 1)) if num_digits > 1 else max(lower, 1)
    range_max = min(upper, 10 ** num_digits - 1)
    return sum(unique_repeated_numbers_for_digits(num_digits, range_min, range_max)) if range_min <= range_max else 0


def sum_substring_repeated_in_range(r: Range) -> int:
    min_digits = len(str(r.lower))
    max_digits = len(str(r.upper))
    return reduce(
        add,
        (sum_substring_repeated_for_digits(n, r.lower, r.upper) for n in range(min_digits, max_digits + 1)),
        0
    )


def solution(file_name: str, part: int) -> int:
    inputs = Path(__file__).with_name(file_name).read_text()
    ranges = tuple(map(parse_range, inputs.split(",")))
    if part == 1:
        solver = sum_half_repeated_in_range
    else:
        solver = sum_substring_repeated_in_range
    return reduce(add, map(solver, ranges), 0)

sample_part1_expected = 1227775554
sample_part1_actual = solution("sample.txt", 1)
assert sample_part1_actual == sample_part1_expected, f"Part 1: expected {sample_part1_expected}, got {sample_part1_actual}"

print("Answer for part 1:", solution("input.txt", 1))

sample_part2_expected = 4174379265
sample_part2_actual = solution("sample.txt", 2)
assert sample_part2_actual == sample_part2_expected, f"Part 2: expected {sample_part2_expected}, got {sample_part2_actual}"

print("Answer for part 2:", solution("input.txt", 2))