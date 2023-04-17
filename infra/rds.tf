resource "aws_db_instance" "default" {
  allocated_storage         = 5
  max_allocated_storage     = 10
  db_name                   = "${var.name}_db"
  engine                    = "mariadb"
  engine_version            = "10.6.12"
  instance_class            = "db.t3.micro"
  parameter_group_name      = "default.mariadb-10.6.12"
  # Intended for testing purposes only. On prod this should use
  # managed secrets.
  username                  = var.database_username
  password                  = var.database_password
  skip_final_snapshot       = true
  delete_automated_backups  = true
}
