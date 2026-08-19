import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context) {
	const posts = await getCollection('blog');
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			// RSS <pubDate>는 원본 최초 작성 시각(created_at)을 사용한다.
			pubDate: post.data.created_at,
			link: `/blog/${post.id}/`,
		})),
	});
}
