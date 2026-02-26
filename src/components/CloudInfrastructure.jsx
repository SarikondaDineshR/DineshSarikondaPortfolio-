import React, { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import useMouseTilt from '../hooks/useMouseTilt'

// Multi-cloud service nodes — 3 providers in orbital rings
const CLOUD_GROUPS = [
  {
    provider: 'Azure',
    color: '#007FFF',
    ringRadius: 2.2,
    ringTilt: 0,
    ringOffset: 0,
    nodes: [
      { label: 'App Services', size: 0.13 },
      { label: 'AKS', size: 0.12 },
      { label: 'Azure SQL', size: 0.11 },
      { label: 'Event Hubs', size: 0.11 },
    ],
  },
  {
    provider: 'AWS',
    color: '#FF9900',
    ringRadius: 2.2,
    ringTilt: Math.PI / 2.5,
    ringOffset: Math.PI * 0.66,
    nodes: [
      { label: 'Lambda', size: 0.12 },
      { label: 'ECS', size: 0.11 },
      { label: 'RDS', size: 0.11 },
      { label: 'Bedrock', size: 0.12 },
    ],
  },
  {
    provider: 'GCP',
    color: '#4285F4',
    ringRadius: 2.2,
    ringTilt: -Math.PI / 3,
    ringOffset: Math.PI * 1.33,
    nodes: [
      { label: 'GKE', size: 0.12 },
      { label: 'Cloud Run', size: 0.11 },
      { label: 'BigQuery', size: 0.12 },
      { label: 'Vertex AI', size: 0.11 },
    ],
  },
]

// Flatten all nodes with positions
function buildNodes() {
  const allNodes = []
  CLOUD_GROUPS.forEach((group, gi) => {
    group.nodes.forEach((node, ni) => {
      const angle = (ni / group.nodes.length) * Math.PI * 2 + group.ringOffset
      const tilt = group.ringTilt
      const r = group.ringRadius
      const x = Math.cos(angle) * r
      const y = Math.sin(angle) * r * Math.cos(tilt)
      const z = Math.sin(angle) * r * Math.sin(tilt)
      allNodes.push({
        ...node,
        id: `${group.provider}-${ni}`,
        color: group.color,
        provider: group.provider,
        position: [x, y, z],
        groupIndex: gi,
        nodeIndex: ni,
      })
    })
  })
  return allNodes
}

const ALL_NODES = buildNodes()

// Connect nodes within same provider ring
const CONNECTIONS = []
ALL_NODES.forEach((node, i) => {
  ALL_NODES.forEach((other, j) => {
    if (i < j && node.provider === other.provider) {
      CONNECTIONS.push([i, j])
    }
  })
})
// Add a few cross-cloud connections
CONNECTIONS.push([0, 4], [1, 8], [3, 7])

function ConnectionLine({ start, end, color, opacity = 0.2 }) {
  const ref = useRef()

  const points = useMemo(() => {
    const s = new THREE.Vector3(...start)
    const e = new THREE.Vector3(...end)
    const mid = new THREE.Vector3().lerpVectors(s, e, 0.5)
    mid.multiplyScalar(0.85)
    const curve = new THREE.QuadraticBezierCurve3(s, mid, e)
    return curve.getPoints(18)
  }, [start, end])

  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points])

  useFrame((state) => {
    if (ref.current) {
      ref.current.material.opacity = opacity * (0.5 + Math.sin(state.clock.elapsedTime * 0.6) * 0.25)
    }
  })

  return (
    <line ref={ref} geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </line>
  )
}

function DataParticle({ startPos, endPos, color }) {
  const ref = useRef()
  const progress = useRef(Math.random())

  useFrame((_, delta) => {
    if (!ref.current) return
    progress.current = (progress.current + delta * 0.35) % 1
    const t = progress.current
    const s = new THREE.Vector3(...startPos)
    const e = new THREE.Vector3(...endPos)
    const mid = new THREE.Vector3().lerpVectors(s, e, 0.5)
    mid.multiplyScalar(0.85)
    const curve = new THREE.QuadraticBezierCurve3(s, mid, e)
    const pt = curve.getPoint(t)
    ref.current.position.copy(pt)
    ref.current.material.opacity = Math.sin(t * Math.PI) * 0.9
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.03, 4, 4]} />
      <meshBasicMaterial color={color} transparent opacity={0.9} />
    </mesh>
  )
}

