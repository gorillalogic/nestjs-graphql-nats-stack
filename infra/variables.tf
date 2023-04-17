variable "name" {
  description = "the name of your stack, e.g \"demo\""
  default = "nest-graphql-nats"
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

variable "availability_zones" {
  description = "a comma-separated list of availability zones, defaults to all AZ of the region, if set to something other than the defaults, both private_subnets and public_subnets have to be defined as well"
  default     = ["us-east-1a", "us-east-1b"]
}

variable "cidr" {
  description = "The CIDR block for the VPC."
  default     = "10.0.0.0/16"
}

variable "public_subnets" {
  description = "a list of CIDRs for public subnets in your VPC, must be set if the cidr variable is defined, needs to have as many elements as there are availability zones"
  default     = ["10.0.16.0/20"]
} 

variable "graphql_gateway_port" {
  description = "the external an internal ports used in the task for the graphql gateway."
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
