import StormDB from 'stormdb';
import path from 'path';

const db = new StormDB(
  new StormDB.localFileEngine(path.join(__dirname, '..', 'db.stormdb')),
);

db.default({
  tweetCount: {},
});

// Get date without time
export function getToday(): string {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
}

export function getTweets(date: string = getToday()): number {
  if (process.env.NODE_ENV === 'development') {
    return Math.floor(Math.random() * 100);
  }

  const tweetCounts = db.get('tweetCount');
  if (!tweetCounts.value()[date]) {
    return 0;
  }
  return tweetCounts.value()[date];
}

export function incrementTweets(date: string = getToday()): number {
  if (process.env.NODE_ENV === 'development') {
    return Math.floor(Math.random() * 100);
  }

  const currentTweets = getTweets(date);
  const newTweetCount = currentTweets + 1;

  db.get('tweetCount').set(date, newTweetCount).save();

  return newTweetCount;
}
