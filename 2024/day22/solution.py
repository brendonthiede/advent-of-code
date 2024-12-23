#!/usr/bin/env python3

import os
from collections import defaultdict
from typing import List, Dict, Tuple

def mix_and_prune(secret: int, value: int) -> int:
    # XOR the value with the secret
    return (secret ^ value) % 16777216

def generate_sequence(initial: int, length: int = 2001) -> List[int]:
    sequence = [initial]
    secret = initial
    
    for _ in range(length - 1):
        # multiply by 64 and mix/prune
        secret = mix_and_prune(secret, secret * 64)
        # divide by 32 and mix/prune
        secret = mix_and_prune(secret, secret // 32)
        # multiply by 2048 and mix/prune
        secret = mix_and_prune(secret, secret * 2048)
        sequence.append(secret)
    
    return sequence

def find_patterns(prices: List[int]) -> Dict[Tuple[int, int, int, int], int]:
    # Get price changes
    changes = [prices[i+1] - prices[i] for i in range(len(prices)-1)]
    
    # Find all patterns and their resulting prices
    patterns = {}
    for i in range(len(changes)-3):
        pattern = (changes[i], changes[i+1], changes[i+2], changes[i+3])
        if pattern not in patterns:
            patterns[pattern] = prices[i+4]
    
    return patterns

def solve(secrets: List[int]) -> Tuple[int, int]:
    part1 = 0
    pattern_scores = defaultdict(int)
    
    for initial in secrets:
        # Generate sequence and solve part 1
        sequence = generate_sequence(initial)
        part1 += sequence[-1]
        
        # Get ones digits for part 2
        prices = [x % 10 for x in sequence]
        
        # Find patterns and accumulate scores
        patterns = find_patterns(prices)
        for pattern, price in patterns.items():
            pattern_scores[pattern] += price
    
    return part1, max(pattern_scores.values())

def main():
    input_file = os.path.join(os.path.dirname(__file__), "input.txt")
    secrets = [int(line.strip()) for line in open(input_file)]
    
    part1, part2 = solve(secrets)
    print("Answer for part 1:", part1)
    print("Answer for part 2:", part2)

if __name__ == "__main__":
    main()
