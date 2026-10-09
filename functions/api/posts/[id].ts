import { handlePosts } from '../../lib/posts';
export const onRequestGet = (context: Parameters<typeof handlePosts>[0]) => handlePosts(context, 'get');
export const onRequestDelete = (context: Parameters<typeof handlePosts>[0]) => handlePosts(context, 'delete');
