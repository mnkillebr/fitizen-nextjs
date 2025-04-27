"use client";

import { useBreadcrumbs } from "@/components/breadcrumbs-provider";
import { ImageCard } from "@/components/ImageCard";
import Link from "next/link";

interface WorkoutCardLinkProps {
  workout: {
    id: string;
    s3ImageKey: string | null;
    name: string;
    description: string | null;
  }
}

export function WorkoutCardLink({ workout }: WorkoutCardLinkProps) {
  const { setBreadcrumbs } = useBreadcrumbs();
  return (
    <Link
      href={`/workouts/${workout.id}`}
      onNavigate={() => {
        setBreadcrumbs([
          { label: "Workouts", href: "/workouts" },
          { label: workout.name, href: `/workouts/${workout.id}` }
        ])
      }}
    >
      <ImageCard
        imageUrl={workout.s3ImageKey ?? "https://res.cloudinary.com/dqrk3drua/image/upload/f_auto,q_auto/cld-sample-3.jpg"}
        title={workout.name}
        description={workout.description ?? ""}
        type="workout"
      />
    </Link>
  )
}
