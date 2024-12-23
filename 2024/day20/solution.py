#!/usr/bin/env python3

from collections import deque
import os
from typing import List, Tuple, Dict, Set
from functools import lru_cache
import multiprocessing as mp

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

@lru_cache(None)
def find_shortest_path(grid: Tuple[str], start: Tuple[int, int]) -> Dict[Tuple[int, int], int]:
    distances = {start: 0}
    queue = deque([(start, 0)])
    width, height = len(grid[0]), len(grid)
    
    while queue:
        pos, dist = queue.popleft()
        x, y = pos
        next_dist = dist + 1
        
        # Unrolled neighbor checks with early exit
        if x > 0 and grid[y][x-1] != '#':
            new_pos = (x-1, y)
            if new_pos not in distances:
                distances[new_pos] = next_dist
                queue.append((new_pos, next_dist))
        if x < width-1 and grid[y][x+1] != '#':
            new_pos = (x+1, y)
            if new_pos not in distances:
                distances[new_pos] = next_dist
                queue.append((new_pos, next_dist))
        if y > 0 and grid[y-1][x] != '#':
            new_pos = (x, y-1)
            if new_pos not in distances:
                distances[new_pos] = next_dist
                queue.append((new_pos, next_dist))
        if y < height-1 and grid[y+1][x] != '#':
            new_pos = (x, y+1)
            if new_pos not in distances:
                distances[new_pos] = next_dist
                queue.append((new_pos, next_dist))
    return distances

def offsets_at_dist(n: int) -> List[Tuple[int, int, int]]:
    return [
        (r, c, md)
        for r in range(-n, n + 1)
        for c in range(-n, n + 1)
        if (md := abs(r) + abs(c)) <= n and (r, c) != (0, 0)
    ]

def process_chunk(args: Tuple[List[Tuple[Tuple[int, int], int]], List[Tuple[int, int, int]], 
                 Dict[Tuple[int, int], int], Set[Tuple[int, int]], int]) -> Set[Tuple[Tuple[int, int], Tuple[int, int]]]:
    cheat_positions, offsets, backward_dist, valid_positions, base_time = args
    valid_cheats = set()
    
    for cheat_start, start_time in cheat_positions:
        if start_time >= base_time - 100:
            continue
        
        x1, y1 = cheat_start
        for dr, dc, md in offsets:
            x2, y2 = x1 + dr, y1 + dc
            cheat_end = (x2, y2)
            
            if cheat_end not in valid_positions or cheat_end not in backward_dist:
                continue
            
            total_time = start_time + md + backward_dist[cheat_end]
            if base_time - total_time >= 100:
                valid_cheats.add((cheat_start, cheat_end))
    
    return valid_cheats

def find_cheating_shortcuts(grid: List[str], start: Tuple[int, int], end: Tuple[int, int], max_cheat_length: int) -> int:
    height, width = len(grid), len(grid[0])
    forward_dist = find_shortest_path(tuple(grid), start)
    base_time = forward_dist[end]
    backward_dist = find_shortest_path(tuple(grid), end)
    
    offsets = offsets_at_dist(max_cheat_length)
    valid_positions = {(x, y) for y in range(height) for x in range(width) if grid[y][x] != '#'}
    
    # Convert forward_dist items to list for chunking
    cheat_positions = list(forward_dist.items())
    
    # Split work into chunks based on CPU count
    cpu_count = mp.cpu_count()
    chunk_size = max(1, len(cheat_positions) // cpu_count)
    chunks = [cheat_positions[i:i + chunk_size] for i in range(0, len(cheat_positions), chunk_size)]
    
    # Prepare arguments for each process
    process_args = [(chunk, offsets, backward_dist, valid_positions, base_time) for chunk in chunks]
    
    # Process chunks in parallel
    with mp.Pool() as pool:
        results = pool.map(process_chunk, process_args)
    
    # Combine results from all processes
    all_cheats = set().union(*results)
    
    return len(all_cheats)

def main():
    input_file = os.path.join(os.path.dirname(__file__), "input.txt")
    grid, start, end = parse_input(input_file)
    print("Answer for part 1:", find_cheating_shortcuts(grid, start, end, 2))
    print("Answer for part 2:", find_cheating_shortcuts(grid, start, end, 20))

if __name__ == "__main__":
    main()
