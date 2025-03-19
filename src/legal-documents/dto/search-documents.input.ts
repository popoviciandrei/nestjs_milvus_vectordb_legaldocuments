import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SearchDocumentsInput {
  @Field()
  query: string;
}
