export const calculators = Object.fromEntries(
  Object.entries(
    import.meta.glob('../../generated/calculators/*.js', { eager: true })
  ).map(([p, mod]: any) => [p.split('/').pop()!.replace('.js', ''), mod])
);
