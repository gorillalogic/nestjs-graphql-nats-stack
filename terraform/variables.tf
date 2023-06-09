variable "name" {
  description = "the name of your stack, e.g \"demo\""
  default = "nest-graphql-nats"
}

variable "domain" {
  description = "Domain name"
}

variable "frontend_domain" {
  description = "Name of the bucket that contains the frontend files"
}

variable "environment" {
  description = "the name of your environment, e.g \"prod\""
  default = "dev"
}

variable "aws-region" {
  type = string
  description  = "AWS region to launch servers."
  default = "us-east-1"
}

variable "database_prefix" {
  type = string
  description = "Prefix of RDS database name"
  default = "nestdb"
}

variable "availability_zones" {
  description = "a comma-separated list of availability zones, defaults to all AZ of the region, if set to something other than the defaults, both private_subnets and public_subnets have to be defined as well"
  default     = ["us-east-1a", "us-east-1b", "us-east-1c", "us-east-1d"]
}

variable "cidr" {
  description = "The CIDR block for the VPC."
  default     = "10.0.0.0/16"
}

variable "public_subnets" {
  description = "a list of CIDRs for public subnets in your VPC, must be set if the cidr variable is defined, needs to have as many elements as there are availability zones"
  default     = ["10.0.0.0/24", "10.0.1.0/24"]
} 

variable "private_subnets" {
  description = "a list of CIDRs for public subnets in your VPC, must be set if the cidr variable is defined, needs to have as many elements as there are availability zones"
  default     = ["10.0.2.0/24", "10.0.3.0/24"]
}

variable "graphql_gateway_port" {
  description = "the external port used in the task for the graphql gateway."
  default = 80
}

variable "database_username" {
  description = "The database authentication username"
  default = "root"
}

variable "database_password" {
  description = "The database authentication password"
  default = "secretpassword"
}

variable "task_cpu" {
  description = "The number of CPU units used by the task"
  default = 512 
}

variable "task_memory" {
  description = "The amount (in MiB) of memory used by the task"
  default = 2048
}

variable "logs_retention_in_days" {
  type = number
  default = 30
  description = "Specifies the number of days you want to retain log events"
}

variable "cognito_testing_callbacks" {
  type = list(string)
  description = "Cognito Testing Callbacks, like ngrok endpoints"
  default = []
}
