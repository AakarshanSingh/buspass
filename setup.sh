#!/bin/bash

if [ "$1" = "stop" ]; then
  sudo docker compose down
elif [ "$1" = "build" ]; then
  sudo docker compose up -d --build
else
  sudo docker compose up -d
fi
