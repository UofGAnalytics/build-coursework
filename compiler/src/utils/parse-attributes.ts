export type Attributes = {
  id: string;
  classes: string[];
};

export function parseAttributes(attributes: string) {
  return attributes.split(' ').reduce(
    (acc: Attributes, str) => {
      if (str.startsWith('#')) {
        acc.id = str.slice(1);
      }
      if (str.startsWith('.')) {
        const classes = str.slice(1).split('.');
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
