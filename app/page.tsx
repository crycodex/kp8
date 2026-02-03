"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const FaultyTerminal = dynamic(
  () => import("@/components/FaultyTerminal").then((m) => m.default),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed right-4 top-4 z-20">
        <ThemeToggle />
      </div>
      <div className="fixed inset-0 z-0">
        <FaultyTerminal
          className="absolute inset-0 w-full h-full"
          scale={1.5}
          gridMul={[2, 1]}
          digitSize={1.2}
          timeScale={0.5}
          pause={false}
          scanlineIntensity={0.5}
          glitchAmount={1}
          flickerAmount={1}
          noiseAmp={1}
          chromaticAberration={0}
          dither={0}
          curvature={0.1}
          tint="#A7EF9E"
          mouseReact
          mouseStrength={0.5}
          pageLoadAnimation
          brightness={0.6}
        />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <main className="flex max-w-lg flex-col items-center gap-8 text-center backdrop-blur-2xl p-4 rounded-lg shadow-sm">
          <div >
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Dashboard de Proyectos
            </h1>
            <p className="mt-3 text-muted-foreground">
              Gestiona tus proyectos, rastrea el estado y colabora con tus clientes.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/projects">Ver proyectos →</Link>
          </Button>
          {/* creditos */}
          <div className="text-sm text-muted-foreground">
            <p>
              <span className="font-medium">Dashboard de Proyectos</span> by <a href="https://www.isnotcristhianr.dev/" className="text-foreground hover:underline">@cry.code</a>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
