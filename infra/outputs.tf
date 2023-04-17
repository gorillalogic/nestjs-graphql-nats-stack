output "ecr_users_repository_url" {
  value = aws_ecr_repository.users.repository_url
}

output "ecr_posts_repository_url" {
  value = aws_ecr_repository.posts.repository_url
}

output "ecr_comments_repository_url" {
  value = aws_ecr_repository.comments.repository_url
}

output "ecr_graphql-gateway_repository_url" {
  value = aws_ecr_repository.graphql-gateway.repository_url
}
