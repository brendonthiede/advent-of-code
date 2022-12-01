#!/usr/bin/env bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

CHALLENGE_DAY="${1}"

# Install Homebrew
type -p brew || /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"

# Install fzf
type -p fzf || (brew install fzf && $(brew --prefix)/opt/fzf/install && source ~/.zshrc)

if [[ -z "${CHALLENGE_DAY}" ]]; then
    CHALLENGE_DAY="$(find ${DIR} -type d -name 'day*' -maxdepth 1 -exec basename {} \; | sed 's/day\([0-9]*\)/\1/g' | sort -n -r | fzf --header="What day are you running tests for?")"
fi

CHALLENGE_FOLDER="${DIR}/day${CHALLENGE_DAY}"
TESTS="$(find ${CHALLENGE_FOLDER} -type f -name '*.test.*' -maxdepth 1 -exec basename {} \;)"
echo "Running tests for Day ${CHALLENGE_DAY}"
for _test in ${TESTS}; do
    _test_path="${CHALLENGE_FOLDER}/${_test}"
    echo -e "\n${_test_path}"
    node "${_test_path}"
done
