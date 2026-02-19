import { Suspense } from 'react';
import OtpPageClient from './otp.client';

export const metadata = {
  title: 'Verify Email - SemiCrypto',
};

export default function OtpPage() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
      <OtpPageClient />
    </Suspense>
  );
}
