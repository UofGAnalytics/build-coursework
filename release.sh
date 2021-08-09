#!/usr/bin/env bash

mkdir -p release
rm -rf release/*

cp -R compiler/build/* release/
cp -R template/build/* release/
