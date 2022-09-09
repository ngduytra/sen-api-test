import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'
import { EnvironmentVariables } from 'config/configuration'

@Injectable()
export class TwitterService {
  constructor(private config: ConfigService<EnvironmentVariables>) {}

  private readonly token = this.config.get('twitter.token', { infer: true })

  async getMentions(searchKey) {
    const searchQuery = encodeURIComponent(
      `${searchKey} (has:mentions OR has:hashtags OR has:media OR has:links OR is:retweet)`,
    )
    const url = `https://api.twitter.com/2/tweets/search/recent?query=${searchQuery}&expansions=author_id&user.fields=created_at,description,profile_image_url,name,username`
    const { data } = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
    })
    return data
  }
}
