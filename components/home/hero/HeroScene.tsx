"use client"

import { useEffect, useRef } from "react"
import { Canvas, extend, useFrame, useThree, type ThreeElement } from "@react-three/fiber"
import type { MotionValue } from "framer-motion"
import * as THREE from "three"
import { HeroFieldMaterial } from "./heroFieldMaterial"

extend({ HeroFieldMaterial })

declare module "@react-three/fiber" {
  interface ThreeElements {
    heroFieldMaterial: ThreeElement<typeof HeroFieldMaterial>
  }
}

type ThemeColors = { bg: string; fg: string; accent: string }

function Field({ scrollProgress, colors }: { scrollProgress: MotionValue<number>; colors: ThemeColors }) {
  const materialRef = useRef<HeroFieldMaterial>(null)
  const mouseStrengthTarget = useRef(0)
  const { viewport, pointer } = useThree()

  useEffect(() => {
    const onLeave = () => {
      mouseStrengthTarget.current = 0
    }
    const onEnter = () => {
      mouseStrengthTarget.current = 1
    }
    window.addEventListener("pointerdown", onEnter)
    document.addEventListener("mouseleave", onLeave)
    mouseStrengthTarget.current = 1
    return () => {
      window.removeEventListener("pointerdown", onEnter)
      document.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  useFrame((state, delta) => {
    const material = materialRef.current
    if (!material) return
    material.uniforms.uTime.value = state.clock.elapsedTime
    material.uniforms.uAspect.value = viewport.width / viewport.height
    material.uniforms.uScroll.value = scrollProgress.get()
    material.uniforms.uMouse.value.set((pointer.x + 1) / 2, (pointer.y + 1) / 2)
    material.uniforms.uMouseStrength.value = THREE.MathUtils.lerp(
      material.uniforms.uMouseStrength.value,
      mouseStrengthTarget.current,
      1 - Math.pow(0.001, delta)
    )
    material.uniforms.uColorBg.value.set(colors.bg)
    material.uniforms.uColorFg.value.set(colors.fg)
    material.uniforms.uColorAccent.value.set(colors.accent)
  })

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <heroFieldMaterial ref={materialRef} />
    </mesh>
  )
}

export function HeroScene({
  scrollProgress,
  colors,
  interactive,
}: {
  scrollProgress: MotionValue<number>
  colors: ThemeColors
  /** Static single frame when false (reduced motion) — still renders, just doesn't animate. */
  interactive: boolean
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: false, powerPreference: "low-power" }}
      frameloop={interactive ? "always" : "demand"}
      className="!absolute inset-0"
    >
      <Field scrollProgress={scrollProgress} colors={colors} />
    </Canvas>
  )
}
