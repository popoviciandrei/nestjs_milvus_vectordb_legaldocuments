import { ObjectType, Field } from '@nestjs/graphql';
import { Document } from './document.model';

@ObjectType()
export class SearchResult {
  @Field(() => [Document])
  documents: Document[];

  @Field(() => String)
  answer: string;
}
