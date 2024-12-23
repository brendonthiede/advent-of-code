#!/usr/bin/env python3

import os
from collections import defaultdict

def parse_input(filename):
    connections = defaultdict(set)
    with open(filename) as f:
        for line in f:
            a, b = line.strip().split('-')
            connections[a].add(b)
            connections[b].add(a)
    return connections

def find_triangles(connections):
    triangles = []
    computers = sorted(connections.keys())  # Sort for consistent ordering
    
    # For each computer, look at its neighbors and find triangles
    for _, a in enumerate(computers):
        # Get neighbors of a
        neighbors_a = connections[a]
        
        # Only process pairs of neighbors
        neighbor_list = sorted(n for n in neighbors_a if n > a)  # Use ordering to avoid duplicates
        
        # If this computer and its neighbors don't start with 't', skip
        if not (a.startswith('t') or any(n.startswith('t') for n in neighbor_list)):
            continue
        
        for b in neighbor_list:
            neighbors_b = connections[b]
            common_neighbors = neighbors_a & neighbors_b
            
            # For each common neighbor that maintains ordering
            for c in (n for n in common_neighbors if n > b):
                # At this point we know a-b-c forms a triangle
                if a.startswith('t') or b.startswith('t') or c.startswith('t'):
                    triangles.append((a, b, c))
    
    return triangles

def part1(connections):
    triangles = find_triangles(connections)
    return len(triangles)

def find_max_clique(connections):
    # Convert graph to sets for O(1) lookups
    graph = {node: set(neighbors) for node, neighbors in connections.items()}
    max_clique = []
    
    def get_pivot(candidates, excluded):
        # Choose pivot vertex that maximizes intersection with candidates
        pivot = None
        max_degree = -1
        for v in candidates.union(excluded):
            degree = len(candidates.intersection(graph[v]))
            if degree > max_degree:
                max_degree = degree
                pivot = v
        return pivot
    
    def bron_kerbosch(clique, candidates, excluded):
            
        if not candidates and not excluded:
            if len(clique) > len(max_clique):
                max_clique.clear()
                max_clique.extend(clique)
            return
            
        pivot = get_pivot(candidates, excluded)
        pivot_neighbors = graph[pivot] if pivot else set()
        
        for v in candidates - pivot_neighbors:
            new_candidates = candidates.intersection(graph[v])
            new_excluded = excluded.intersection(graph[v])
            bron_kerbosch(clique | {v}, new_candidates, new_excluded)
            candidates.remove(v)
            excluded.add(v)
    
    vertices = set(graph.keys())
    bron_kerbosch(set(), vertices, set())
    
    return max_clique

def part2(connections):
    max_clique = find_max_clique(connections)
    return ','.join(sorted(max_clique))

def main():
    input_file = os.path.join(os.path.dirname(__file__), "input.txt")
    connections = parse_input(input_file)
    
    print("Answer for part 1:", part1(connections))
    print("Answer for part 2:", part2(connections))

if __name__ == "__main__":
    main()
