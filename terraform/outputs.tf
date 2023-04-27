output "ecr_users_repository_url" {
  value = aws_ecr_repository.nest-monorepo.repository_url
}

output "aws_db_instance_endpoint" {
  value = aws_db_instance.default.endpoint
}

output "dns_servers" {
  value = aws_route53_zone.main.name_servers
}

output "cognito_user_pool_id" {
  value = aws_cognito_user_pool.default.id
}

output "cognito_client_id" {
  value = aws_cognito_user_pool_client.client.id
}
