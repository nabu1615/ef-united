const { NEXT_PUBLIC_STRAPI_HOST, NEXT_PUBLIC_STRAPI_TOKEN } = process.env;

export function query(url: string) {
  return fetch(`${NEXT_PUBLIC_STRAPI_HOST}/api/${url}`, {
    headers: {
      Authorization: `Bearer ${NEXT_PUBLIC_STRAPI_TOKEN}`,
    },
  }).then((res) => res.json());
}
