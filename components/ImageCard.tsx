import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="relative h-[calc(30.6vh)] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          style={{ objectPosition: 'top center', opacity: comingSoon ? 0.6 : 1 }} 
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="relative z-10 h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-white text-shadow">{title}</CardTitle>
          <CardDescription className="text-white/80 text-shadow">{description}</CardDescription>
        </CardHeader>
        {/* <CardContent className="flex-1">
          <p className="text-foreground/80">{description}</p>
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
        <div className="absolute inset-0 flex items-center justify-center text-white font-semibold text-4xl">COMING SOON</div>
      )}
    </Card>
  );
} 