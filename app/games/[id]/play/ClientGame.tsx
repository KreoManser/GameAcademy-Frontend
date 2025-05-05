'use client'

import { useEffect } from 'react'
import { Unity, useUnityContext } from 'react-unity-webgl'
import styles from './play.module.css'

interface ClientGameProps {
  prefix: string
  canvasClass: string
}

export default function ClientGame({ prefix, canvasClass }: ClientGameProps) {
  const base = `${process.env.NEXT_PUBLIC_MINIO_BASE_URL}/${prefix}Build/`
  const {
    unityProvider,
    unload,
    loadingProgression,
    isLoaded,
  } = useUnityContext({
    loaderUrl:    `${base}UnityLoader.js`,
    dataUrl:      `${base}YourGame.data.br`,
    frameworkUrl: `${base}YourGame.framework.js.br`,
    codeUrl:      `${base}YourGame.wasm.br`,
  })

  useEffect(() => {
    return () => {
      if (typeof unload === 'function') {
        unload().catch((e) => {
          console.debug('Unity unload failed (ignored):', e)
        })
      }
    }
  }, [unload])

  return (
    <div className={styles.gameWrapper}>
      {!isLoaded && (
        <p className={styles.gameLoading}>
          Загрузка {Math.round(loadingProgression * 100)}%
        </p>
      )}
      <Unity unityProvider={unityProvider} className={`${canvasClass} unity-canvas`} />
    </div>
  )
}