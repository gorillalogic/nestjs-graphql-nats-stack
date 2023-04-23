resource "aws_ecr_repository" "nest-monorepo" {
  name = "${var.name}-users"
  image_tag_mutability = "MUTABLE"

  lifecycle {
    prevent_destroy = true
  }
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
  repository = aws_ecr_repository.nest-monorepo.name
  policy = local.aws_ecr_lifecycle_policy_json
}
