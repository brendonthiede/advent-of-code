#!/usr/bin/env python3

import os

def get_region(grid, start, visited):
    rows, cols = len(grid), len(grid[0])
    region = set()
    queue = [start]
    plant_type = grid[start[0]][start[1]]
    
    while queue:
        y, x = queue.pop(0)
        if (y, x) in visited:
            continue
            
        visited.add((y, x))
        region.add((y, x))
        
        # Check all 4 directions for the same plant type, add it to the queue and repeat
        for dy, dx in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
            new_y, new_x = y + dy, x + dx
            if (0 <= new_y < rows and 0 <= new_x < cols and 
                grid[new_y][new_x] == plant_type and 
                (new_y, new_x) not in visited):
                queue.append((new_y, new_x))
    return region

def get_sides(grid, region):
    perimeter = 0
    border = set()
    sides = set()
    rows, cols = len(grid), len(grid[0])

    for y, x in region:
        # For each side of this cell, is it on the edge of the grid or the region?
        # add up perimeter and track the border cells directionally
        for dy, dx in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
            new_y, new_x = y + dy, x + dx
            if (new_y < 0 or new_y >= rows or 
                new_x < 0 or new_x >= cols or 
                (new_y, new_x) not in region):
                perimeter += 1
                border.add((y, x, dy, dx))

    def collapse_neighbors(start, dy, dx):
        y, x, border_dy, border_dx = start
        neighbor = (y + dy, x + dx, border_dy, border_dx)
        if neighbor in border:
            border.remove(neighbor)
            collapse_neighbors(neighbor, dy, dx)

    while border:
        start = border.pop()
        _, _, border_dy, _ = start
        if border_dy == 0:
            # East or West side
            collapse_neighbors(start, 1, 0)
            collapse_neighbors(start, -1, 0)
        else:
            # North or South side
            collapse_neighbors(start, 0, 1)
            collapse_neighbors(start, 0, -1)
        sides.add(start)
    return perimeter, len(sides)

def solve(grid):
    part_one_total = 0
    part_two_total = 0
    visited = set()
    rows, cols = len(grid), len(grid[0])
    
    for row in range(rows):
        for col in range(cols):
            if (row, col) not in visited:
                region = get_region(grid, (row, col), visited)
                area = len(region)
                perimeter, sides = get_sides(grid, region)
                part_one_total += area * perimeter
                part_two_total += area * sides
                
    return part_one_total, part_two_total

with open(os.path.join(os.path.dirname(__file__), "input.txt"), "r") as file:
    grid = [line.strip() for line in file]

part_one, part_two = solve(grid)
print("Answer for part 1:", part_one)
print("Answer for part 2:", part_two)
