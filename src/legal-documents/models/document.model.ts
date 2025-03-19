import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Document {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  content: string;
}
