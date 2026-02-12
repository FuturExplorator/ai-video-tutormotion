"use client";

import { Section as SectionType } from "@/types/blocks/section";
import { ArrowRight } from "lucide-react";

export default function Steps({ section }: { section: SectionType }) {
    if (section.disabled) {
        return null;
    }

    return (
        <section id={section.name} className="py-24 bg-muted/30">
            <div className="container">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
                    <p className="text-muted-foreground text-lg">{section.description}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {section.items?.map((item, index) => (
                        <div key={index} className="relative flex flex-col items-center text-center">
                            {/* Step Number */}
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold mb-6 relative z-10">
                                {index + 1}
                            </div>

                            {/* Connector Line (Desktop only) */}
                            {index < (section.items?.length || 0) - 1 && (
                                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-border -z-0">
                                    <div className="absolute right-0 -top-1.5 text-border">
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            )}

                            <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                            <p className="text-muted-foreground leading-relaxed max-w-sm">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
