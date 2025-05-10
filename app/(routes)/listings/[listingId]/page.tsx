'use client';
import React, { useState, useEffect } from 'react';

import { getCurrentUser } from '@/actions/getCurrentUser';
import getListingById from '@/actions/getLidtingById';
import ClientOnly from '@/components/ClientOnly';
import EmptyState from '@/components/EmptyState';

import {
  FaStar,
  FaShareSquare,
  FaRegHeart,
  FaHeart,
  FaWifi,
  FaTv,
  FaUtensils,
  FaCar,
  FaSnowflake,
  FaDog,
  FaChevronDown,
  FaChevronUp,
  FaMedal,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from 'react-icons/fa';
import ListingClient from '../ListingClient';

interface IParams {
  listingId: string;
}

// тестовые данные
const mockListingData = {
  id: '12345',
  title: 'Stunning Loft with City Views & Rooftop Terrace',
  location: 'Downtown, San Francisco, California',
  rating: 4.92,
  reviewCount: 275,
  isSuperhost: true,
  host: {
    name: 'Alex',
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    joinDate: 'Joined in May 2018',
    isSuperhost: true,
  },
  images: [
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1613553497126-a44624272024?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1600585152915-d208bec867a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1152&q=80',
  ],
  description: `
    <p>Experience the best of San Francisco in this bright and spacious loft. Enjoy stunning city views from the private rooftop terrace, perfect for morning coffee or evening cocktails.</p>
    <p><strong>The space</strong><br>This two-story loft features an open-concept living area with high ceilings, a fully equipped modern kitchen, a comfortable bedroom with a queen-size bed, and a stylish bathroom. The highlight is the expansive rooftop terrace offering panoramic views.</p>
    <p><strong>Guest access</strong><br>Guests have access to the entire loft, including the private rooftop terrace. There's also a shared gym facility in the building.</p>
  `,
  specs: {
    type: 'Entire loft',
    guests: 2,
    bedrooms: 1,
    beds: 1,
    baths: 1,
  },
  amenities: [
    { name: 'Wifi', icon: <FaWifi />, available: true },
    { name: 'Dedicated workspace', icon: <FaTv />, available: true },
    { name: 'Kitchen', icon: <FaUtensils />, available: true },
    { name: 'Free street parking', icon: <FaCar />, available: true },
    { name: 'Air conditioning', icon: <FaSnowflake />, available: true },
    { name: 'Heating', icon: <FaSnowflake />, available: true },
    { name: 'Washer', icon: <FaDog />, available: true },
    { name: 'Dryer', icon: <FaDog />, available: true },
    { name: 'TV', icon: <FaTv />, available: true },
    { name: 'No pets allowed', icon: <FaDog />, available: false },
  ],
  pricePerNight: 250,
  currency: '$',
  cleaningFee: 50,
  serviceFee: 35,
  rules: [
    'No smoking',
    'No parties or events',
    'Check-in is anytime after 3 PM',
    'Check-out by 11 AM',
  ],
  reviews: [
    {
      id: 'r1',
      author: 'Sarah K.',
      date: 'October 2023',
      rating: 5,
      text: 'Amazing place! The views are incredible and Alex was a great host.',
    },
    {
      id: 'r2',
      author: 'John B.',
      date: 'September 2023',
      rating: 4,
      text: 'Lovely loft, very clean and comfortable. A bit noisy at night due to a nearby bar, but overall a great stay.',
    },
  ],
};

const ListingPage = async ({ params: { params: IParams } }) => {
  const listing = await getListingById(params);
  const currentUser = await getCurrentUser();

  if (!listing) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ListingClient listing={listing} currentUser={currentUser} />
    </ClientOnly>
  );
};

export default ListingPage;
