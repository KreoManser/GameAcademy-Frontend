'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const ModelsViewer = dynamic(() => import('./ModelsViewer'), {
  ssr: false,
});

interface Props {
  models: string[];
  baseUrl: string;
}

export default function ModelsViewerWrapper({ models, baseUrl }: Props) {
  return <ModelsViewer models={models} baseUrl={baseUrl} />;
}