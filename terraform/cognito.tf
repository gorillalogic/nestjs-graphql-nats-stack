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
}

resource "aws_cognito_user_pool_domain" "main" {
  domain = "nestjs-graphql-nats"
  user_pool_id = aws_cognito_user_pool.default.id
}
