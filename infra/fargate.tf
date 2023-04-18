resource "aws_ecs_cluster" "main" {
  name = "${var.name}-cluster-${var.environment}"
}

locals {
  aws_ecs_service_name = "${var.name}-service-${var.environment}"
}

resource "aws_ecs_task_definition" "main" {
  family = "service"
  network_mode = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu = var.task_cpu
  memory = var.task_memory
  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn = aws_iam_role.ecs_task_role.arn
  container_definitions = jsonencode([
    {
      name = "graphql-gateway-${var.environment}"
      image = "${aws_ecr_repository.nest-monorepo.repository_url}:latest"
      entryPoint = ["node", "dist/apps/nest-monorepo/main.js"]
      essential = true
      portMappings = [{
        protocol = "tcp"
        containerPort = 3000
        hostPort = var.graphql_gateway_port
      }]
      environment = [
        {
          name = "NODE_ENV"
          value = "production"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group = "/fargate/service/${var.name}-${var.environment}"
          awslogs-region = "${var.aws-region}"
          awslogs-stream-prefix = local.aws_ecs_service_name
        }
      }
    },
    {
      name = "microservice-users-${var.environment}"
      image = "${aws_ecr_repository.nest-monorepo.repository_url}:latest"
      entryPoint = ["node", "dist/apps/users/main.js"]
      essential = true
      portMappings = [{
        protocol = "tcp"
        containerPort = 3000
        hostPort = 3000 
      }]
      environment = [
        {
          name = "NODE_ENV"
          value = "production"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group = "/fargate/service/${var.name}-${var.environment}"
          awslogs-region = "${var.aws-region}"
          awslogs-stream-prefix = local.aws_ecs_service_name
        }
      }
    },
    {
      name = "microservice-posts-${var.environment}"
      image = "${aws_ecr_repository.nest-monorepo.repository_url}:latest"
      entryPoint = ["node", "dist/apps/posts/main.js"]
      essential = true
      portMappings = [{
        protocol = "tcp"
        containerPort = 3000
        hostPort = 3000 
      }]
      environment = [
        {
          name = "NODE_ENV"
          value = "production"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group = "/fargate/service/${var.name}-${var.environment}"
          awslogs-region = "${var.aws-region}"
          awslogs-stream-prefix = local.aws_ecs_service_name
        }
      }
    },
    {
      name = "microservice-comments-${var.environment}"
      image = "${aws_ecr_repository.nest-monorepo.repository_url}:latest"
      entryPoint = ["node", "dist/apps/comments/main.js"]
      essential = true
      portMappings = [{
        protocol = "tcp"
        containerPort = 3000
        hostPort = 3000 
      }]
      environment = [
        {
          name = "NODE_ENV"
          value = "production"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group = "/fargate/service/${var.name}-${var.environment}"
          awslogs-region = "${var.aws-region}"
          awslogs-stream-prefix = local.aws_ecs_service_name
        }
      }
    },
    {
      name = "nats-${var.environment}"
      image = "nats:latest"
      essential = true
      portMappings = [
        {
          protocol = "tcp"
          containerPort = 4222 
          hostPort = 4222
        }, 
        {
          protocol = "tcp"
          containerPort = 8222
          hostPort = 8222
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group = "/fargate/service/${var.name}-${var.environment}"
          awslogs-region = "${var.aws-region}"
          awslogs-stream-prefix = local.aws_ecs_service_name
        }
      }
    },
  ])
}

resource "aws_ecs_service" "main" {
  name = local.aws_ecs_service_name
  cluster = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.main.arn
  desired_count = 1
  deployment_minimum_healthy_percent = 0
  deployment_maximum_percent = 200
  launch_type = "FARGATE"
  scheduling_strategy = "REPLICA"

  network_configuration {
    security_groups = [aws_security_group.ecs_tasks.id]
    subnets = aws_subnet.public.*.id
    assign_public_ip = true
  }

  lifecycle {
    # ignore_changes = [task_definition, desired_count]
  }
}
