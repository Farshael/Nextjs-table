import React from 'react';
import { FaBasketballBall, FaTrophy } from 'react-icons/fa'; // Pastikan Anda memiliki react-icons terinstal

export default function ExampleComponent() {
  const numberOfTeams = 20;  // Gantilah dengan jumlah sebenarnya jika tersedia
  const numberOfLeagues = 5; // Gantilah dengan jumlah sebenarnya jika tersedia

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-wrap items-center justify-center gap-8 p-8 w-full mt-0">
        <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 p-8 w-full max-w-md order-2 mt-4">
          <FaTrophy className="w-16 h-16 text-yellow-500 mb-4" />
          <h5 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Jumlah Liga Basket</h5>
          <div className="bg-indigo-500 text-white rounded-lg px-4 py-2 mt-4">
            <p className="text-4xl font-extrabold">{numberOfLeagues}</p>
          </div>
        </div>
        <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 p-8 w-full max-w-md order-1 mt-4">
          <FaBasketballBall className="w-16 h-16 text-orange-500 mb-4" />
          <h5 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Jumlah Tim Basket</h5>
          <div className="bg-indigo-500 text-white rounded-lg px-4 py-2 mt-4">
            <p className="text-4xl font-extrabold">{numberOfTeams}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
