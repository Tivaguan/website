import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, useGLTF } from '@react-three/drei'
import { Box3, Vector3 } from 'three'
import { gsap } from 'gsap'
import { CUP_LABEL, CUP_MODEL, CUP_MOTION, cupTransform } from './cupState'

/**
 * Widest horizontal radius of the model within a thin horizontal slab,
 * measured in normalised (post-fit) space. The cup tapers, so the label has
 * to sit at the wall's actual radius at its height, not the rim's.
 */
function radiusAtHeight(model, y, slab, fitScale, fitOffset) {
  const v = new Vector3()
  let max = 0

  model.traverse((child) => {
    const position = child.isMesh && child.geometry?.attributes?.position
    if (!position) return

    for (let i = 0; i < position.count; i++) {
      v.fromBufferAttribute(position, i).applyMatrix4(child.matrixWorld)
      if (Math.abs(v.y * fitScale + fitOffset.y - y) > slab) continue
      const r = Math.hypot(v.x * fitScale + fitOffset.x, v.z * fitScale + fitOffset.z)
      if (r > max) max = r
    }
  })

  return max
}

// Real per-character advance widths, read from the brand font itself (loaded
// via the Google Fonts <link> in index.html) rather than guessed — so the
// curved wordmark carries the same kerning as matchai.ma's flat one.
const MEASURE_PX = 200
let measureCtx = null
function measureCharWidths(text) {
  measureCtx ??= document.createElement('canvas').getContext('2d')
  measureCtx.font = `700 ${MEASURE_PX}px Oswald, sans-serif`
  return [...text].map((char) => measureCtx.measureText(char).width / MEASURE_PX)
}

/**
 * The cup.
 *
 * Three nested groups keep concerns separate —
 *   outer: the authored transform from cupState (what future sections animate)
 *   inner: ambient idle spin, float and cursor parallax
 *   fit:   the model's own centring/normalising transform
 * so ambient motion never fights a tween on cupTransform, and swapping the
 * model never invalidates the numbers in CUP_STATES.
 */
export function CupAsset({ modelUrl = CUP_MODEL.url }) {
  const { scene } = useGLTF(modelUrl)

  // Centre the model on its own origin, scale it to a known height, and lay
  // the wordmark out along the wall's true radius at the label's height.
  const { model, fitScale, fitOffset, label } = useMemo(() => {
    const model = scene.clone(true)
    model.updateMatrixWorld(true)
    model.traverse((child) => {
      if (!child.isMesh) return
      child.castShadow = true
      child.receiveShadow = true
    })

    const box = new Box3().setFromObject(model)
    const size = box.getSize(new Vector3())
    const center = box.getCenter(new Vector3())
    const fitScale = CUP_MODEL.fitHeight / Math.max(size.y, 1e-6)
    const fitOffset = center.clone().multiplyScalar(-fitScale)

    const height = CUP_MODEL.fitHeight
    const fontSize = height * CUP_LABEL.fontSizeRatio
    // centerAt is measured from the base; the model is centred on its middle.
    const labelY = (CUP_LABEL.centerAt - 0.5) * height
    const textRadius =
      radiusAtHeight(model, labelY, fontSize * 0.5, fitScale, fitOffset) + CUP_LABEL.textLift

    const widths = measureCharWidths(CUP_LABEL.text).map((w) => w * fontSize * CUP_LABEL.tracking)
    const totalWidth = widths.reduce((a, b) => a + b, 0)
    let cursor = -totalWidth / 2
    const chars = [...CUP_LABEL.text].map((char, i) => {
      const centerOffset = cursor + widths[i] / 2
      cursor += widths[i]
      return { char, angle: centerOffset / textRadius }
    })

    return {
      model,
      fitScale,
      fitOffset,
      label: { y: labelY, fontSize, textRadius, chars },
    }
  }, [scene])

  return (
    <group>
      <primitive object={model} scale={fitScale} position={fitOffset} />

      {/* Wordmark, printed straight onto the cup wall — one glyph per Text
          so it wraps the curve instead of clipping through it. */}
      <group position={[0, label.y, 0]}>
        {label.chars.map(({ char, angle }, i) => (
          <Text
            key={`${char}-${i}`}
            font={CUP_LABEL.font}
            position={[
              Math.sin(angle) * label.textRadius,
              0,
              Math.cos(angle) * label.textRadius,
            ]}
            rotation={[0, angle, 0]}
            fontSize={label.fontSize}
            anchorX="center"
            anchorY="middle"
            castShadow
            receiveShadow
          >
            {char}
            <meshStandardMaterial
              color="#171713"
              roughness={0.76}
              metalness={0}
              toneMapped
              polygonOffset
              polygonOffsetFactor={-2}
              polygonOffsetUnits={-2}
            />
          </Text>
        ))}
      </group>
    </group>
  )
}

