// @ts-ignore
import { HaloRestAPIClient, HttpClient } from '@halo-dev/rest-api-client'
import {
  CommentClient,
} from './client'

export class ContentApiClient {
  private readonly client: HttpClient
  private readonly _comment: CommentClient

  constructor(client: HaloRestAPIClient) {
    this.client = client.buildHttpClient()
    this._comment = new CommentClient(this.client)
  }

  public get comment() {
    return this._comment
  }
}
