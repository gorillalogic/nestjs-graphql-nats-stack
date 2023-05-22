resource "aws_route53_zone" "main" {
  name = "${var.domain}"
}

resource "aws_route53_record" "main" {
  zone_id = aws_route53_zone.main.zone_id
  name = var.domain
  type = "A"
  allow_overwrite = true

  alias {
    name = aws_lb.main.dns_name
    zone_id = aws_lb.main.zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "frontend" {
  zone_id = aws_route53_zone.main.zone_id
  name = var.frontend_domain
  type = "A"
  allow_overwrite = true
  alias {
    name = aws_s3_bucket.frontend.website_endpoint
    zone_id = aws_s3_bucket.frontend.hosted_zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "validation" {
  for_each = {
    for dvo in aws_acm_certificate.main.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = aws_route53_zone.main.zone_id
}
