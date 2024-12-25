#!/usr/bin/env bash

find . -not -path '*/\.git/*' \( -name '*.py' -o -name '*.sh' \) -type f -exec chmod +x {} \;
