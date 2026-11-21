import { withBasePath } from './basePath';

export function toPublicUrl(path: string): string {
  const encoded = path
    .split('/')
    .map((segment) => (segment ? encodeURIComponent(segment) : segment))
    .join('/');

  return withBasePath(encoded);
}
