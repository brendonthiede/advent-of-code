#!/usr/bin/env python3

import os

def find_paths(topo_map, start):
    rows, cols = len(topo_map), len(topo_map[0])
    summits = []
    path_count = 0
    
    def is_valid(x, y):
        return 0 <= x < cols and 0 <= y < rows
    
    def dfs(x, y, current_elevation):
        if not is_valid(x, y) or topo_map[y][x] != current_elevation + 1:
            return

        new_elevation = topo_map[y][x]
        if new_elevation == 9:
            summits.append((x, y))
            nonlocal path_count
            path_count += 1
            
        for dx, dy in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
            new_x, new_y = x + dx, y + dy
            dfs(new_x, new_y, new_elevation)
    
    start_x, start_y = start
    for dx, dy in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
        new_x, new_y = start_x + dx, start_y + dy
        if is_valid(new_x, new_y) and topo_map[new_y][new_x] == 1:
            dfs(new_x, new_y, 0)
    return summits

def solve(topo_map, part):
    trailheads = [(x, y) for y in range(len(topo_map)) for x in range(len(topo_map[0])) if topo_map[y][x] == 0]
    
    total_score = 0
    for trailhead in trailheads:
        summits = find_paths(topo_map, trailhead)
        if part == 1:
            total_score += len(set(summits))
        else:
            total_score += len(summits)

    return total_score

with open(os.path.join(os.path.dirname(__file__), "input.txt"), "r") as file:
    topo_map = [[int(c) for c in line] for line in file.read().splitlines()]

print("Answer for part 1:", solve(topo_map, 1))
print("Answer for part 2:", solve(topo_map, 2))
