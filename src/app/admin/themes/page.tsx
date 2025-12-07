import dynamic from 'next/dynamic';

const ThemeManagerClient = dynamic(() => import('./ThemeManagerClient'), { ssr: false });

export default function ThemeManagerPage() {
  return <ThemeManagerClient />;
}