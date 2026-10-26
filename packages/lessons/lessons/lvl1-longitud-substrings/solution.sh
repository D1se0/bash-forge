#!/usr/bin/env bash
lengua="bashforge.sh"
echo "cantidad: ${#lengua}"
echo "comienzo: ${lengua:0:4}"
echo "extension: ${lengua##*.}"
