'use client';

import { ProfilePage } from '@/components/profile/profile-page';

export default function ProfilePageServer() {
  return (
    <div className='mx-auto flex max-w-7xl flex-col gap-6'>
      <ProfilePage />
    </div>
  );
}
