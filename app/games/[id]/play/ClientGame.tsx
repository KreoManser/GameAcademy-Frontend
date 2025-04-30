'use client';

import { Unity, useUnityContext } from 'react-unity-webgl';
import styles from './play.module.css';

interface ClientGameProps {
  prefix: string;
  canvasClass: string;
}

export default function ClientGame({ prefix, canvasClass }: ClientGameProps) {
  const base = `${process.env.NEXT_PUBLIC_MINIO_BASE_URL}/${prefix}Build/`;
  const { unityProvider, loadingProgression, isLoaded } = useUnityContext({
    loaderUrl: `${base}UnityLoader.js`,
    dataUrl:    `${base}YourGame.data.br`,
    frameworkUrl:`${base}YourGame.framework.js.br`,
    codeUrl:    `${base}YourGame.wasm.br`,
  });

  return (
    <div className={styles.gameWrapper}>
      {!isLoaded && (
        <p className={styles.gameLoading}>
          Загрузка {Math.round(loadingProgression * 100)}%
        </p>
      )}
      <Unity
        unityProvider={unityProvider}
        className={canvasClass}
      />
    </div>
  );
}