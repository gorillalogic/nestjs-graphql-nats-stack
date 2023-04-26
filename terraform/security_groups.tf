resource "aws_security_group" "lb_sg" {
  name = "${var.name}-${var.environment}-lb-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    protocol = "tcp"
    from_port = 443
    to_port = 3000
    cidr_blocks = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    protocol = "-1"
    from_port = 0
    to_port = 0
    cidr_blocks = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
}

resource "aws_security_group" "ecs_tasks" {
  name = "${var.name}-sg-task-${var.environment}"
  vpc_id = aws_vpc.main.id

  ingress {
    protocol = "tcp"
    from_port = var.graphql_gateway_port
    to_port = 3000 
    cidr_blocks = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    protocol = "-1"
    from_port = 0
    to_port = 0
    cidr_blocks = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
}

resource "aws_security_group" "rds_sg" {
  name = "${var.name}-rds-${var.environment}"
  vpc_id = aws_vpc.main.id
  
  ingress {
    description = "Allow MySQL traffic from only the ecs_tasks sg"
    from_port   = "3306"
    to_port     = "3306"
    protocol    = "tcp"
    security_groups = [aws_security_group.ecs_tasks.id]
  }
}
