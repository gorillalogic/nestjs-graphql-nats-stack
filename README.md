# Simple ToDo App Monorepo

<img width="567" alt="image" src="https://github.com/gorillalogic/nestjs-graphql-nats-stack/assets/42254348/bd3650dc-8dd4-412b-a5c5-9a6cd42671a9">

- Simple ToDo App, allows to signup, signin, CRUD tasks and mark as done.
- Using [NestJS](https://nestjs.com/) stack with GraphQL, NATS with a microservice arquitecture.
- MariaDB database on AWS RDS.
- User Management using AWS Cognito.
- Frontend app using [Vite](https://vitejs.dev), React, Redux, Apollo Client. Deployed statically on S3 and cached using Cloudfront.

## File structure

- /frontend contains the files related to the Vite React app.
- /terraform contains the infrastructure related files.
- /apps contain the microservice apps from NestJS.

## Infra

### Setup

- Install Terraform v1.4.6
- Install and configure aws cli
- Run `terraform plan` to see potential changes and `terraform apply` to create the stack.
- Optionally, install [infracost](https://github.com/infracost/infracost) for cost estimates.
- Create terraform.tfvars in the /terraform dir, check variables.tf to see which vars are required.
- This projects relies on AWS Fargate and ECR for storing docker images, so if it is desired to update the task definitions after a docker image update, run:
  ```bash
  terraform apply -replace="aws_ecs_task_definition.main"
  ```
  
### Backend

### Setup
- Developed and tested on Node v18
- Install [NestJS CLI](https://docs.nestjs.com/)
- `brew install nats-streaming-server`
- Install a mysql 8 compatible db locally. Or containerized version.
- Create .env file using .env.example template, in the root dir.

### To publish an image
- An output of the terraform stack is the url of the ECR repository. To publish a new version:
```bash
docker build . --tag <ecr-repo-url>/<image-name>
docker push <ecr-repo-url>/<image-name>
```
- If docker is not authenticated with AWS:
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <aws-account-id>.dkr.ecr.us-east-1.amazonaws.com 
```


## Frontend

### Setup
- Create .env.local and .env.production files, follow .env.example to see which env vars are expected.
- To build run `npm run build` or `npm run build --mode=production`.
- To deploy, if the infrastructure is already deployed and the aws cli is ready to use:
  ```bash
  aws s3 sync ./dist s3://<bucket-name>
  ```

## Where to test
- Write me a DM for access to a hosted app or use a domain of your choice.
