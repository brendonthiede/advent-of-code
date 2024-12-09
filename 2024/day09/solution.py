#!/usr/bin/env python3

import os

with open(os.path.join(os.path.dirname(__file__), "input.txt"), "r") as file:
    inputs = file.read()

disk_map = list(map(int, inputs.strip()))

disk_blocks = []
file_positions = []
free_space_positions = []
is_file = True
file_id = 0
for size in disk_map:
    if is_file:
        for i in range(size):
            disk_blocks.append(file_id)
        file_positions.append([len(disk_blocks) - size, size])
        file_id += 1
    else:
        for i in range(size):
            disk_blocks.append(-1)
        free_space_positions.append([len(disk_blocks) - size, size])
    is_file = not is_file

def compress(disk_blocks):
    free_index = disk_blocks.index(-1)
    used_index = len(disk_blocks) - 1

    while free_index < used_index:
        disk_blocks[free_index] = disk_blocks[used_index]
        disk_blocks[used_index] = -1
        
        while disk_blocks[free_index] != -1:
            free_index += 1
        while disk_blocks[used_index] == -1:
            used_index -= 1

def move_files():
    for file_id in reversed(range(len(file_positions))):
        file_position, file_size = file_positions[file_id]
        for free_space_index, (free_space_position, free_space_size) in enumerate(free_space_positions):
            if free_space_position > file_position:
                break
            if free_space_size >= file_size:
                file_positions[file_id][0] = free_space_position
                free_space_positions[free_space_index][0] += file_size
                free_space_positions[free_space_index][1] -= file_size
                if free_space_positions[free_space_index][1] == 0:
                    del free_space_positions[free_space_index]
                break

def calculate_checksum(disk_blocks):
    checksum = 0
    for position in range(len(disk_blocks)):
        if disk_blocks[position] == -1:
            continue
        checksum += disk_blocks[position] * position
    return checksum

def calculate_checksum_for_locations(file_locations):
    checksum = 0
    for file_id, (start_position, size) in enumerate(file_locations):
        end_position = start_position + size - 1
        sum_of_integers = size * (start_position + end_position) // 2
        checksum += file_id * sum_of_integers
    return checksum

def part_one():
    compress(disk_blocks)
    return calculate_checksum(disk_blocks)

def part_two():
    move_files()
    return calculate_checksum_for_locations(file_positions)

print("Answer for part 1:", part_one())
print("Answer for part 2:", part_two())
