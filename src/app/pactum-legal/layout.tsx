import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pactum Legal | Central de Marcas',
  description: 'Central de Inteligência Jurídica e Gestão de Marcas do Dr. Felipe Querol',
  manifest: '/pactum-manifest.json',
};

export default function PactumLegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
