import { handlePosts } from '../../lib/posts';
export const onRequestPost = (context: Parameters<typeof handlePosts>[0]) => handlePosts(context, 'publish');
