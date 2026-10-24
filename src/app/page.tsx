'use client';

import dynamic from 'next/dynamic';

const SpendWiseApp = dynamic(
  () => import('../components/SpendWiseApp').then((mod) => mod.SpendWiseApp),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 flex items-center justify-center bg-[#f5f5f5] dark:bg-[#0c0a09]">
        <div className="w-8 h-8 rounded-full border-2 border-black/20 dark:border-white/20 border-t-black dark:border-t-white animate-spin" />
      </div>
    ),
  }
);

export default function Page() {
  return <SpendWiseApp />;
}
