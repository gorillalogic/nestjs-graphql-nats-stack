import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Task {
  @Field()
  id: number;

  @Field()
  contents: string;

  @Field()
  completed: boolean;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}
