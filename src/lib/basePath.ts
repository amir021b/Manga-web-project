export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const EXTERNAL_URL = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i;

export function withBasePath(path: string): string {
  if (!path || path === "#" || EXTERNAL_URL.test(path)) return path;

  if (BASE_PATH && (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`))) {
    return path;
  }

  return `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}
