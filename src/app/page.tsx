'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import Test from '../components/TestCompoment/test';

type backendResponse = {
  message: string;
};

export default function Home() {
  // const fetchedData: backendResponse =
  //     await fetch(`${process.env.BACKEND_ROOT}test/hallo`, {
  //         method: "GET",
  //         headers: {
  //             'Content-Type': 'application/json'
  //         }
  //     }).then(res => res.json())

  const [data, setData] = useState<backendResponse>({} as backendResponse);

  useEffect(() => {
    const asyncCall = async () => {
      const data: backendResponse = await (
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ROOT}test/hallo`)
      ).json();
      setData(data);
    };
    asyncCall();
  }, []);

  return (
    <>
      <Test />
      <div>
        <p>{data.message}</p>
      </div>
      <Link href="/test2">Hier lang</Link>
    </>
  );
}
