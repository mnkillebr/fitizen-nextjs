import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import clsx from "clsx";
import Image from "next/image";

interface ImageCardProps {
  title: string;
  description?: string;
  imageUrl: string;
  comingSoon?: boolean;
  type?: "workout" | "program";
}

export function ImageCard({ title, description, imageUrl, comingSoon = false, type = "program" }: ImageCardProps) {
  return (
    <Card className={clsx("relative h-[calc(30.6vh)] overflow-hidden", type === "workout" ? "h-[calc(29.2vh)]" : "")}>
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          style={{ objectPosition: 'top center', opacity: comingSoon ? 0.6 : 1 }} 
          priority
        />
      </div>
      <div className="relative z-10 h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-white text-shadow-lg" style={{ textShadow: `2px 2px 2px #424242` }}>{title}</CardTitle>
          <CardDescription className="text-white text-shadow-lg" style={{ textShadow: `2px 2px 2px #424242` }}>{description}</CardDescription>
        </CardHeader>
        {/* <CardContent className="flex-1">
          <p className="text-white text-shadow font-semibold">{title}</p>
          <p className="text-white/80 text-shadow text-sm">{description}</p>
        </CardContent> */}
      </div>
      {type === "program" ? (
        <div className="absolute bottom-0 right-0 w-1/3 h-1/6 bg-transparent">
          <div className="flex items-center justify-center select-none bg-primary text-slate-900 font-bold rounded-tl-lg rounded-br-lg w-full h-full">Go &rarr;</div>
        </div>
      ) : (
        <div className="absolute bottom-0 right-0 w-1/3 h-1/6 bg-transparent">
          <div className="flex items-center justify-center select-none bg-primary text-slate-900 font-bold rounded-tl-lg rounded-br-lg w-full h-full">Go &rarr;</div>
        </div>
      )}
      {comingSoon && (
        <div className="absolute inset-0 flex items-center justify-center text-white font-semibold text-4xl" style={{ textShadow: `2px 4px 4px #424242` }}>COMING SOON</div>
      )}
    </Card>
  );
} 