import dynamic from 'next/dynamic';

const PageBuilderClient = dynamic(() => import('./PageBuilderClient'), { ssr: false });

export default function PageBuilderPage() {
  return <PageBuilderClient />;
}