"use client";

import dynamic from "next/dynamic";

const ParticleField = dynamic(
  () => import("@/skills/three/ParticleField"),
  { ssr: false }
);

export default function ClientParticleField({
  nodeCount = 80,
  className = "",
}: {
  nodeCount?: number;
  className?: string;
}) {
  return <ParticleField nodeCount={nodeCount} className={className} />;
}
