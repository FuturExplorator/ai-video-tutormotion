import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { VideoCarousel } from "./video-carousel";
import Feature from "@/components/blocks/feature";
import Testimonial from "@/components/blocks/testimonial";
import CTA from "@/components/blocks/cta";
import FAQ from "@/components/blocks/faq";
import Steps from "@/components/landing/steps";
import { Section } from "@/types/blocks/section";

export const metadata: Metadata = {
  title: "TutorMotion - Screenshot to Video Tutorials",
  description: "Instantly convert static screenshots into professional video tutorials. No recording, no editing, just AI.",
  alternates: {
    canonical: "https://tutormotion.xyz",
  }
};

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("landing");

  // Construct Data for Sections
  const featuresData: Section = {
    name: "features",
    title: t("features.title"),
    description: t("features.subtitle"),
    items: [
      {
        icon: "LuImage",
        title: t("features.items.0.title"),
        description: t("features.items.0.description"),
      },
      {
        icon: "LuMousePointerClick",
        title: t("features.items.1.title"),
        description: t("features.items.1.description"),
      },
      {
        icon: "LuDownload",
        title: t("features.items.2.title"),
        description: t("features.items.2.description"),
      },
      {
        icon: "LuVideoOff",
        title: t("features.items.3.title"),
        description: t("features.items.3.description"),
      },
    ],
  };

  const stepsData: Section = {
    name: "how-it-works",
    title: t("how_it_works.title"),
    description: t("how_it_works.subtitle"),
    items: [
      {
        title: t("how_it_works.steps.0.title"),
        description: t("how_it_works.steps.0.description"),
      },
      {
        title: t("how_it_works.steps.1.title"),
        description: t("how_it_works.steps.1.description"),
      },
      {
        title: t("how_it_works.steps.2.title"),
        description: t("how_it_works.steps.2.description"),
      },
    ],
  };

  const testimonialData: Section = {
    name: "testimonials",
    title: t("testimonials.title"),
    description: t("testimonials.subtitle"),
    items: [
      {
        title: t("testimonials.items.0.author"),
        label: t("testimonials.items.0.role"),
        description: t("testimonials.items.0.content"),
        image: { src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", alt: "Sarah" },
      },
      {
        title: t("testimonials.items.1.author"),
        label: t("testimonials.items.1.role"),
        description: t("testimonials.items.1.content"),
        image: { src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike", alt: "Mike" },
      },
      {
        title: t("testimonials.items.2.author"),
        label: t("testimonials.items.2.role"),
        description: t("testimonials.items.2.content"),
        image: { src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica", alt: "Jessica" },
      },
    ],
  };

  const faqData: Section = {
    name: "faq",
    title: t("faq.title"),
    description: t("faq.subtitle"),
    items: [
      {
        title: t("faq.items.0.question"),
        description: t("faq.items.0.answer"),
      },
      {
        title: t("faq.items.1.question"),
        description: t("faq.items.1.answer"),
      },
      {
        title: t("faq.items.2.question"),
        description: t("faq.items.2.answer"),
      },
    ],
  };

  const ctaData: Section = {
    name: "cta",
    title: t("cta.title"),
    description: t("cta.subtitle"),
    buttons: [
      {
        title: t("cta.button"),
        url: `/${locale}/text-to-video`,
        variant: "default",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/50 to-background dark:from-purple-950/20 dark:to-background -z-10" />
        <div className="container mx-auto px-4">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-sm font-medium animate-fade-in-up">
              {t("hero.badge")}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-foreground tracking-tight animate-fade-in-up animation-delay-200">
              TutorMotion
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-6 font-medium animate-fade-in-up animation-delay-200">
              {t("hero.subtitle")}
            </p>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400">
              {t("hero.description")}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20 animate-fade-in-up animation-delay-400">
              <Link href={`/${locale}/text-to-video`}>
                <Button size="lg" className="text-lg px-10 py-7 rounded-full shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                  {t("hero.start_creating")}
                </Button>
              </Link>
            </div>

            {/* Video Preview */}
            <div className="relative w-full max-w-6xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-border bg-card animate-fade-in-up animation-delay-600">
              <div className="aspect-video relative">
                <VideoCarousel />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Steps */}
      <Steps section={stepsData} />

      {/* Features Grid */}
      <Feature section={featuresData} />

      {/* Testimonials */}
      <Testimonial section={testimonialData} />

      {/* FAQ */}
      <FAQ section={faqData} />

      {/* CTA */}
      <CTA section={ctaData} />
    </div>
  );
}