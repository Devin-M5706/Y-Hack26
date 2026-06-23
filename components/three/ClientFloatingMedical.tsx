"use client";

import dynamic from "next/dynamic";

const FloatingMedical = dynamic(
  () => import("@/skills/three/FloatingMedical"),
  { ssr: false }
);

export default function ClientFloatingMedical({
  className = "",
}: {
  className?: string;
}) {
  return <FloatingMedical className={className} />;
}
