#!/usr/bin/env python3

import os
from collections import defaultdict
from typing import List, Dict, Tuple
from functools import lru_cache
from multiprocessing import Pool

@lru_cache(maxsize=None)
def mix_and_prune(secret: int, value: int) -> int:
    # XOR the value with the secret
    return (secret ^ value) % 16777216

def generate_sequence(initial: int, length: int = 2001) -> List[int]:
    if not 0 <= initial < 16777216:
        return [initial]  # Invalid initial value, return minimal sequence
        
    sequence = [initial]
    secret = initial
    seen = {initial: 0}  # Track seen values and their positions
    
    for i in range(length - 1):
        # multiply by 64 and mix/prune
        secret = mix_and_prune(secret, secret * 64)
        # divide by 32 and mix/prune
        secret = mix_and_prune(secret, secret // 32)
        # multiply by 2048 and mix/prune
        secret = mix_and_prune(secret, secret * 2048)
        
        # If we've seen this value before, we're in a cycle
        if secret in seen:
            cycle_length = i + 1 - seen[secret]
            # Fill the rest of the sequence with cycled values
            while len(sequence) < length:
                cycle_pos = (len(sequence) - seen[secret]) % cycle_length + seen[secret]
                sequence.append(sequence[cycle_pos])
            return sequence
            
        seen[secret] = i + 1
        sequence.append(secret)
    
    return sequence

def find_patterns(prices: List[int]) -> Dict[Tuple[int, int, int, int], int]:
    changes = [prices[i+1] - prices[i] for i in range(len(prices)-1)]
    patterns = {}
    
    for i in range(len(changes)-3):
        pattern = (changes[i], changes[i+1], changes[i+2], changes[i+3])
        # Only store the first occurrence of each pattern
        if pattern not in patterns:
            patterns[pattern] = prices[i+4]
    
    return patterns

def process_secret(initial: int) -> Tuple[int, Dict[Tuple[int, int, int, int], int]]:
    sequence = generate_sequence(initial)
    prices = [x % 10 for x in sequence]
    patterns = find_patterns(prices)
    return sequence[-1], patterns

def solve(secrets: List[int]) -> Tuple[int, int]:
    pattern_scores = defaultdict(int)
    
    # Use multiprocessing to parallelize the sequence generation
    with Pool() as pool:
        results = pool.map(process_secret, secrets)
    
    # Combine results
    part1 = sum(last_num for last_num, _ in results)
    
    # For part 2, only count patterns when they first appear
    for _, patterns in results:
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
