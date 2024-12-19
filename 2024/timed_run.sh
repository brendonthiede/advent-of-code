#!/usr/bin/env bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
PARENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." >/dev/null 2>&1 && pwd)"

echo $PARENT_DIR

usage() {
    local -r _exitCode="${1}"
    local -r _errorMessage="${2}"
    if [[ -n "${_errorMessage}" ]]; then
        printf "[ERROR] %s\n\n" "${_errorMessage}"
    fi
    echo " Adds the provided users to the aws-auth configmap in the active EKS cluster."
    echo >&2 " Usage: $0 [-c context] -g group1 -u username1 [username2 ...] [-g group2 -u username3 [username4 ...]] [-d] [-y] [-h]"
    echo >&2 -e "\t-v | --verbose [Optional] If this flag is set output will be more verbose, including each solution output."
    echo >&2 -e "\t-h | --help    Print this message."
    echo >&2 ""
    echo >&2 " Example:"
    echo >&2 -e "\t\t$0 -v"
    exit $1
}

VERBOSE="false"
while [ -n "$1" ]; do
    case "$1" in
    -v | --verbose)
        VERBOSE="true"
        ;;
    -h | --help)
        usage 0
        ;;
    *)
        usage 1 "Invalid parameter '$1'"
        ;;
    esac
    shift
done

SOLUTION_DAYS="$(find "${DIR}" -maxdepth 1 -name "day*" -type d | tr ' ' '\n' | sort -V)"

for DAY_PATH in ${SOLUTION_DAYS}; do
    START_TIME=$(date +%s%3N)
    if [[ ! -s "${DAY_PATH}/README.txt" ]]; then
        continue
    fi
    SOLUTION="$(python3 "${DAY_PATH}/solution.py")"
    END_TIME=$(date +%s%3N)
    ELAPSED_TIME=$((END_TIME - START_TIME))
    SHORT_DAY_PATH="${DAY_PATH#${PARENT_DIR}/}"
    LINES_OF_CODE=$(wc -l <"${DAY_PATH}/solution.py")
    if [[ "${VERBOSE}" == "true" ]]; then
        echo -e "\n${DAY_PATH}"
        echo "${SOLUTION}"
        echo "Elapsed time: ${ELAPSED_TIME} ms"
        echo "Lines of code: ${LINES_OF_CODE}"
    else
        printf "%s %6s ms %4s LoC\n" "${SHORT_DAY_PATH}:" "${ELAPSED_TIME}" "${LINES_OF_CODE}"
    fi
done