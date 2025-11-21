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
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full max-w-2xl px-4 py-3 mt-4 mx-auto gap-2 shadow-md hover:shadow-lg transition-shadow"
    >
      <ItemContent className="flex-1">
        <ItemTitle className="text-base sm:text-lg font-semibold">{organization.name}</ItemTitle>
        <ItemDescription className="text-sm text-gray-800">
          {organization.description}
        </ItemDescription>
      </ItemContent>
      <ItemActions className="">
        <div className="flex flex-col justify-start items-center sm:items-center gap-2">
          <div className="bg-gray-100 pt-1 px-3 pb-1 rounded-md">
            {/* Placeholder for pricing info, adjust as needed */}
            <p>€€€</p>
          </div>
          <Link href={`/organization/${organization.id}`}>
            <Button
              className="w-full sm:w-auto bg-black text-white hover:bg-gray-500 hover:text-white"
              variant="outline"
            >
              Zum Profil
            </Button>
          </Link>
        </div>
      </ItemActions>
      <ItemFooter className="w-full text-sm text-gray-500">
        <p>{organization.expertiseArea.join(', ')}</p>
      </ItemFooter>
    </Item>
  );
}
