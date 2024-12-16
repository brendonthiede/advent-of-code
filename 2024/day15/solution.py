#!/usr/bin/env python3

import os

DIRECTIONS = {
    "<": (0, -1),
    ">": (0, 1),
    "^": (-1, 0),
    "v": (1, 0),
}

def can_move(grid: list[list[str]], y: int, x: int, dy: int, dx: int, visited: set) -> bool:
    if (y, x) in visited:
        return True
    visited.add((y, x))

    new_y, new_x = y + dy, x + dx
    cell = grid[new_y][new_x]

    if cell == "#":
        return False
    if cell == "[":
        return can_move(grid, new_y, new_x, dy, dx, visited) and can_move(grid, new_y, new_x + 1, dy, dx, visited)
    if cell == "]":
        return can_move(grid, new_y, new_x, dy, dx, visited) and can_move(grid, new_y, new_x - 1, dy, dx, visited)
    if cell == "O":
        return can_move(grid, new_y, new_x, dy, dx, visited)

    return True

def follow_instructions(grid: list[list[str]], y: int, x: int, instruction: str) -> tuple[int, int]:
    dy, dx = DIRECTIONS[instruction]
    new_y, new_x = y + dy, x + dx

    if not (0 <= new_y < len(grid) and 0 <= new_x < len(grid[0]) and grid[new_y][new_x] != "#"):
        return y, x

    if grid[new_y][new_x] in ["[", "]", "O"]:
        visited = set()

        if not can_move(grid, y, x, dy, dx, visited):
            return y, x

        while len(visited) > 0:
            for visited_y, visited_x in visited.copy():
                visited_neighbor_y, visited_neighbor_x = visited_y + dy, visited_x + dx
                if (visited_neighbor_y, visited_neighbor_x) not in visited:
                    if grid[visited_neighbor_y][visited_neighbor_x] != "@" and grid[visited_y][visited_x] != "@":
                        grid[visited_neighbor_y][visited_neighbor_x] = grid[visited_y][visited_x]
                        grid[visited_y][visited_x] = "."

                    visited.remove((visited_y, visited_x))

        grid[y][x], grid[new_y][new_x] = grid[new_y][new_x], grid[y][x]
        return new_y, new_x
    else:
        grid[y][x], grid[new_y][new_x] = grid[new_y][new_x], grid[y][x]
        return new_y, new_x

def gps(grid: list[list[str]]) -> int:
    def find_box(grid: list[list[str]]) -> list[tuple[int, int]]:
        return [(y, x) for y, row in enumerate(grid) for x, cell in enumerate(row) if cell in {"O", "["}]
    return sum(100 * box[0] + box[1] for box in find_box(grid))

def solve(grid, instructions) -> int:
    for y, row in enumerate(grid):
        for x, cell in enumerate(row):
            if cell == "@":
                break
        else:
            continue
        break
    for instruction in instructions:
        y, x = follow_instructions(grid, y, x, instruction)
    return gps(grid)

with open(os.path.join(os.path.dirname(__file__), "input.txt"), "r") as file:
    grid, instructions = file.read().split("\n\n")

grid = [list(line) for line in grid.splitlines()]
instructions = instructions.replace("\n", "")
expanded_grid = []
for y, row in enumerate(grid):
    expanded_grid.append([])
    for char in row:
        expanded_grid[y].extend(["#", "#"] if char == "#" else ["[", "]"] if char == "O" else [char, "."])

print("Answer for part 1:", solve(grid, instructions))
print("Answer for part 2:", solve(expanded_grid, instructions))
