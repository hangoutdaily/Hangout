'use client';

import { use } from 'react';
import ProfileScreen from '@/app/profile/[id]/components/ProfileScreen';

export default function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ProfileScreen id={id} />;
}
