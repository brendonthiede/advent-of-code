#!/usr/bin/env bash

for INPUT_TYPE in sample input; do
  node visualizer.js "${INPUT_TYPE}.txt" >tmp.dot
  for GRAPHVIZ_OP in dot neato; do
    eval "${GRAPHVIZ_OP} -Tsvg tmp.dot > ${INPUT_TYPE}-${GRAPHVIZ_OP}.svg"
  done
  rm tmp.dot
done
