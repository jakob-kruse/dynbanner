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

const gradientColors: Record<string, string[]> = {
  white: ['#fffff', '#fffff'],
  pride: [
    '#e50000',
    '#ff8d00',
    '#fff200',
    '#00ff00',
    '#00ffff',
    '#0000ff',
    '#8b00ff',
    '#ff00ff',
  ],
  trans: ['#5bcffa', '#f5abb9', '#ffffff', '#f5abb9', '#5bcffa'],
  pan: ['#ff1b8d', '#ffd900', '#1bb3ff'],
  bi: [
    '#d60270',
    '#d60270',
    '#d60270',
    '#9b4f96',
    '#0038a8',
    '#0038a8',
    '#0038a8',
  ],
  asexual: [
    '#535c68' /* Not perfect color but you cant really see black on a black background */,
    '#a4a5a4',
    '#ffffff',
    '#810081',
  ],
};

export function getRandomGradient(
  ctx: NodeCanvasRenderingContext2D,
  bannerOptions: BannerOptions,
  text: string,
): CanvasGradient {
  const randomGradientColors =
    gradientColors[
      Object.keys(gradientColors)[
        Math.floor(Math.random() * Object.keys(gradientColors).length)
      ]
    ];
  return fromColors(ctx, bannerOptions, text, randomGradientColors);
}
