resource "aws_cognito_user_pool" "default" {
  name = "${var.name}-${var.environment}-user-pool"
  username_attributes = ["email"]
  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length    = 10
    require_lowercase = false
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
    temporary_password_validity_days = 7
  }

  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_subject = "Account Confirmation"
    email_message = "Your confirmation code is {####}"
  }
}

resource "aws_cognito_user_pool_client" "client" {
  name = "${var.name}-${var.environment}-cognito-user-pool-client"
  user_pool_id = aws_cognito_user_pool.default.id
  generate_secret = false
  callback_urls = concat([
    "http://localhost:5137/authorize",
    "https://${aws_s3_bucket.frontend.website_endpoint}/authorize",
    "https://${aws_route53_record.frontend.name}/authorize",
  ], var.cognito_testing_callbacks)
}

resource "aws_cognito_user_pool_domain" "main" {
  domain = "nestjs-graphql-nats"
  user_pool_id = aws_cognito_user_pool.default.id
}