export function Cup({ modelUrl = CUP_MODEL.url, onReady }) {
  const outer = useRef()
  const inner = useRef()
  const previousModel = useRef(modelUrl)
  const mouseRotation = useRef({ x: 0, y: 0 })
  const pointer = useRef({ x: 0, y: 0 })
  const variant = useRef({ y: 0, scale: 1, rotY: 0 })
  const entrance = useRef({
    x: 0,
    y: -0.42,
    z: 0,
    scale: 0.64,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
  })

  useEffect(() => {
    const handlePointerMove = (event) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [])

  useLayoutEffect(() => {
    onReady?.()

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      Object.assign(entrance.current, {
        x: 0,
        y: 0,
        z: 0,
        scale: 1,
        rotX: 0,
        rotY: 0,
        rotZ: 0,
      })
      return
    }

    const intro = gsap.to(entrance.current, {
      y: 0,
      scale: 1,
      duration: 1.15,
      delay: 0,
      ease: 'power2.out',
    })

    return () => intro.kill()
  }, [onReady])

  useLayoutEffect(() => {
    if (previousModel.current === modelUrl) return
    previousModel.current = modelUrl

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      Object.assign(variant.current, { y: 0, scale: 1, rotY: 0 })
      return
    }

    Object.assign(variant.current, { y: -0.08, scale: 0.78, rotY: -0.22 })
    const tween = gsap.to(variant.current, {
      y: 0,
      scale: 1,
      rotY: 0,
      duration: 0.7,
      ease: 'power3.out',
    })

    return () => tween.kill()
  }, [modelUrl])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime

    outer.current.position.set(
      cupTransform.x + entrance.current.x,
      cupTransform.y + entrance.current.y + variant.current.y,
      cupTransform.z + entrance.current.z,
    )
    outer.current.rotation.set(
      cupTransform.rotX + entrance.current.rotX,
      cupTransform.rotY + entrance.current.rotY,
      cupTransform.rotZ + entrance.current.rotZ,
    )
    outer.current.scale.setScalar(
      cupTransform.scale * entrance.current.scale * variant.current.scale,
    )

    const k = 1 - Math.exp(-CUP_MOTION.parallaxDamping * delta)
    mouseRotation.current.x +=
      (-pointer.current.y * CUP_MOTION.mousePitch - mouseRotation.current.x) * k
    mouseRotation.current.y +=
      (pointer.current.x * CUP_MOTION.mouseYaw - mouseRotation.current.y) * k

    inner.current.rotation.y = mouseRotation.current.y + variant.current.rotY
    inner.current.rotation.x = mouseRotation.current.x
    inner.current.position.y = Math.sin(t * CUP_MOTION.floatSpeed) * CUP_MOTION.floatAmplitude
  })

  return (
    <group ref={outer}>
      <group ref={inner}>
        <CupAsset modelUrl={modelUrl} />
      </group>
    </group>
  )
}

useGLTF.preload(CUP_MODEL.url)
