"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBasketballBall, FaTrophy } from 'react-icons/fa';

const ExampleComponent = () => {
  const [numberOfTeams, setNumberOfTeams] = useState(0);
  const [numberOfLeagues, setNumberOfLeagues] = useState(0);

  useEffect(() => {
    axios.get('https://api-basketball.p.rapidapi.com/teams', {
      headers: {
        'x-rapidapi-host': 'api-basketball.p.rapidapi.com',
        'x-rapidapi-key': '4164a9c241mshd079f20eb5a2479p1215e3jsn726445616dfe'
      },
      params: {
        league: '12',
        season: '2019-2020'
      }
    })
    .then(response => {
      setNumberOfTeams(response.data.response.length);
    })
    .catch(error => {
      console.error('Error fetching teams data:', error);
    });

    // Fetch leagues data
    axios.get('https://api-basketball.p.rapidapi.com/leagues', {
      headers: {
        'x-rapidapi-host': 'api-basketball.p.rapidapi.com',
        'x-rapidapi-key': '4164a9c241mshd079f20eb5a2479p1215e3jsn726445616dfe'
      }
    })
    .then(response => {
      setNumberOfLeagues(response.data.response.length);
    })
    .catch(error => {
      console.error('Error fetching leagues data:', error);
    });
  }, []);

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

export default ExampleComponent;
