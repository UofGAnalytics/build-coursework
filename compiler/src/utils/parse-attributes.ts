import slugify from 'slugify';

export type Attributes = {
  id: string;
  classes: string[];
};

export function parseAttributes(attributes: string) {
  return attributes.split(' ').reduce(
    (acc: Attributes, str) => {
      if (str.startsWith('#')) {
        acc.id = toSlug(str.slice(1));
      }
      if (str.startsWith('.')) {
        const classes = str.slice(1).split('.').map(toSlug);
        acc.classes.push(...classes);
      }
      return acc;
    },
    {
      id: '',
      classes: [],
    },
  );
}

const slugifyOptions = {
  lower: true,
  strict: true,
  locale: 'en',
};

export function toSlug(value: string) {
  return slugify(value, slugifyOptions);
}
