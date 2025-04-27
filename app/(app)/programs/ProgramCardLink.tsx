"use client";

import { ImageCard } from "@/components/ImageCard";
import Link from "next/link";
import { useBreadcrumbs } from "@/components/breadcrumbs-provider";

interface ProgramCardLinkProps {
  program: {
    id: string;
    name: string;
    description: string | null;
    s3ImageKey: string | null;
  }
}
export function ProgramCardLink({ program }: ProgramCardLinkProps) {
  const { setBreadcrumbs } = useBreadcrumbs();
  return (
    <Link href={`/programs/${program.id}`}
      onNavigate={() => {
        setBreadcrumbs([
          { label: "Programs", href: "/programs" },
          { label: program.name, href: `/programs/${program.id}` }
        ])
      }}
    >
      <ImageCard
        title={program.name}
        // description={program.description ?? ""}
        description="Difficulty Level: Beginner"
        imageUrl={program.s3ImageKey ?? ""}
      />
    </Link>
  )
}
