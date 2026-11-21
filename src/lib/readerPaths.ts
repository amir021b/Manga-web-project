export function toPublicUrl(path: string): string {
  return path
    .split('/')
    .map((segment) => (segment ? encodeURIComponent(segment) : segment))
    .join('/');
}
