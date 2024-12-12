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
        for border_dy, border_dx in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
            new_y, new_x = y + border_dy, x + border_dx
            if (new_y < 0 or new_y >= rows or 
                new_x < 0 or new_x >= cols or 
                (new_y, new_x) not in region):
                border.add((y, x, border_dy, border_dx))

    def collapse_neighbors(start, dy, dx):
        y, x, border_dy, border_dx = start
        neighbor = (y + dy, x + dx, border_dy, border_dx)
        if neighbor in border:
            border.remove(neighbor)
            collapse_neighbors(neighbor, dy, dx)

    while border:
        y, x, border_dy, border_dx = border.pop()
        # For a cell where the border is to the right or left, collapse any adjacent cells up or down with the same border
        if border_dy == 0:
            collapse_neighbors((y, x, border_dy, border_dx), 1, 0)
            collapse_neighbors((y, x, border_dy, border_dx), -1, 0)
        else:
            collapse_neighbors((y, x, border_dy, border_dx), 0, 1)
            collapse_neighbors((y, x, border_dy, border_dx), 0, -1)
        sides.add((y, x, border_dy, border_dx))
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
