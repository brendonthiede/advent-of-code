#!/usr/bin/env python3

from pathlib import Path
from numpy import prod


class UnionFind:
    def __init__(self, n):
        # init as own parent with size 1
        self.parent = list(range(n))
        self.size = [1] * n
        self.num_components = n

    def seed_circuit(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.seed_circuit(self.parent[x])
        return self.parent[x]

    def union(self, a, b):
        seed_a, seed_b = self.seed_circuit(a), self.seed_circuit(b)
        # same circuit?
        if seed_a == seed_b:
            return False

        # if one is bigger, make it the primary
        if self.size[seed_a] < self.size[seed_b]:
            primary, secondary = seed_b, seed_a
        else:
            primary, secondary = seed_a, seed_b

        # merge secondary into primary
        self.parent[secondary] = primary
        self.size[primary] += self.size[secondary]
        self.num_components -= 1
        return True

    def get_largest(self):
        # grab the sizes of the seed junctions
        sizes = [self.size[i] for i in range(len(self.parent)) if self.parent[i] == i]
        return sorted(sizes)[-3:]


def solution(file_name: str, part: int, num_pairs: int = 0) -> int:
    inputs = Path(__file__).with_name(file_name).read_text()

    junctions = []
    for line in inputs.splitlines():
        x, y, z = map(int, line.split(","))
        junctions.append((x, y, z))

    pairs = []
    for i in range(len(junctions)):
        for j in range(i + 1, len(junctions)):
            dx = junctions[i][0] - junctions[j][0]
            dy = junctions[i][1] - junctions[j][1]
            dz = junctions[i][2] - junctions[j][2]
            # no reason to take sqrt, just compare squared distances
            dist = dx * dx + dy * dy + dz * dz
            pairs.append((dist, i, j))

    pairs.sort()

    uf = UnionFind(len(junctions))

    if part == 1:
        connections = 0
        for dist, i, j in pairs:
            uf.union(i, j)
            connections += 1
            if connections == num_pairs:
                break

        largest = uf.get_largest()
        return prod(largest)

    else:
        for dist, i, j in pairs:
            if uf.union(i, j):
                if uf.num_components == 1:
                    return junctions[i][0] * junctions[j][0]


sample_part1_expected = 40
sample_part1_actual = solution("sample.txt", 1, 10)
assert (
    sample_part1_actual == sample_part1_expected
), f"Part 1: expected {sample_part1_expected}, got {sample_part1_actual}"

print("Answer for part 1:", solution("input.txt", 1, 1000))

sample_part2_expected = 25272
sample_part2_actual = solution("sample.txt", 2)
assert (
    sample_part2_actual == sample_part2_expected
), f"Part 2: expected {sample_part2_expected}, got {sample_part2_actual}"

print("Answer for part 2:", solution("input.txt", 2))
