#!/bin/sh
# Erases terraform resources that are non-free. Use after work. Check infracost report.
terraform destroy \
  -target aws_db_instance.default \
  -target aws_ecs_service.main \
  -target aws_lb.main \
  -target aws_nat_gateway.main
