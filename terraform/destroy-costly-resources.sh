#!/bin/sh
# Erases terraform resources that are non-free, run when not working. Check infracost resport.
terraform destroy \
  -target aws_db_instance.default \
  -target aws_ecs_service.main \
  -target aws_lb.main \
  -target aws_nat_gateway.main
