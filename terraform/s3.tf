resource "aws_s3_bucket" "frontend" {
  bucket = "${var.name}-${var.environment}-frontend"
}

resource "aws_s3_bucket_public_access_block" "main" {
  bucket = aws_s3_bucket.frontend.id
}

resource "aws_s3_bucket_website_configuration" "main" {
  bucket = aws_s3_bucket.frontend.id
  index_document {
    suffix = "index.html"
  }
}

resource "aws_s3_bucket_policy" "main" {
  bucket = aws_s3_bucket.frontend.id
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": [
        "s3:GetObject"
      ],
      "Resource": [
        "${aws_s3_bucket.frontend.arn}/*"
      ]
    }
  ]
}
EOF
  depends_on = [
    aws_s3_bucket_public_access_block.main,
  ]
}
