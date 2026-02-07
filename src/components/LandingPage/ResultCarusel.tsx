import Link from 'next/link';
import { useEffect, useState } from 'react';

import { OrganizationCard } from '@/app/organization/_components/OrganizationCard';
import type { Organization } from '~/generated/prisma/client';

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

  useEffect(() => {
    if (!api) return;

    const updateCarouselState = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };

    // Initialize state asynchronously
    requestAnimationFrame(updateCarouselState);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const totalPages = Math.ceil(organizations.length / 4);
  return (
    <>
      <Carousel
        opts={{
          align: 'start',
          loop: false,
          dragFree: true,
        }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent>
          {Array.from({ length: totalPages }).map((_, pageIndex) => (
            <CarouselItem key={pageIndex}>
              <div className="flex flex-wrap justify-center gap-6 p-2">
                {organizations
                  .slice(pageIndex * 4, pageIndex * 4 + 4)
                  .map((organization: Organization) => {
                    return (
                      <Link
                        key={organization.id}
                        href={`/organization/${organization.id}`}
                        className="group block w-full lg:w-[calc(50%-0.75rem)]" // Copilot: Calculating width for 2 items per row with gap
                      >
                        <OrganizationCard organization={organization} />
                      </Link>
                    );
                  })}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="-left-4 lg:-left-12 bg-background backdrop-blur-sm shadow-lg border-border hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110" />
        <CarouselNext className="-right-4 lg:-right-12 bg-background backdrop-blur-sm shadow-lg border-border hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110" />
      </Carousel>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mt-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === current - 1 ? 'w-8 bg-accent-gray' : 'w-2 bg-border'
            }`}
          />
        ))}
      </div>
    </>
  );
}
