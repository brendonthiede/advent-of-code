#!/usr/bin/env python3

from pathlib import Path

def solution(file_name: str, part: int):
    inputs = Path(__file__).with_name(file_name).read_text()
    # separate the inputs on commas
    inputs = inputs.split(",")
    invalid_id_list = []
    # for each input, split on a - to create the limits of the range to check
    for input in inputs:
        limits = input.split("-")
        lower_limit = int(limits[0])
        upper_limit = int(limits[1])
        # for each number in the range, check if it is a valid id
        for id_number in range(lower_limit, upper_limit + 1):
            id_str = str(id_number)

            if part == 1:
                # split the number into 2 halves
                half_length = len(id_str) // 2
                first_half = id_str[:half_length]
                second_half = id_str[half_length:]
                # check if the two halves are the same
                if first_half == second_half:
                    invalid_id_list.append(id_number)
            elif part == 2:
                # for any substring length from 1 to half the length of the id_str, check if the rest of the string is composed of only that substring repeated
                for sub_length in range(1, len(id_str) // 2 + 1):
                    substring = id_str[:sub_length]
                    repetitions = len(id_str) // sub_length
                    if substring * repetitions == id_str:
                        invalid_id_list.append(id_number)
                        break
    return sum(invalid_id_list)

sample_part1_expected = 1227775554
sample_part1_actual = solution("sample.txt", 1)
assert sample_part1_actual == sample_part1_expected, f"Part 1: expected {sample_part1_expected}, got {sample_part1_actual}"

print("Answer for part 1:", solution("input.txt", 1))

sample_part2_expected = 4174379265
sample_part2_actual = solution("sample.txt", 2)
assert sample_part2_actual == sample_part2_expected, f"Part 2: expected {sample_part2_expected}, got {sample_part2_actual}"

print("Answer for part 2:", solution("input.txt", 2))