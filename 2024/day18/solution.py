#!/usr/bin/env python3

from collections import deque
import os

def parse_input(filepath):
    with open(filepath, 'r') as file:
        coordinates = []
        for line in file:
            x, y = map(int, line.strip().split(','))
            coordinates.append((x, y))
    return coordinates

def create_memory_grid(coordinates, size=71, num_bytes=1024):
    grid = [[False] * size for _ in range(size)]
    # Mark corrupted locations for first num_bytes
    for x, y in coordinates[:num_bytes]:
        if x < size and y < size:
            grid[y][x] = True
    return grid

def find_shortest_path(grid):
    size = len(grid)
    start = (0, 0)
    end = (size-1, size-1)
    
    # BFS for shortest path
    queue = deque([(start, 0)])  # (position, steps)
    visited = {start}
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]  # right, down, left, up
    
    while queue:
        (y, x), steps = queue.popleft()
        
        if (y, x) == end:
            return steps
            
        for dy, dx in directions:
            new_y, new_x = y + dy, x + dx
            new_pos = (new_y, new_x)
            
            if (0 <= new_y < size and 
                0 <= new_x < size and 
                not grid[new_y][new_x] and 
                new_pos not in visited):
                visited.add(new_pos)
                queue.append((new_pos, steps + 1))
    
    return None

def part_one(coordinates):
    grid = create_memory_grid(coordinates)
    return find_shortest_path(grid)

def part_two():
    # Part two not implemented yet
    pass

if __name__ == "__main__":
    input_file = os.path.join(os.path.dirname(__file__), "input.txt")
    coordinates = parse_input(input_file)
    part_one_answer = part_one(coordinates)
    print("Answer for part 1:", part_one_answer)
