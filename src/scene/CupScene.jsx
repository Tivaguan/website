import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { ACESFilmicToneMapping } from 'three'
import { Cup } from './Cup'

export function CupScene({ modelUrl, onCupReady }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 38 }}
      dpr={[1, 1.5]}
      shadows
      style={{ pointerEvents: 'none' }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => {
        gl.toneMapping = ACESFilmicToneMapping
        gl.toneMappingExposure = 1.1
      }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[3, 5, 4]}
        intensity={0.9}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
      />
      <directionalLight position={[-4, 1, -2]} intensity={0.3} />

      <Suspense fallback={null}>
        <Cup modelUrl={modelUrl} onReady={onCupReady} />
        <Environment preset="studio" />
      </Suspense>
    </Canvas>
  )
}
