"use client";

import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

const MyComponent = () => {
    const [leagues, setLeagues] = useState([]);
    const [selectedLeague, setSelectedLeague] = useState(null);
    const [seasons, setSeasons] = useState([]);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const seasonsCache = useRef(new Map());
    const router = useRouter();

    const instance = axios.create({
        baseURL: 'https://api-basketball.p.rapidapi.com/',
        headers: {
            'x-rapidapi-host': 'api-basketball.p.rapidapi.com',
            'x-rapidapi-key': '4164a9c241mshd079f20eb5a2479p1215e3jsn726445616dfe'
        }
    });

    useEffect(() => {
        fetchLeagues();
    }, []);

    const fetchLeagues = async () => {
        try {
            const response = await instance.get('leagues');
            console.log('Leagues Data:', response.data.response);
            setLeagues(response.data.response);
        } catch (error) {
            console.error('Error fetching leagues:', error);
            setErrorMessage('Error fetching leagues. Please try again later.');
        }
    };

    const fetchSeasons = async (leagueId, retryCount = 0) => {
        if (seasonsCache.current.has(leagueId)) {
            setSeasons(seasonsCache.current.get(leagueId));
            return;
        }

        try {
            const response = await instance.get(`leagues?id=${leagueId}`);
            console.log('League Details:', response.data.response);
            const league = response.data.response[0];
            if (league && league.seasons) {
                const fetchedSeasons = league.seasons;
                seasonsCache.current.set(leagueId, fetchedSeasons);
                setSeasons(fetchedSeasons);
            } else {
                console.log('No seasons available for the selected league.');
                setSeasons([]);
            }
        } catch (error) {
            if (error.response && error.response.status === 429 && retryCount < 3) {
                console.error('Rate limit exceeded. Retrying in 60 seconds.');
                setTimeout(() => fetchSeasons(leagueId, retryCount + 1), Math.pow(2, retryCount) * 1000);
            } else if (error.response && error.response.status === 401) {
                router.push('/login?message=' + encodeURIComponent('Anda Belum Login!'));
            } else {
                console.error('Error fetching seasons:', error);
                setErrorMessage('Error fetching seasons. Please try again later.');
            }
        }
    };

    const showLeagueDetails = (league) => {
        setSelectedLeague(league);
        fetchSeasons(league.id);
        setPopupVisible(true);
    };

    const closePopup = () => {
        setSelectedLeague(null);
        setSeasons([]);
        setPopupVisible(false);
    };

    return (
        <DefaultLayout>
            <div className="relative overflow-x-auto h-screen flex flex-col">
                {errorMessage && (
                    <div role="alert">
                        <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                            Error!
                        </div>
                        <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                            {errorMessage}
                        </div>
                    </div>
                )}

                <div className="relative overflow-x-auto shadow-md sm:rounded-lg h-full">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-800 h-full">
                        <thead className="text-xs text-gray-800 uppercase bg-gray-200 border-b border-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3 bg-gray-300">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Country
                                </th>
                                <th scope="col" className="px-6 py-3 bg-gray-300">
                                    Type
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {leagues.map((league) => (
                                <tr className="bg-gray-100 border-b border-gray-400" key={league.id}>
                                    <td className="px-6 py-4 bg-gray-200">
                                        <div className="flex items-center">
                                            <img src={league.logo} alt={league.name} className="w-6 h-6 mr-2" />
                                            {league.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {league.country.name}
                                    </td>
                                    <td className="px-6 py-4 bg-gray-200">
                                        {league.type}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                            onClick={() => showLeagueDetails(league)}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isPopupVisible && selectedLeague && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 text-white rounded-lg p-8 w-auto max-w-2xl flex flex-col">
                        <div className="flex items-center mb-4">
                            <img src={selectedLeague.logo} alt={selectedLeague.name} className="w-8 h-8 mr-2" />
                            <h2 className="text-xl font-bold">{selectedLeague.name}</h2>
                        </div>
                        <div className="flex items-center mb-4">
                            <p>{selectedLeague.country.name}</p>
                        </div>
                        <div className="mb-4">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Season</th>
                                        <th scope="col" className="px-6 py-3">Start</th>
                                        <th scope="col" className="px-6 py-3">End</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {seasons.length === 0 ? (
                                        <tr>
                                            <td className="px-6 py-4" colSpan="3">No seasons available</td>
                                        </tr>
                                    ) : (
                                        seasons.map((season, index) => (
                                            <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                                <td className="px-6 py-4">
                                                    {season.season}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {new Date(season.start).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {new Date(season.end).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <button
                            className="mt-4 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                            onClick={closePopup}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </DefaultLayout>
    );
};

export default MyComponent;
