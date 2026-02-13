'use client';

import { Award, CheckCircle2, Heart, LanguagesIcon } from 'lucide-react';
import Image from 'next/image';

import justitiaImage from '~/public/justitia-stockfootage.jpg';
import laywer1 from '~/public/lawyer1-stockfootage.jpg';
import lawyer2 from '~/public/lawyer2-stockfootage.jpg';
import lawyer3 from '~/public/lawyer3-stockfootage.jpg';

const trustPoints = [
  { icon: Heart, text: 'Inklusiv und barrierearm' },
  { icon: Award, text: 'Geprüfte Expert*innen' },
  { icon: LanguagesIcon, text: 'Mehrsprachige Angebote' },
  { icon: CheckCircle2, text: 'Vielfältige Auswahl' },
];

export default function TrustSection() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-card relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Image side - hidden on mobile, shown on desktop */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              {/* https://pixabay.com/photos/justitia-justice-libra-law-lawyer-5341989/ - no license required */}
              <Image
                src={justitiaImage}
                alt="Justitia mit Waage"
                width={600}
                height={400}
                className="object-cover w-full h-100"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent" />

              {/* Floating card */}
              <div className="absolute bottom-6 left-6 right-6 bg-card/95 backdrop-blur-sm rounded-2xl p-4 border border-border shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {/* https://pixabay.com/photos/woman-smile-happy-justice-7236476/ - no license required */}
                    <Image
                      src={laywer1}
                      alt="lawyer"
                      width={100}
                      height={100}
                      className="w-12 h-12 rounded-full border-2 border-background object-cover"
                    />
                    {/* https://pixabay.com/photos/girl-happy-thumbs-up-portrait-like-7078326/ - no license required */}
                    <Image
                      src={lawyer2}
                      alt=""
                      width={100}
                      height={100}
                      className="w-12 h-12 rounded-full border-2 border-background object-cover"
                    />
                    {/* https://pixabay.com/photos/woman-business-glasses-7922048/ - no license required */}
                    <Image
                      src={lawyer3}
                      alt=""
                      width={100}
                      height={100}
                      className="w-12 h-12 rounded-full border-2 border-background object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">Über 500 Expert*innen</p>
                    <p className="text-xs text-muted-foreground">Bereit, dir zu helfen</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
          </div>

          {/* Content side */}
          <div>
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-2 md:mb-3">
              Warum JuriLib
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground tracking-tight mb-4 md:mb-6">
              Demokratisierung <br className="hidden md:block" />
              <span className="text-muted-foreground">des Rechts für alle</span>
            </h2>
            <p className="text-base md:text-lg text-foreground leading-relaxed mb-6 md:mb-8">
              Der Zugang zu rechtlicher Unterstützung ist oft mit hohen Hürden verbunden –
              insbesondere für marginalisierte Gruppen. Jurilib verfolgt daher das Ziel, einen
              möglichst barrierearmen Weg zum Rechtsbeistand zu schaffen und so den Zugang zum Recht
              nachhaltig zu demokratisieren.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {trustPoints.map((point, index) => {
                const Icon = point.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border shadow-sm"
                  >
                    <div className="p-2 rounded-lg bg-foreground shrink-0">
                      <Icon className="w-5 h-5 text-accent-white" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{point.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
