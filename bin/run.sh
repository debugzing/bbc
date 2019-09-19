#!/bin/bash

[ -f /tmp/cncfdemo.pid ] && kill `cat /tmp/cncfdemo.pid`

export NODE_ENV=development
export NODE_PATH=node_modules
export APPDIR=~/cncfdemo
export MONGODB=mongodb://devnode/cncfdemo

bin/cncfdemo.js "$1"
