// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://ai-blog-kwm.pages.dev',
	integrations: [mdx(), sitemap()],
	redirects: {
		'/blog': '/',
		'/about': '/',
	},
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Nanum Gothic',
			cssVariable: '--font-nanum-gothic',
			weights: [400, 700],
			subsets: ['korean', 'latin'],
			fallbacks: ['system-ui', 'sans-serif'],
		},
		{
			provider: fontProviders.local(),
			name: 'NanumSquare',
			cssVariable: '--font-nanum-square',
			fallbacks: ['Nanum Gothic', 'system-ui', 'sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/NanumSquareR.woff2'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/NanumSquareB.woff2'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/NanumSquareEB.woff2'],
						weight: 800,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
