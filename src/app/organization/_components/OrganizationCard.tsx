'use client';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemTitle,
} from '@/components/ui/item';
import type { Organization } from '~/generated/prisma/client';

export default function ProfileCard(organization: Organization) {
  return (
    <Item
      variant="outline"
      className="bg-background flex flex-col sm:flex-row items-start sm:items-center justify-between w-full max-w-2xl px-4 py-3 mt-4 mx-auto gap-2 shadow-md hover:shadow-lg transition-shadow"
    >
      <ItemContent className="flex-1">
        <ItemTitle className="text-base sm:text-lg font-semibold">{organization.name}</ItemTitle>
        <ItemDescription className="text-sm text-foreground">
          {organization.shortDescription}
        </ItemDescription>
      </ItemContent>
      <ItemActions className="">
        <div className="flex flex-col justify-start items-center sm:items-center gap-2">
          <Link href={`/organization/${organization.id}`}>
            <Button
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary-hover hover:text-primary-hover-foreground"
              variant="outline"
            >
              Zum Profil
            </Button>
          </Link>
        </div>
      </ItemActions>
      <ItemFooter className="w-full text-sm text-muted-foreground">
        <p>
          {/* differentiate between results: If there are more than one expertiseArea list this with comma, elsewhen just list the single string */}
          {Array.isArray(organization.expertiseArea)
            ? organization.expertiseArea.join(', ')
            : // replace curly brackets with an empty string
              String(organization.expertiseArea).replace(/{|}/g, '')}
        </p>
      </ItemFooter>
    </Item>
  );
}
