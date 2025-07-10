import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations();
  return (
    <main>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </main>
  );
}
