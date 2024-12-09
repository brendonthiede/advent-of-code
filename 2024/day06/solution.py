#!/usr/bin/env python3

import os
from multiprocessing import Pool
from functools import lru_cache

def find_guard_position(map_data):
    for y, row in enumerate(map_data):
        try:
            x = row.index('^')
            return (x, y)
        except ValueError:
            continue
    return None

@lru_cache(maxsize=None)
def move_guard(map_data, start_pos, added_obstacle=None):
    directions = [(0, -1), (1, 0), (0, 1), (-1, 0)]  # Up, Right, Down, Left
    direction_index = 0
    visited = set()
    directed_path = []
    x, y = start_pos
    
    while True:
        current_state = (x, y, direction_index)
        if current_state in visited:
            return tuple(dict.fromkeys((x, y) for x, y, _ in directed_path)), True
        
        visited.add(current_state)
        directed_path.append(current_state)
        
        dx, dy = directions[direction_index]
        new_x, new_y = x + dx, y + dy
        
        # Check bounds
        if not (0 <= new_x < len(map_data[0]) and 0 <= new_y < len(map_data)):
            return tuple(dict.fromkeys((x, y) for x, y, _ in directed_path)), False
            
        # Check obstacles
        if (map_data[new_y][new_x] == '#' or 
            (added_obstacle and (new_x, new_y) == added_obstacle)):
            direction_index = (direction_index + 1) % 4
        else:
            x, y = new_x, new_y

def check_for_loop(args):
    map_data, start_pos, added_obstacle = args
    _, is_loop = move_guard(map_data, start_pos, added_obstacle)
    return is_loop

def main():
    with open(os.path.join(os.path.dirname(__file__), "input.txt"), "r") as file:
        inputs = file.read()

    map_data = tuple(tuple(line) for line in inputs.splitlines())  # Make immutable for caching
    guard_position = find_guard_position(map_data)

    # Part 1
    guard_path, _ = move_guard(map_data, guard_position)
    print("Answer for part 1:", len(guard_path))
    
    # Part 2
    # Prepare arguments for parallel processing (place an obstacle at each position in the guard's path after the starting position)
    args_list = [(map_data, guard_position, obstacle) for obstacle in guard_path[1:]]
    
    # Use multiprocessing to check for loops in parallel
    with Pool() as pool:
        results = pool.map(check_for_loop, args_list)
    
    loop_count = sum(results)
    print("Answer for part 2:", loop_count)

if __name__ == "__main__":
    main()