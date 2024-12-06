#!/usr/bin/env python3

import os

with open(os.path.join(os.path.dirname(__file__), "input.txt"), "r") as file:
    inputs = file.read()

def find_guard_position(map_data):
    for y, row in enumerate(map_data):
        for x, char in enumerate(row):
            if char == '^':
                return (x, y)
    return None

map_data = [list(line) for line in inputs.splitlines()]
guard_position = find_guard_position(map_data)

def is_out_of_bounds(new_x, new_y, map_data):
    return not (0 <= new_x < len(map_data[0]) and 0 <= new_y < len(map_data))

def move_guard(map_data, start_pos, added_obstacle=[]):
    directions = [(0, -1), (1, 0), (0, 1), (-1, 0)]  # Up, Right, Down, Left
    direction_index = 0
    directed_path = []
    x, y = start_pos
    is_loop = False

    while True:
        if (x, y, direction_index) in directed_path:
            is_loop = True
            break
        else:
            directed_path.append((x, y, direction_index))

        dx, dy = directions[direction_index]
        new_x, new_y = x + dx, y + dy

        # The guard's path is done if they walk off the map
        if not (0 <= new_x < len(map_data[0]) and 0 <= new_y < len(map_data)):
            break

        # If the guard walks into an obstacle, turn right, otherwise keep going straight
        if map_data[new_y][new_x] == '#' or (new_x, new_y) == tuple(added_obstacle):
            direction_index = (direction_index + 1) % 4
        else:
            x, y = new_x, new_y

    path = list(dict.fromkeys([(x, y) for x, y, _ in directed_path]))
    return path, is_loop

guard_path, _ = move_guard(map_data, guard_position)

def print_guard_path(map_data, path, added_obstacle=[]):
    path_set = set(path)
    for y, row in enumerate(map_data):
        for x, char in enumerate(row):
            if (x, y) in path_set:
                print('X', end='')
            elif (x, y) == tuple(added_obstacle):
                print('O', end='')
            else:
                print(char, end='')
        print()

print_guard_path(map_data, guard_path)

print("Answer for part 1:", len(guard_path))

def check_for_loop(map_data, start_pos, added_obstacle):
    _, is_loop = move_guard(map_data, start_pos, added_obstacle)
    return is_loop

loop_count = 0
for added_obstacle in guard_path[1:]:
    loop_exists = check_for_loop(map_data, guard_position, added_obstacle)
    if loop_exists:
        loop_count += 1

print("Answer for part 2:", loop_count)
