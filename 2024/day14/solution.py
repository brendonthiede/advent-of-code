#!/usr/bin/env python3

import os
from dataclasses import dataclass

@dataclass
class Robot:
    x: int
    y: int
    dx: int
    dy: int
    
    def move(self, width, height):
        self.x = (self.x + self.dx) % width
        self.y = (self.y + self.dy) % height

def parse_input(line):
    pos, vel = line.split()
    px, py = map(int, pos[2:].split(','))
    vx, vy = map(int, vel[2:].split(','))
    return Robot(px, py, vx, vy)

def count_robots_in_quadrants(robots, width, height):
    counts = [0, 0, 0, 0, 0]
    mid_x = width // 2
    mid_y = height // 2
    
    for robot in robots:
        if robot.x == mid_x or robot.y == mid_y:
            continue
        quad = (
            2 if robot.x > mid_x and robot.y < mid_y else
            1 if robot.x < mid_x and robot.y < mid_y else
            3 if robot.x < mid_x and robot.y > mid_y else
            4
        )
        counts[quad] += 1
    
    return counts

def print_grid(robots, width, height):
    grid = [['.' for _ in range(width)] for _ in range(height)]
    for robot in robots:
        grid[robot.y][robot.x] = '#'
    for row in grid:
        print(''.join(row))

def part_one(robots, width, height, seconds):
    robots = [Robot(r.x, r.y, r.dx, r.dy) for r in robots]

    for _ in range(seconds):
        for robot in robots:
            robot.move(width, height)

    quadrant_counts = count_robots_in_quadrants(robots, width, height)
    safety_factor = 1
    for i in range(1, 5):
        safety_factor *= quadrant_counts[i]
    
    return safety_factor

def part_two(robots, width, height):
    robots = [Robot(r.x, r.y, r.dx, r.dy) for r in robots]
    tick = 0
    
    while True:
        tick += 1
        for robot in robots:
            robot.move(width, height)
            
        # Group robots by row
        rows = {}
        for robot in robots:
            if robot.y not in rows:
                rows[robot.y] = []
            rows[robot.y].append(robot.x)
            
        # Check each row that has enough robots
        search_string = "########"
        for y in rows:
            if len(rows[y]) >= len(search_string):
                # Check for consecutive positions
                row = ["."] * width
                for x in rows[y]:
                    row[x] = "#"
                if search_string in "".join(row):
                    print_grid(robots, width, height)
                    return tick

with open(os.path.join(os.path.dirname(__file__), "input.txt"), "r") as file:
    robots = [parse_input(line.strip()) for line in file]

part_one_answer = part_one(robots, 101, 103, 100)
part_two_answer = part_two(robots, 101, 103)
print("Answer for part 1:", part_one_answer)
print("Answer for part 2:", part_two_answer)
