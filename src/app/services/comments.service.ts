import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommentList } from '../components/charts/charts-interfaces';

const CommentsQuery = (commentsBlockName) => {
  return gql`
{
  getComentsByCommentsBlockName(commentsBlockName:"${commentsBlockName}") {
    _id
    likesCounter
    comments {
      username
      text
      commentBlockId
      _id
    }
    createdAt
    name
    description
  }
}
`;
};

const AddCommentMutation = gql`
  mutation ($username: String!, $text: String!, $commentBlockId: ID!) {
    addComment(
      username: $username,
      text: $text
      commentBlockId: $commentBlockId,
    ) {
      _id,
      username,
      text,
      commentBlockId
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(public apollo: Apollo) { }

  getComments(commentsBlockName): Observable<CommentList> {
    return this.apollo.watchQuery<any>({
      query: CommentsQuery(commentsBlockName)
    }).valueChanges.pipe(map(({ data }) => {
      return data.getComentsByCommentsBlockName;
    }));
  }

  addComment(commentData): Observable<any> {
    return this.apollo.mutate({
      mutation: AddCommentMutation,
      variables: {
        username: commentData.username,
        text: commentData.text,
        commentBlockId: commentData.commentBlockId
      }
    });
  }

}
