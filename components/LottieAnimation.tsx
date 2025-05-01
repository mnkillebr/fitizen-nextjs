"use client";

import { DotLottie, DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useState } from "react";

export function LottieAnimation({ src, autoplay, loop }: { src: string, autoplay: boolean, loop?: boolean }) {
  const [dotLottie, setDotLottie] = useState<DotLottie | null>(null);
  return (
    <DotLottieReact
      dotLottieRefCallback={setDotLottie}
      src={src}
      autoplay={autoplay}
      loop={loop}
      onMouseEnter={() => dotLottie?.play()}
      onMouseLeave={() => dotLottie?.pause()}
    />
  )
}