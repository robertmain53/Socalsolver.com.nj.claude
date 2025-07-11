'use client';
import { usePathname, useRouter } from 'next/navigation';

export default function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (lang: string) => {
    const newPath = '/' + lang + pathname.replace(/^\/[a-z]{2}/, '');
    router.push(newPath);
  };

  return (
    <div className="space-x-2 text-sm">
      <button onClick={() => switchTo('en')}>EN</button>
      <button onClick={() => switchTo('es')}>ES</button>
      <button onClick={() => switchTo('fr')}>FR</button>
    </div>
  );
}
