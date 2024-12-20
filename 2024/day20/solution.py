#!/usr/bin/env python3

from collections import deque
import os
from typing import List, Tuple, Dict

DIRECTIONS = [(0, 1), (1, 0), (0, -1), (-1, 0)]

def parse_input(filename: str) -> Tuple[List[str], Tuple[int, int], Tuple[int, int]]:
    with open(filename) as f:
        grid = [line.strip() for line in f.readlines()]
    
    start = end = None
    for y, row in enumerate(grid):
        for x, cell in enumerate(row):
            if cell == 'S':
                start = (x, y)
            elif cell == 'E':
                end = (x, y)
    
    return grid, start, end

def is_valid(pos: Tuple[int, int], grid: List[str]) -> bool:
    x, y = pos
    if y < 0 or y >= len(grid) or x < 0 or x >= len(grid[0]):
        return False
    return grid[y][x] not in '#'

def get_neighbors(pos: Tuple[int, int]) -> List[Tuple[int, int]]:
    x, y = pos
    return [(x + dx, y + dy) for dx, dy in DIRECTIONS]

def find_shortest_path(grid: List[str], start: Tuple[int, int], end: Tuple[int, int]) -> Dict[Tuple[int, int], int]:
    distances = {start: 0}
    queue = deque([start])
    
    while queue:
        current = queue.popleft()
        for next_pos in get_neighbors(current):
            if not is_valid(next_pos, grid) or next_pos in distances:
                continue
            distances[next_pos] = distances[current] + 1
            queue.append(next_pos)
    
    return distances

def find_cheating_shortcuts(grid: List[str], start: Tuple[int, int], end: Tuple[int, int], normal_dist: Dict[Tuple[int, int], int], max_cheat_length: int) -> int:
    base_time = normal_dist[end]
    reverse_dist = find_shortest_path(grid, end, start)
    cheats_found = 0
    height, width = len(grid), len(grid[0])
    
    for y1 in range(height):
        for x1 in range(width):
            cheat_start = (x1, y1)
            if cheat_start not in normal_dist:
                continue
            
            queue = deque([(cheat_start, 0)])
            visited = {cheat_start}
            
            while queue:
                pos, steps = queue.popleft()
                if steps == max_cheat_length:
                    continue
                    
                for next_pos in get_neighbors(pos):
                    if not (0 <= next_pos[1] < height and 0 <= next_pos[0] < width):
                        continue
                    if next_pos in visited:
                        continue
                    visited.add(next_pos)
                    queue.append((next_pos, steps + 1))
                    
                    if next_pos in reverse_dist:
                        time_with_cheat = normal_dist[cheat_start] + steps + 1 + reverse_dist[next_pos]
                        if base_time - time_with_cheat >= 100:
                            cheats_found += 1
    
    return cheats_found

def main():
    input_file = os.path.join(os.path.dirname(__file__), "input.txt")
    grid, start, end = parse_input(input_file)
    normal_distances = find_shortest_path(grid, start, end)
    print("Answer for part 1:", find_cheating_shortcuts(grid, start, end, normal_distances, 2))
    print("Answer for part 2:", find_cheating_shortcuts(grid, start, end, normal_distances, 20))

if __name__ == "__main__":
    main()
