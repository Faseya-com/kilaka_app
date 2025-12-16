import ProviderProfile from './ProviderProfile';

export default function ProviderProfilePage({ params }) {
  return <ProviderProfile params={params} />;
}

export async function generateStaticParams() {
  return [];
}

export const dynamicParams = true;
