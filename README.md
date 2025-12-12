# Advent of Code

<http://adventofcode.com/>

## 2025

* Day 1: Be careful that you don't count yourself as crossing 0 if you start there.
* Day 2: Straightforward. No repeating pattern can be longer than half the total length.
* Day 3: Always go for the largest number available while leaving enough remaining digits to fill the rest of the number.
* Day 4: Adjacent includes diagonals.
* Day 5: Easiest one so far, but still fun. Combining overlapping ranges in the beginning made part 2 trivial.
* Day 6: Just have to parse the data correctly, and then it's simple math.
* Day 7: You can skip every other row since the splitters are only on odd rows.
* Day 8: The exact distances don't matter, just the relative sizes, so you can use squared distances. Use [Union-Find](https://en.wikipedia.org/wiki/Disjoint-set_data_structure) to group the circuits, using path compression, and always union by size.
* Day 9: Using the [Shapely](https://shapely.readthedocs.io/en/stable/) library helped with this one.
* Day 10: Had to dust off my discrete math skills for this one. Used the `milp` function from the [SciPy](https://scipy.org/) library to solve the integer linear programming problem.
* Day 11: My favorite puzzle of the year. A straightforward depth-first search with memoization. Just make your data immutable and use lru_cache.
* Day 12: With simple enough present shapes, just try naive area comparison. More present shapes would require a more complex packing algorithm.
