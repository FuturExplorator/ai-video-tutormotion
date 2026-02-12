import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { TryNowButton } from "./try-now-button";
import { VideoCarousel } from "./video-carousel";

export const metadata: Metadata = {
  title: "TutorMotion - Screenshot to Video Tutorials",
  description: "Instantly convert static screenshots into professional video tutorials. No recording, no editing, just AI.",
};

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("landing");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-purple-50 dark:to-purple-950/20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-32 pb-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-sm font-medium">
            {t("hero.badge")}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-foreground tracking-tight">
            TutorMotion
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 font-medium">
            {t("hero.subtitle")}
          </p>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            {t("hero.description")}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
            <Link href={`/${locale}/text-to-video`}>
              <Button size="lg" className="text-lg px-10 py-7 rounded-full shadow-lg hover:shadow-xl transition-all">
                {t("hero.start_creating")}
              </Button>
            </Link>
          </div>

          {/* Video Preview */}
          <div className="relative w-full max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-border bg-card">
            <div className="aspect-video relative">
              <VideoCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* Simple Feature Grid */}
      <section className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="p-8 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-all">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 text-3xl">📸</div>
            <h3 className="text-xl font-bold mb-3">Screenshot to Video</h3>
            <p className="text-muted-foreground leading-relaxed">Upload your UI screenshots and let AI generate smooth transitions between states.</p>
          </div>
          <div className="p-8 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-all">
            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6 text-3xl">✨</div>
            <h3 className="text-xl font-bold mb-3">Auto-Animation</h3>
            <p className="text-muted-foreground leading-relaxed">AI automatically understands UI elements and animates mouse movements and clicks.</p>
          </div>
          <div className="p-8 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-all">
            <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-6 text-3xl">🚀</div>
            <h3 className="text-xl font-bold mb-3">Ready to Publish</h3>
            <p className="text-muted-foreground leading-relaxed">Export high-quality MP4s ready for YouTube, Docs, or Social Media in seconds.</p>
          </div>
        </div>
      </section>
    </div>
  );
}