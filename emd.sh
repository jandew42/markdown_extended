#!/bin/bash

function helptext {
    echo
    echo "Usage: ./emd.sh input-file.md output-file.html"
    echo
    echo "Markdown helper shell script."
    echo "    splices together premd.html, markdown'd text, postmd.html"
    echo
    exit
}

if [ -z ${1+x} ]; then helptext; fi
if [ -z ${2+x} ]; then helptext; fi

cat premd.html > $2
markdown $1 >> $2
cat postmd.html >> $2
