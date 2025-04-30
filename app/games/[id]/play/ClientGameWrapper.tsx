'use client';

import dynamic from 'next/dynamic';

const ClientGame = dynamic(() => import('./ClientGame'), { ssr: false });

export default function ClientGameWrapper({
  prefix,
  canvasClass,
}: {
  prefix: string;
  canvasClass: string;
}) {
  return <ClientGame prefix={prefix} canvasClass={canvasClass} />;
}