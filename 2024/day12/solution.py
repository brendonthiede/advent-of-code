#!/usr/bin/env python3

import os
from collections import deque

def get_region(grid, start, visited):
    rows, cols = len(grid), len(grid[0])
    region = set()
    queue = deque([start])
    plant_type = grid[start[0]][start[1]]
    
    while queue:
        y, x = queue.popleft()
        if (y, x) in visited:
            continue
            
        visited.add((y, x))
        region.add((y, x))
        
        # Check all 4 directions for the same plant type, add it to the end of the queue and repeat
        for dy, dx in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
            new_y, new_x = y + dy, x + dx
            if (0 <= new_y < rows and 0 <= new_x < cols and 
                grid[new_y][new_x] == plant_type and 
                (new_y, new_x) not in visited):
                queue.append((new_y, new_x))
    return region

def get_perimeter(grid, region):
    perimeter = 0
    rows, cols = len(grid), len(grid[0])
    
    for y, x in region:
        # For each side of this cell, is it on the edge of the grid or the region?
        for dy, dx in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
            new_y, new_x = y + dy, x + dx
            if (new_y < 0 or new_y >= rows or 
                new_x < 0 or new_x >= cols or 
                (new_y, new_x) not in region):
                perimeter += 1
                
    return perimeter

def get_sides(grid, region):
    border = set()
    sides = set()
    rows, cols = len(grid), len(grid[0])

    for y, x in region:
        # For each side of this cell, is it on the edge of the grid or the region?
        # This time, track the border cells directionally
        for dy, dx in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
            new_y, new_x = y + dy, x + dx
            if (new_y < 0 or new_y >= rows or 
                new_x < 0 or new_x >= cols or 
                (new_y, new_x) not in region):
                border.add((y, x, dy, dx))

    # Now, collapse neighboring border cells into a single side
    while border:
        y, x, dy, dx = border.pop()
        # For a cell where the border is to the right or left, collapse any adjacent cells up or down with the same border
        if dy == 0:
            new_y = y
            while(True):
                if (new_y + 1, x, dy, dx) in border:
                    border.remove((new_y + 1, x, dy, dx))
                    new_y += 1
                else:
                    break
            new_y = y
            while(True):
                if (new_y - 1, x, dy, dx) in border:
                    border.remove((new_y - 1, x, dy, dx))
                    new_y -= 1
                else:
                    break
        else:
            new_x = x
            while(True):
                if (y, new_x + 1, dy, dx) in border:
                    border.remove((y, new_x + 1, dy, dx))
                    new_x += 1
                else:
                    break
            new_x = x
            while(True):
                if (y, new_x - 1, dy, dx) in border:
                    border.remove((y, new_x - 1, dy, dx))
                    new_x -= 1
                else:
                    break
        sides.add((y, x, dy, dx))
    return len(sides)

def solve(grid, part):
    total_price = 0
    visited = set()
    rows, cols = len(grid), len(grid[0])
    
    for row in range(rows):
        for col in range(cols):
            if (row, col) not in visited:
                region = get_region(grid, (row, col), visited)
                area = len(region)
                if part == 1:
                    multiplier = get_perimeter(grid, region)
                else:
                    multiplier = get_sides(grid, region)
                price = area * multiplier
                total_price += price
                
    return total_price

with open(os.path.join(os.path.dirname(__file__), "input.txt"), "r") as file:
    grid = [line.strip() for line in file]

print("Answer for part 1:", solve(grid, 1))
print("Answer for part 2:", solve(grid, 2))
