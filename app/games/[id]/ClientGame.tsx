'use client';

import { Unity, useUnityContext } from 'react-unity-webgl';

interface ClientGameProps {
  prefix: string;
}

export default function ClientGame({ prefix }: ClientGameProps) {
  const base = `${process.env.NEXT_PUBLIC_MINIO_BASE_URL}/${prefix}Build/`;

  const { unityProvider, loadingProgression, isLoaded } = useUnityContext({
    loaderUrl: `${base}UnityLoader.js`,
    dataUrl: `${base}YourGame.data.br`,
    frameworkUrl: `${base}YourGame.framework.js.br`,
    codeUrl: `${base}YourGame.wasm.br`,
  });

  return (
    <div>
      {!isLoaded && <p>Загрузка {Math.round(loadingProgression * 100)}%</p>}
      <div style={{ width: 800, height: 600, border: '1px solid #000' }}>
        <Unity unityProvider={unityProvider} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}