resource "aws_lb" "main" {
  name = "alb"
  subnets = aws_subnet.public.*.id
  load_balancer_type = "application"
  security_groups = [aws_security_group.lb_sg.id] 
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.main.arn
  port = 443
  protocol = "HTTPS"
  ssl_policy = "ELBSecurityPolicy-2016-08"
  certificate_arn = aws_acm_certificate.main.arn

  default_action {
    type = "forward"
    target_group_arn = aws_lb_target_group.fargate.arn
  }
}

resource "aws_lb_target_group" "fargate" {
  name = "fargate-tg"
  port = 3000
  protocol = "HTTP"
  vpc_id = aws_vpc.main.id
  target_type = "ip"

  health_check {
    healthy_threshold = "3"
    interval = "90"
    protocol = "HTTP"
    // Healcheck route does not exist yet, but I hope for an application error 404.
    matcher = "200-499"
    timeout = "20"
    path = "/"
    unhealthy_threshold = "2"
  }
}
