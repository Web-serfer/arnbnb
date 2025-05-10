import { useMemo } from 'react';
import { SafeUser, SafeListing } from '@/types';
import { Reservation } from '@prisma/client';
import { categories } from '@/components/navbar/(categories)/categories';

interface ListingClientProps {
  reservation?: Reservation[];
  listing: SafeListing & {
    user: SafeUser;
  };

  currentUser?: SafeUser | null;
}

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  currentUser,
}) => {
  const category = useMemo(() => {
    return categories;
  });
  return <div>ListingClient</div>;
};

export default ListingClient;
