#!/usr/bin/env python3

import os
from heapq import heappush, heappop

DIRECTIONS = {
    "N": (-1, 0),
    "S": (1, 0),
    "E": (0, 1),
    "W": (0, -1)
}

TURNS = {
    "N": {"L": "W", "R": "E"},
    "S": {"L": "E", "R": "W"},
    "E": {"L": "N", "R": "S"},
    "W": {"L": "S", "R": "N"}
}

def solve(grid):
    start = next((y, x) for y in range(len(grid)) for x in range(len(grid[0])) if grid[y][x] == 'S')
    end = next((y, x) for y in range(len(grid)) for x in range(len(grid[0])) if grid[y][x] == 'E')
    rows, cols = len(grid), len(grid[0])
    
    # First pass - find minimum cost and track actual paths
    queue = [(0, start[0], start[1], "E", [(start[0], start[1])])]  # Added path tracking
    costs = {}
    optimal_paths = []
    min_end_cost = float('inf')
    
    while queue:
        cost, y, x, direction, path = heappop(queue)
        state = (y, x, direction)
        
        if cost > min_end_cost:
            continue
            
        if (y, x) == end:
            if cost < min_end_cost:
                min_end_cost = cost
                optimal_paths = [path]
            elif cost == min_end_cost:
                optimal_paths.append(path)
            continue
        
        if state in costs and costs[state] < cost:
            continue
        costs[state] = cost
        
        # Try moving forward
        dy, dx = DIRECTIONS[direction]
        new_y, new_x = y + dy, x + dx
        if (0 <= new_y < rows and 0 <= new_x < cols and grid[new_y][new_x] != '#'):
            new_path = path + [(new_y, new_x)]
            heappush(queue, (cost + 1, new_y, new_x, direction, new_path))
        
        # Try turning left and right
        for turn in ["L", "R"]:
            new_direction = TURNS[direction][turn]
            heappush(queue, (cost + 1000, y, x, new_direction, path[:]))
    
    # Combine all optimal paths
    optimal_tiles = set()
    for path in optimal_paths:
        optimal_tiles.update(path)
        
    return min_end_cost, len(optimal_tiles)

if __name__ == '__main__':
    with open(os.path.join(os.path.dirname(__file__), "input.txt"), "r") as file:
        input_data = file.read().strip()

    grid = [list(line) for line in input_data.splitlines()]
    part1, part2 = solve(grid)
    print("Answer for part 1:", part1)
    print("Answer for part 2:", part2)
