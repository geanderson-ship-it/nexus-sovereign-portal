import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cursos de Elite | Nexus Training',
  description: 'Desenvolva liderança de alta performance e domine a inteligência artificial com os cursos da Nexus. Formações práticas para o mercado do futuro.',
  keywords: 'cursos de liderança, treinamento ia, mentoria executiva, nexus treinamento',
};


export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
