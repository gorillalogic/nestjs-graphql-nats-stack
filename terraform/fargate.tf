resource "aws_ecs_cluster" "main" {
  name = "${var.name}-cluster-${var.environment}"
}

locals {
  aws_ecs_service_name = "${var.name}-service-${var.environment}"
  common_env_vars = [
    {
      name = "NODE_ENV"
      value = "production"
    },
    {
      name = "NO_COLOR"
      value = "1"
    },
    {
      name = "DATABASE_TYPE"
      value = "mariadb"
    },
    {
      name = "DATABASE_HOST"
      value = aws_db_instance.default.address
    },
    {
      name = "DATABASE_PORT"
      value = tostring(aws_db_instance.default.port)
    },
    {
      name = "DATABASE_USERNAME"
      value = aws_db_instance.default.username
    },
    {
      name = "DATABASE_PASSWORD"
      value = aws_db_instance.default.password
    },
    {
      name = "DATABASE_DATABASE"
      value = aws_db_instance.default.db_name
    }
  ]
  gateway_container_name = "graphql-gateway-${var.environment}" 
  gateway_container_port = 3000
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
      name = local.gateway_container_name
      image = "${aws_ecr_repository.nest-monorepo.repository_url}:latest"
      entryPoint = ["sh", "./entrypoint.sh"]
      essential = true
      portMappings = [{
        protocol = "tcp"
        containerPort = local.gateway_container_port 
        hostPort = local.gateway_container_port 
      }]
      environment = concat(local.common_env_vars, [
        {
          name = "COGNITO_USER_POOL_ID",
          value = aws_cognito_user_pool.default.id,
        },
        {
          name = "COGNITO_CLIENT_ID",
          value = aws_cognito_user_pool_client.client.id,
        },
      ])
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
      environment = concat(local.common_env_vars, [])
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
      name = "microservice-tasks-${var.environment}"
      image = "${aws_ecr_repository.nest-monorepo.repository_url}:latest"
      entryPoint = ["node", "dist/apps/tasks/main.js"]
      essential = true
      environment = concat(local.common_env_vars, [])
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

  load_balancer {
    target_group_arn = aws_lb_target_group.fargate.arn
    container_name = local.gateway_container_name 
    container_port = local.gateway_container_port
  }

  lifecycle {
    # ignore_changes = [task_definition, desired_count]
  }
}
