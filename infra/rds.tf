resource "aws_db_subnet_group" "default" {
  subnet_ids = aws_subnet.private.*.id
}

resource "aws_db_instance" "default" {
  allocated_storage         = 5
  max_allocated_storage     = 10
  db_name                   = "${var.database_prefix}_${var.environment}"
  identifier                = "${var.database_prefix}-${var.environment}"
  engine                    = "mariadb"
  engine_version            = "10.6.12"
  instance_class            = "db.t3.micro"
  db_subnet_group_name      = aws_db_subnet_group.default.name
  vpc_security_group_ids    = [aws_security_group.rds_sg.id]
  # Intended for testing purposes only. On prod this should use
  # managed secrets.
  username                  = var.database_username
  password                  = var.database_password
  skip_final_snapshot       = true
  delete_automated_backups  = true
  multi_az                  = false
}
