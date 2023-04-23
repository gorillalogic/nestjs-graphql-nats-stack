#!/bin/bash

# For now assume a single task is running

function extractIP {
  local clusterARN='arn:aws:ecs:us-east-1:630933348161:cluster/nest-graphql-nats-cluster-dev'

  local taskARNFilter='.taskArns[]'
  local taskARN=$(aws ecs list-tasks --cluster $clusterARN --output json | jq -r "$taskARNFilter")
  echo "TaskARN: ${taskARN}"

  local einFilter='.tasks[].attachments[].details[] | select(.name=="networkInterfaceId") | .value'
  local ein=$(aws ecs describe-tasks --tasks $taskARN --cluster $clusterARN | jq -r "$einFilter")
  echo "EIN: ${ein}"

  local ipFilter='.NetworkInterfaces[].Association.PublicIp'
  local ip=$(aws ec2 describe-network-interfaces --network-interface-ids $ein | jq -r "$ipFilter")
  echo "IP: ${ip}"
}

extractIP
