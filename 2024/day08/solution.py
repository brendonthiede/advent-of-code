#!/usr/bin/env python3

import os

with open(os.path.join(os.path.dirname(__file__), "input.txt"), "r") as file:
    inputs = file.read()

lines = inputs.splitlines()
coordinates = {}
limitX = len(lines[0])
limitY = len(lines)
for y, line in enumerate(lines):
    for x, char in enumerate(line):
        if char != ".":
            if char not in coordinates:
                coordinates[char] = []
            coordinates[char].append((x, y))

def add_antinode(antinode, antinodes):
    if 0 <= antinode[0] < limitX and 0 <= antinode[1] < limitY and antinode not in antinodes:
        antinodes.append(antinode)

def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

def solve(part):
    antinodes = []

    for _, points in coordinates.items():
        for i in range(len(points)):
            for j in range(i + 1, len(points)):
                x1, y1 = points[i]
                x2, y2 = points[j]
                dx = x2 - x1
                dy = y2 - y1
                match part:
                    case 1:
                        add_antinode((x1 - dx, y1 - dy), antinodes)
                        add_antinode((x2 + dx, y2 + dy), antinodes)
                    case 2:
                        factor = gcd(dx, dy)
                        dx //= factor
                        dy //= factor
                        for k in range(0, max(limitX, limitY)):
                            add_antinode((x1 + k * dx, y1 + k * dy), antinodes)
                            add_antinode((x1 - k * dx, y1 - k * dy), antinodes)
    return len(antinodes)

print("Answer for part 1:", solve(1))
print("Answer for part 2:", solve(2))
