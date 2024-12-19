#!/usr/bin/env python3

import os

def parse_input(filename):
    with open(filename) as f:
        patterns, designs = f.read().strip().split('\n\n')
    patterns = [p.strip() for p in patterns.split(',')]
    designs = [d.strip() for d in designs.split('\n')]
    return patterns, designs

def can_make_design(design, patterns):
    n = len(design)
    # dp[i] represents if we can make the substring design[0:i]
    dp = [False] * (n + 1)
    dp[0] = True  # Empty string is always possible
    
    # For each position in the design
    for i in range(n):
        if not dp[i]:
            continue
        # Try each pattern at current position
        for pattern in patterns:
            if design[i:].startswith(pattern):
                dp[i + len(pattern)] = True
    
    return dp[n]

def count_ways_to_make_design(design, patterns):
    n = len(design)
    # dp[i] represents the number of ways to make substring design[0:i]
    dp = [0] * (n + 1)
    dp[0] = 1  # Empty string can be made in one way
    
    # For each position in the design
    for i in range(n):
        if dp[i] == 0:
            continue
        # Try each pattern at current position
        for pattern in patterns:
            if design[i:].startswith(pattern):
                dp[i + len(pattern)] += dp[i]
    
    return dp[n]

def solve_part1(patterns, designs):
    possible_count = 0
    for design in designs:
        if can_make_design(design, patterns):
            possible_count += 1
    return possible_count

def solve_part2(patterns, designs):
    total_ways = 0
    for design in designs:
        ways = count_ways_to_make_design(design, patterns)
        total_ways += ways
    return total_ways

def main():
    input_file = os.path.join(os.path.dirname(__file__), "input.txt")
    patterns, designs = parse_input(input_file)
    print("Part 1:", solve_part1(patterns, designs))
    print("Part 2:", solve_part2(patterns, designs))

if __name__ == "__main__":
    main()
