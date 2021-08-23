import { TwitterOptions, default as Twitter } from 'twitter-lite';
import { renderBanner } from './banner';
import { ensureEnv } from './config';
import { getToday, incrementTweets } from './db';

interface PartialTweet {
  user: {
    id_str: string;
  };
  delete: unknown | undefined;
}

const twitterConfig = ensureEnv<TwitterOptions>({
  consumer_key: 'TWITTER_CONSUMER_KEY',
  consumer_secret: 'TWITTER_CONSUMER_SECRET',
  access_token_key: 'TWITTER_ACCESS_TOKEN_KEY',
  access_token_secret: 'TWITTER_ACCESS_TOKEN_KEY_SECRET',
  bearer_token: {
    key: 'TWITTER_BEARER_TOKEN',
    defaultValue: '',
  },
  extension: {
    key: 'TWITTER_API_EXTENSIONS',
    defaultValue: '.json',
  },
  subdomain: {
    key: 'TWITTER_SUBDOMAIN',
    defaultValue: 'api',
  },
  version: {
    key: 'TWITTER_API_VERSION',
    defaultValue: '1.1',
  },
});

const twitterOptions = ensureEnv<{ userId: string }>({
  userId: 'TWITTER_USER_ID',
});

const twitter = new Twitter(twitterConfig);

export function updateBanner(base64Banner: string): Promise<unknown> {
  return twitter.post('account/update_profile_banner', {
    banner: base64Banner,
    height: '1500',
    width: '500',
  });
}

function onTweet(tweet: PartialTweet) {
  if (
    tweet?.user?.id_str !== twitterOptions.userId ||
    tweet.delete !== undefined
  ) {
    return;
  }

  const tweetCount = incrementTweets(getToday());

  const base64Banner = renderBanner(
    `${tweetCount} tweet${tweetCount === 1 ? '' : 's'} today`,
  );
  updateBanner(base64Banner);
}

export function listen(): void {
  twitter
    .stream('statuses/filter', { follow: twitterOptions.userId })
    .on('start', () => console.log('start'))
    .on('data', onTweet)
    .on('ping', () => console.log('ping'))
    .on('error', (error) => console.log('error', error))
    .on('end', () => console.log('end'));
}
