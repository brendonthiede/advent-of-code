#!/usr/bin/env bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

find "${DIR}" -name "*.py" -type f -exec chmod +x {} \;

SOLUTION_DAYS="$(find "${DIR}" -maxdepth 1 -name "day*" -type d)"

SOLUTION_DAYS=$(echo "${SOLUTION_DAYS}" | tr ' ' '\n' | sort -V)

for DAY in ${SOLUTION_DAYS}; do
    echo -e "\n${DAY}"
    START_TIME=$(date +%s%3N)
    python3 "${DAY}/solution.py"
    END_TIME=$(date +%s%3N)
    ELAPSED_TIME=$((END_TIME - START_TIME))
    echo "Elapsed time: ${ELAPSED_TIME} ms"
done