'use client';

import React from 'react';

interface ModelsViewerProps {
  models: string[];
  baseUrl: string;
}

export default function ModelsViewer({ models, baseUrl }: ModelsViewerProps) {
  if (models.length === 0) return null;

  return (
    <section>
      <h2>3D Модели</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {models.map((key, i) => (
          // @ts-expect-error custom element
          <model-viewer
            key={i}
            src={`${baseUrl}/${key}`}
            alt={`Модель ${i + 1}`}
            auto-rotate
            camera-controls
            style={{ width: 300, height: 300, margin: 10 }}
          />
        ))}
      </div>
    </section>
  );
}