#!/usr/bin/env python3

import os

def parse_input(filename):
    with open(filename) as f:
        patterns, designs = f.read().strip().split('\n\n')
    patterns = [p.strip() for p in patterns.split(',')]
    designs = [d.strip() for d in designs.split('\n')]
    return patterns, designs

def can_make_design(design, patterns, pattern_lengths):
    n = len(design)
    
    dp = [False] * (n + 1)
    dp[0] = True  # Empty string is always possible
    
    for i in range(n):
        if not dp[i]:
            continue
        # Only check patterns of lengths that could possibly fit
        for length in pattern_lengths:
            if i + length <= n:
                substr = design[i:i + length]
                if substr in patterns:
                    dp[i + length] = True
    return dp[n]

def count_ways_to_make_design(design, pattern_dict):
    n = len(design)
    
    dp = [0] * (n + 1)
    dp[0] = 1  # Empty string can be made in one way
    
    for i in range(n):
        if dp[i] == 0:
            continue
        # Only check patterns of the right length
        for length, patterns_of_length in pattern_dict.items():
            if i + length <= n:
                substr = design[i:i + length]
                if substr in patterns_of_length:
                    dp[i + length] += dp[i]
    return dp[n]

def part_one(patterns, designs):
    # Precompute pattern lengths
    pattern_lengths = {len(p) for p in patterns}
    patterns = set(patterns)
    
    possible_count = 0
    for design in designs:
        if can_make_design(design, patterns, pattern_lengths):
            possible_count += 1
    return possible_count

def part_two(patterns, designs):
    # Group patterns by length for faster lookup
    pattern_dict = {}
    for p in patterns:
        pattern_dict.setdefault(len(p), set()).add(p)
    
    total_ways = 0
    for design in designs:
        ways = count_ways_to_make_design(design, pattern_dict)
        total_ways += ways
    return total_ways

def main():
    input_file = os.path.join(os.path.dirname(__file__), "input.txt")
    patterns, designs = parse_input(input_file)
    print("Answer for part 1:", part_one(patterns, designs))
    print("Answer for part 2:", part_two(patterns, designs))

if __name__ == "__main__":
    main()
