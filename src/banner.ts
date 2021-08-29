import { createCanvas } from 'canvas';
import { ensureEnv } from './config';
import { getRandomGradient } from './gradients';

export interface BannerOptions {
  width: number;
  height: number;
}

const bannerOptions = ensureEnv<BannerOptions>({
  width: {
    key: 'BANNER_WIDTH',
    type: 'number',
    defaultValue: 1500,
  },
  height: {
    key: 'BANNER_HEIGHT',
    type: 'number',
    defaultValue: 500,
  },
});

export function renderBanner(text: string): string {
  const canvas = createCanvas(bannerOptions.width, bannerOptions.height);
  const ctx = canvas.getContext('2d');

  // Black BG
  ctx.font = 'bold 70pt Menlo';
  ctx.fillStyle = '#000';

  ctx.fillRect(0, 0, bannerOptions.width, bannerOptions.height);

  // Text
  ctx.textAlign = 'center';
  ctx.fillStyle = getRandomGradient(ctx, bannerOptions, text);
  ctx.fillText(text, 750, 285);

  return canvas.toBuffer().toString('base64');
}
