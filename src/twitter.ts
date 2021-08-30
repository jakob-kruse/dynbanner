import { TwitterOptions, default as Twitter } from 'twitter-lite';
import { renderBanner } from './banner';
import { ensureEnv } from './config';
import { incrementTweets } from './db';
import readline from 'readline';
import { promises as fs } from 'fs';
import path from 'path';
import { GradientName } from './gradients';

interface PartialTweet {
  user: {
    id_str: string;
  };
  delete?: unknown;
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

export async function updateBanner(base64Banner: string): Promise<unknown> {
  if (process.env.NODE_ENV === 'development') {
    const pngBanner = Buffer.from(base64Banner, 'base64');
    await fs.writeFile(path.join(__dirname, 'banner.png'), pngBanner);
    return Promise.resolve();
  }

  return twitter.post('account/update_profile_banner', {
    banner: base64Banner,
    height: '1500',
    width: '500',
  });
}

function onTweet(tweet: PartialTweet, gradientName?: GradientName) {
  if (
    tweet?.user?.id_str !== twitterOptions.userId ||
    tweet.delete !== undefined
  ) {
    return;
  }

  const tweetCount = incrementTweets();

  const base64Banner = renderBanner(
    `${tweetCount} tweet${tweetCount === 1 ? '' : 's'} today`,
    gradientName,
  );
  updateBanner(base64Banner);
}

export function listen(): void {
  if (process.env.NODE_ENV === 'development') {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(
      'Fake tweet event with gradient [random]: ',
      (input: string) => {
        onTweet(
          {
            user: {
              id_str: twitterOptions.userId,
            },
          },
          input,
        );
        listen();
      },
    );
    return;
  }

  twitter
    .stream('statuses/filter', { follow: twitterOptions.userId })
    .on('start', () => console.log('start'))
    .on('data', onTweet)
    .on('ping', () => console.log('ping'))
    .on('error', (error) => console.log('error', error))
    .on('end', () => console.log('end'));
}
