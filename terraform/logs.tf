resource "aws_cloudwatch_log_group" "logs" {
  name              = "/fargate/service/${var.name}-${var.environment}"
  retention_in_days = var.logs_retention_in_days
}
