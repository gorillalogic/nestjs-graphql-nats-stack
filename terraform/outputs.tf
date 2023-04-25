output "ecr_users_repository_url" {
  value = aws_ecr_repository.nest-monorepo.repository_url
}

output "aws_db_instance_endpoint" {
  value = aws_db_instance.default.endpoint
}