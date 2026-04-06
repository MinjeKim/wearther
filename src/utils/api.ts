export const toQueryString = (params: Record<string, string | number>) =>
    new URLSearchParams(
        Object.entries(params).reduce<Record<string, string>>((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {}),
    ).toString();