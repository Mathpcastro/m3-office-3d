// app/layout.tsx - Root layout

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'M3 Office 3D - Dev Trio Visualization',
  description: 'Visualização 3D em tempo real do trio de agentes (Organizer, Coder, Verifier)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
