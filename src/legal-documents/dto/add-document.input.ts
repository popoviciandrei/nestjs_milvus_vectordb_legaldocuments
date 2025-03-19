import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddDocumentInput {
  @Field()
  title: string;

  @Field()
  content: string;
}
