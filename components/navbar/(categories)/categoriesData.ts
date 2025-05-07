import React from 'react';

import {
  FaBed,
  FaHome,
  FaSwimmingPool,
  FaFortAwesome,
  FaCampground,
  FaUmbrellaBeach,
  FaSkiing,
  FaMountain,
  FaDoorOpen,
  FaKey,
  FaTree,
  FaWineGlassAlt,
  FaMusic,
  FaGamepad,
} from 'react-icons/fa';
import { GiIsland } from 'react-icons/gi';
import {
  MdOutlineHouseSiding,
  MdCottage,
  MdDesignServices,
  MdWater,
} from 'react-icons/md';

interface Category {
  id: string;
  icon: React.ComponentType;
  label: string;
  description: string;
}

export const categoriesData: Category[] = [
  {
    id: 'rooms',
    icon: FaBed,
    label: 'Rooms',
    description: 'Private or shared rooms in a house, apartment, or hotel.',
  },
  {
    id: 'cabins',
    icon: FaHome,
    label: 'Cabins',
    description:
      'Rustic, self-contained dwellings, often in a natural setting.',
  },
  {
    id: 'amazing-pools',
    icon: FaSwimmingPool,
    label: 'Amazing Pools',
    description: 'Properties with exceptional swimming pools.',
  },
  {
    id: 'castles',
    icon: FaFortAwesome,
    label: 'Castles',
    description: 'Historic castles available for lodging.',
  },
  {
    id: 'camping',
    icon: FaCampground,
    label: 'Camping',
    description: 'Campsites and outdoor lodging options.',
  },
  {
    id: 'beachfront',
    icon: FaUmbrellaBeach,
    label: 'Beachfront',
    description: 'Properties located directly on a beach.',
  },
  {
    id: 'skiing',
    icon: FaSkiing,
    label: 'Skiing',
    description: 'Accommodations with easy access to skiing facilities.',
  },
  {
    id: 'tiny-homes',
    icon: MdOutlineHouseSiding,
    label: 'Tiny Homes',
    description: 'Compact and efficient living spaces.',
  },
  {
    id: 'mansions',
    icon: MdCottage,
    label: 'Mansions',
    description: 'Large, luxurious houses.',
  },
  {
    id: 'lakefront',
    icon: MdWater,
    label: 'Lakefront',
    description: 'Properties located directly on a lake.',
  },
  {
    id: 'design',
    icon: MdDesignServices,
    label: 'Design',
    description: 'Properties known for their unique or impressive design.',
  },
  {
    id: 'mountains',
    icon: FaMountain,
    label: 'Mountains',
    description: 'Lodging in mountainous regions.',
  },
  {
    id: 'tropical',
    icon: GiIsland,
    label: 'Tropical',
    description: 'Properties in tropical climates.',
  },
  {
    id: 'shared-homes',
    icon: FaDoorOpen,
    label: 'Shared Homes',
    description: 'Homes where guests share common areas.',
  },
  {
    id: 'unique-stays',
    icon: FaKey,
    label: 'Unique Stays',
    description: 'Unusual and one-of-a-kind lodging experiences.',
  },
  {
    id: 'treehouses',
    icon: FaTree,
    label: 'Treehouses',
    description: 'Accommodations built in the trees.',
  },
  {
    id: 'vineyards',
    icon: FaWineGlassAlt,
    label: 'Vineyards',
    description: 'Properties located on or near vineyards.',
  },
  {
    id: 'live-music',
    icon: FaMusic,
    label: 'Live Music',
    description:
      'Places that offer live music entertainment or are near music venues.',
  },
  {
    id: 'games',
    icon: FaGamepad,
    label: 'Games',
    description:
      'Properties with gaming facilities or are near gaming locations',
  },
];
