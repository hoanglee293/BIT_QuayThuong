'use client'; 

import { Suspense } from 'react';
import Lotterys from './lotterys/page';

function HomeContent() {

  return (
    <>
      <Lotterys />
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div></div>}>
      <HomeContent />
    </Suspense>
  );
}