function ServiceNode({ node, index }) {
  const ref = useRef()
  const ringRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.4
    const s = hovered ? 1.35 : 1
    ref.current.scale.lerp(new THREE.Vector3(s, s, s), 0.08)
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.5
      ringRef.current.material.opacity = hovered ? 0.6 : 0.18
    }
  })

  return (
    <Float speed={1.2 + index * 0.1} rotationIntensity={0.08} floatIntensity={0.25}>
      <group position={node.position}>
        <mesh
          ref={ref}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <icosahedronGeometry args={[node.size, 1]} />
          <meshStandardMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={hovered ? 1 : 0.35}
            roughness={0.15}
            metalness={0.85}
          />
        </mesh>

        {/* Orbital ring */}
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[node.size * 2, 0.007, 8, 28]} />
          <meshBasicMaterial color={node.color} transparent opacity={0.18} />
        </mesh>

        {/* Hover glow sphere */}
        {hovered && (
          <mesh>
            <sphereGeometry args={[node.size * 2.5, 8, 8]} />
            <meshBasicMaterial
              color={node.color}
              transparent
              opacity={0.06}
              side={THREE.BackSide}
            />
          </mesh>
        )}
      </group>
    </Float>
  )
}

function CentralOrb() {
  const ref = useRef()
  const wireRef = useRef()

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.06
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.04) * 0.08
    if (wireRef.current) {
      wireRef.current.rotation.y = -state.clock.elapsedTime * 0.04
      wireRef.current.rotation.z = state.clock.elapsedTime * 0.03
    }
  })

  return (
    <>
      {/* Central multi-cloud orb */}
      <group ref={ref}>
        <mesh>
          <sphereGeometry args={[0.35, 20, 20]} />
          <meshStandardMaterial
            color="#111830"
            emissive="#0044AA"
            emissiveIntensity={0.5}
            roughness={0.05}
            metalness={0.95}
            transparent
            opacity={0.9}
          />
        </mesh>
        {/* Outer glow */}
        <mesh>
          <sphereGeometry args={[0.5, 12, 12]} />
          <meshBasicMaterial color="#007FFF" transparent opacity={0.04} side={THREE.BackSide} />
        </mesh>
      </group>

      {/* Wireframe geodesic */}
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[0.7, 2]} />
        <meshBasicMaterial color="#007FFF" wireframe transparent opacity={0.06} />
      </mesh>
    </>
  )
}

function Scene({ tilt }) {
  const groupRef = useRef()

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, tilt.x, 0.05)
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, tilt.y, 0.05)
  })

  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[4, 4, 4]} intensity={2} color="#007FFF" />
      <pointLight position={[-4, -3, 3]} intensity={1.2} color="#FF9900" />
      <pointLight position={[0, -4, -3]} intensity={1} color="#4285F4" />
      <pointLight position={[2, 3, -4]} intensity={0.8} color="#512BD4" />

      <group ref={groupRef}>
        <CentralOrb />

        {ALL_NODES.map((node, i) => (
          <ServiceNode key={node.id} node={node} index={i} />
        ))}

        {CONNECTIONS.map(([a, b], i) => (
          <ConnectionLine
            key={i}
            start={ALL_NODES[a].position}
            end={ALL_NODES[b].position}
            color={ALL_NODES[a].color}
            opacity={ALL_NODES[a].provider === ALL_NODES[b].provider ? 0.25 : 0.12}
          />
        ))}

        {/* Particle flows on primary connections */}
        {CONNECTIONS.slice(0, 6).map(([a, b], i) => (
          <DataParticle
            key={`p${i}`}
            startPos={ALL_NODES[a].position}
            endPos={ALL_NODES[b].position}
            color={ALL_NODES[a].color}
          />
        ))}
      </group>
    </>
  )
}

export default function CloudInfrastructure({ isLowPerf = false }) {
  const tilt = useMouseTilt(0.1)

  if (isLowPerf) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="relative w-64 h-64">
          <div className="absolute inset-0 rounded-full border border-azure/15 animate-pulse" />
          <div className="absolute inset-8 rounded-full border border-azure/08" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-azure/80 text-4xl mb-2">☁</div>
              <div className="text-white/30 text-[10px] tracking-widest">MULTI-CLOUD</div>
              <div className="flex gap-2 mt-3 justify-center">
                {['Azure','AWS','GCP'].map(c => (
                  <span key={c} className="text-[9px] text-white/20 border border-white/10 px-2 py-0.5">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 52 }}
      dpr={[1, 1.5]}
      performance={{ min: 0.5 }}
      style={{ background: 'transparent' }}
    >
      <Scene tilt={tilt} />
    </Canvas>
  )
}
