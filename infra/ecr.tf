resource "aws_ecr_repository" "users" {
  name = "${var.name}-users"
  image_tag_mutability = "MUTABLE"
}

resource "aws_ecr_repository" "posts" {
  name = "${var.name}-posts"
  image_tag_mutability = "MUTABLE"
}

resource "aws_ecr_repository" "comments" {
  name = "${var.name}-comments"
  image_tag_mutability = "MUTABLE"
}

resource "aws_ecr_repository" "graphql-gateway" {
  name = "${var.name}-graphql-gateway"
  image_tag_mutability = "MUTABLE"
}

locals {
  aws_ecr_lifecycle_policy_json = jsonencode({
    rules = [{
      rulePriority = 1
      description = "keep last 2 images"
      action = {
        type = "expire"
      }
      selection = {
        tagStatus = "any"
        countType = "imageCountMoreThan"
        countNumber = 2
      }
    }]
  })
}

resource "aws_ecr_lifecycle_policy" "users" {
  repository = aws_ecr_repository.users.name
  policy = local.aws_ecr_lifecycle_policy_json
}

resource "aws_ecr_lifecycle_policy" "posts" {
  repository = aws_ecr_repository.users.name
  policy = local.aws_ecr_lifecycle_policy_json
}

resource "aws_ecr_lifecycle_policy" "comments" {
  repository = aws_ecr_repository.users.name
  policy = local.aws_ecr_lifecycle_policy_json
}

resource "aws_ecr_lifecycle_policy" "graphql-gateway" {
  repository = aws_ecr_repository.users.name
  policy = local.aws_ecr_lifecycle_policy_json
}
