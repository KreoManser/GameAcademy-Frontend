'use client';

import dynamic from 'next/dynamic';

const ClientGame = dynamic(() => import('./ClientGame'), {
  ssr: false,
});

export default function ClientGameWrapper(props: { prefix: string }) {
  return <ClientGame {...props} />;
}