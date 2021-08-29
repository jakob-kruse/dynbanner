import { NodeCanvasRenderingContext2D, CanvasGradient } from 'canvas';
import { BannerOptions } from './banner';

function fromColors(
  ctx: NodeCanvasRenderingContext2D,
  bannerOptions: BannerOptions,
  text: string,
  colors: string[],
): CanvasGradient {
  const textWidth = ctx.measureText(text).width;

  const gradient = ctx.createLinearGradient(
    bannerOptions.width / 2 - textWidth / 2,
    bannerOptions.height / 2,
    bannerOptions.width / 2 + textWidth / 2,
    bannerOptions.height / 2,
  );

  colors.forEach((c, i) => {
    gradient.addColorStop(i / colors.length, c);
  });

  return gradient;
}

export function prideGradient(
  ctx: NodeCanvasRenderingContext2D,
  bannerOptions: BannerOptions,
  text: string,
): CanvasGradient {
  return fromColors(ctx, bannerOptions, text, [
    '#e50000',
    '#ff8d00',
    '#fff200',
    '#00ff00',
    '#00ffff',
    '#0000ff',
    '#8b00ff',
    '#ff00ff',
  ]);
}

export function transGradient(
  ctx: NodeCanvasRenderingContext2D,
  bannerOptions: BannerOptions,
  text: string,
): CanvasGradient {
  return fromColors(ctx, bannerOptions, text, [
    '#5bcffa',
    '#f5abb9',
    '#ffffff',
    '#f5abb9',
    '#5bcffa',
  ]);
}

export function white(
  ctx: NodeCanvasRenderingContext2D,
  bannerOptions: BannerOptions,
  text: string,
): CanvasGradient {
  return fromColors(ctx, bannerOptions, text, ['#ffffff', '#ffffff']);
}

export const gradientFunctions = {
  prideGradient,
  transGradient,
  white,
};

export function getRandomGradientName(): keyof typeof gradientFunctions {
  const keys = Object.keys(gradientFunctions);
  return keys[
    Math.floor(Math.random() * keys.length)
  ] as keyof typeof gradientFunctions;
}
