import { ArrowRight, Building2, Clock, Heart, MapPin, Scale, Star, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import type { Organization } from '~/generated/prisma/browser';

import type { CarouselApi } from '../ui/carousel';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';

export function ResultCarousel({ organizations }: { organizations: Organization[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useState(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  });

  const getOrgTypeStyles = (type: string) => {
    switch (type) {
      case 'Kanzlei':
        return {
          bg: 'bg-blue-50 border-blue-200 text-blue-700',
          icon: Building2,
        };
      case 'Verein':
        return {
          bg: 'bg-purple-50 border-purple-200 text-purple-700',
          icon: Users,
        };
      case 'Gemeinnützig':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
          icon: Heart,
        };
      case 'Beratungsstelle':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-700',
          icon: Scale,
        };
      default:
        return {
          bg: 'bg-muted border-border text-muted-foreground',
          icon: Building2,
        };
    }
  };

  const totalPages = Math.ceil(organizations.length / 4);
  return (
    <>
      <Carousel
        opts={{
          align: 'start',
          loop: false,
        }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent>
          {Array.from({ length: totalPages }).map((_, pageIndex) => (
            <CarouselItem key={pageIndex}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {organizations
                  .slice(pageIndex * 4, pageIndex * 4 + 4)
                  .map((organization, index) => {
                    const orgStyles = getOrgTypeStyles(organization.type);
                    const OrgIcon = orgStyles.icon;

                    return (
                      <Link
                        key={organization.id}
                        href={`/solutions/${organization.id}`}
                        className="group block"
                      >
                        <div className="relative bg-white rounded-3xl border border-border hover:border-primary/40 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
                          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                          <div className="relative p-4 flex flex-col min-h-[250px]">
                            <div className="flex items-start gap-6 mb-4">
                              <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-border group-hover:border-primary/40 transition-colors duration-300">
                                {/* <Image
                                  src={`/professional-lawyer-office-.jpg?height=80&width=80&query=professional+lawyer+office+${
                                    pageIndex * 4 + index
                                  }`}
                                  alt={solution.name}
                                  fill
                                  className="object-cover"
                                /> */}
                              </div>

                              <div className="flex-1 min-w-0">
                                <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-2">
                                  {organization.name}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1.5">
                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    <span className="font-medium">4.{8 + index}</span>
                                    <span className="text-muted-foreground/70">
                                      ({20 + index * 5} Bewertungen)
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <span
                                className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 shadow-sm shrink-0 ${orgStyles.bg}`}
                              >
                                <OrgIcon className="w-3.5 h-3.5" />
                                {organization.type}
                              </span>
                            </div>

                            <p className="text-muted-foreground leading-relaxed text-[15px] mb-6">
                              {organization.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-6">
                              {Array.isArray(organization.expertiseArea)
                                ? organization.expertiseArea.join(', ')
                                : // replace curly brackets with an empty string
                                  String(organization.expertiseArea).replace(/{|}/g, '')}
                            </div>

                            <div className="mt-auto pt-6 border-t border-border/50">
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4" />
                                    <span>München, Bayern</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-emerald-600 font-medium">
                                      Termine verfügbar
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all duration-300">
                                  <span>Profil ansehen</span>
                                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                      </Link>
                    );
                  })}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="-left-4 lg:-left-12 bg-white/95 backdrop-blur-sm shadow-lg border-border hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110" />
        <CarouselNext className="-right-4 lg:-right-12 bg-white/95 backdrop-blur-sm shadow-lg border-border hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110" />
      </Carousel>

      <div className="flex justify-center gap-2 mt-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === current - 1 ? 'w-8 bg-primary' : 'w-2 bg-border'
            }`}
          />
        ))}
      </div>

      <div className="mt-12 bg-linear-to-br from-primary/10 via-accent/10 to-primary/5 rounded-3xl border border-primary/20 p-8 md:p-12 text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Nichts Passendes dabei?
        </h3>
        <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
          Kein Problem! Unser Team hilft Ihnen gerne persönlich weiter, die richtige rechtliche
          Unterstützung für Ihr Anliegen zu finden.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/organizations"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Alle Organisationen durchsuchen
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="mailto:support@jurilib.de"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-foreground rounded-full font-semibold hover:bg-white/90 border-2 border-border transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
          >
            Persönliche Beratung anfordern
          </a>
        </div>
      </div>
    </>
  );
}
