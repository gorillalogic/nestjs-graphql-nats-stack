# Fargate Task Execution Role

resource "aws_iam_role" "ecs_task_execution_role" {
  name = "${var.name}-ecsTaskExecutionRole"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": {
    "Action": "sts:AssumeRole",
    "Principal": {
      "Service": "ecs-tasks.amazonaws.com"
    },
    "Effect": "Allow",
    "Sid": ""
  }
}
EOF
}

resource "aws_iam_role_policy_attachment" "ecs-task_execution-role-policy-attachment" {
  role = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Fargate Task Role

resource "aws_iam_role" "ecs_task_role" {
  name = "${var.name}-ecsTaskRole"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_policy" "rds_access_policy" {
  name = "${var.name}-dynamodb-ecs-access"
  path = "/"
  description = "Provides access to ${aws_db_instance.default.db_name} RDS"
  # Define more granular permissions to the specific db user.
  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
              "rds-db:connect"
            ],
            "Resource": "*"
        }
    ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "ecs-task-role-policy-attachment" {
  role = aws_iam_role.ecs_task_role.name
  policy_arn = aws_iam_policy.rds_access_policy.arn
}
