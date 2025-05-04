'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './media-gallery.module.css';

type MediaItem = {
  type: 'image' | 'video';
  key: string;
};

interface MediaGalleryProps {
  images: string[];
  videos: string[];
  imagesBase: string;
  videosBase: string;
}

export default function MediaGallery({
  images,
  videos,
  imagesBase,
  videosBase,
}: MediaGalleryProps) {
  const all: MediaItem[] = [
    ...images.map((key) => ({ type: 'image' as const, key })),
    ...videos.map((key) => ({ type: 'video' as const, key })),
  ];

  const [selected, setSelected] = useState<MediaItem | null>(
    all.length > 0 ? all[0] : null
  );

  if (!selected) return null;

  return (
    <div className={styles.gallery}>
      <div className={styles.mainMedia}>
        {selected.type === 'image' ? (
          <Image
            src={`${imagesBase}/${encodeURIComponent(selected.key)}`}
            alt=""
            fill
            style={{ objectFit: 'contain' }}
            sizes="(max-width: 768px) 100vw, 66vw"
            quality={90}
            priority
            />
        ) : (
          <video
            src={`${videosBase}/${encodeURIComponent(selected.key)}`}
            controls
            className={styles.mainVideo}
          />
        )}
      </div>

      <div className={styles.thumbs}>
        {all.map((item) => {
          const isActive =
            item.key === selected.key && item.type === selected.type;

          return (
            <button
              key={`${item.type}-${item.key}`}
              className={`${styles.thumbItem} ${
                isActive ? styles.active : ''
              }`}
              onClick={() => setSelected(item)}
              type="button"
            >
              {item.type === 'image' ? (
                <Image
                  src={`${imagesBase}/${encodeURIComponent(item.key)}`}
                  alt=""
                  width={80}
                  height={60}
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
              ) : (
                <video
                  src={`${videosBase}/${encodeURIComponent(item.key)}`}
                  muted
                  className={styles.thumbVideo}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}