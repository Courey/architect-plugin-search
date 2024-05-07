#!/bin/sh

Healthy=true
while [ $Healthy ];
do
  if ! ps --pid "$1" > /dev/null; then
      DockerPID=docker inspect -f '{{.State.Pid}}' $2
      if docker ps -q | xargs docker inspect --format '{{.State.Pid}}, {{.Name}}' | grep $DockerPID; then
        docker kill --signal=SIGINT $2
        Healthy=false
  else
    sleep 30
  fi
done
