"use client";

import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

const MyComponent = () => {
    const [teams, setTeams] = useState([]);
    const [error, setError] = useState('');
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [teamStats, setTeamStats] = useState(null);
    const teamStatsCache = useRef(new Map());
    const router = useRouter();

    const instance = axios.create({
        baseURL: 'https://api-basketball.p.rapidapi.com/',
        headers: {
            'x-rapidapi-host': 'api-basketball.p.rapidapi.com',
            'x-rapidapi-key': '4164a9c241mshd079f20eb5a2479p1215e3jsn726445616dfe'
        }
    });

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const res = await instance.get('teams?league=12&season=2019-2020');
            setTeams(res.data.response);
            console.log('Teams fetched:', res.data.response);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                router.push('/login?message=' + encodeURIComponent('Anda Belum Login!'));
            } else {
                setError('Terjadi kesalahan saat memuat daftar tim.');
            }
        }
    };

    const fetchTeamStats = async (teamId, retryCount = 0) => {
        if (teamStatsCache.current.has(teamId)) {
            setTeamStats(teamStatsCache.current.get(teamId));
            return;
        }

        try {
            const res = await instance.get(`statistics?season=2019-2020&league=12&team=${teamId}`);
            console.log('API Response:', res.data);
            if (res.data.errors && res.data.errors.season) {
                console.error('Error:', res.data.errors.season);
                setTeamStats(null);
            } else if (res.data.response) {
                console.log('Team statistics:', res.data.response);
                const stats = res.data.response;
                teamStatsCache.current.set(teamId, stats);
                setTeamStats(stats);
            } else {
                console.log('No statistics available for the selected team.');
                setTeamStats(null);
            }
        } catch (err) {
            if (err.response && err.response.status === 429 && retryCount < 3) {
                setTimeout(() => {
                    fetchTeamStats(teamId, retryCount + 1);
                }, Math.pow(2, retryCount) * 1000);
            } else {
                console.error('Error fetching team statistics:', err);
                setTeamStats(null);
            }
        }
    };

    const showTeamDetails = (team) => {
        setSelectedTeam(team);
        console.log('Selected team:', team);
        fetchTeamStats(team.id);
    };

    const closePopup = () => {
        setSelectedTeam(null);
        setTeamStats(null);
    };

    return (
        <DefaultLayout>
            <div className="relative overflow-x-auto h-screen flex flex-col">
                {error && (
                    <div role="alert">
                        <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                            Error!
                        </div>
                        <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                            {error}
                        </div>
                    </div>
                )}

                <div className="relative overflow-x-auto shadow-md sm:rounded-lg h-full">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-800 h-full">
                        <thead className="text-xs text-gray-800 uppercase bg-gray-200 border-b border-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3 bg-gray-300">
                                    No
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Country
                                </th>
                                <th scope="col" className="px-6 py-3 bg-gray-300">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {teams.map((team, index) => (
                                <tr className="bg-gray-100 border-b border-gray-400" key={team.id}>
                                    <th scope="row" className="px-6 py-4 font-medium bg-gray-200 text-gray-800 whitespace-nowrap">
                                        {index + 1}
                                    </th>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <img src={team.country.flag} alt={team.country.name} className="w-6 h-4 mr-2" />
                                            {team.country.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 bg-gray-200">
                                        <div className="flex items-center">
                                            <img src={team.logo} alt={team.name} className="w-6 h-6 mr-2" />
                                            {team.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 bg-gray-200">
                                        <button
                                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                            onClick={() => showTeamDetails(team)}
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

            {selectedTeam && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 text-white rounded-lg p-8 w-80">
                        <div className="flex items-center mb-4">
                            <img src={selectedTeam.logo} alt={selectedTeam.name} className="w-8 h-8 mr-2" />
                            <h2 className="text-xl font-bold">{selectedTeam.name}</h2>
                        </div>
                        <div className="flex items-center mb-4">
                            <img src={selectedTeam.country.flag} alt={selectedTeam.country.name} className="w-6 h-4 mr-2" />
                            <p>{selectedTeam.country.name}</p>
                        </div>
                        <div className="mb-4">
                            {teamStats ? (
                                <>
                                    <p className="mb-2"><strong>League: {teamStats.league?.name || 'N/A'}</strong></p>
                                    <p className="mb-2"><strong>Season: {teamStats.league?.season || 'N/A'}</strong></p>

                                    <p className="mb-2"><strong>Wins: {teamStats.games?.wins?.all?.total || 'N/A'}</strong></p>
                                    <p className="mb-2"><strong>Losses: {teamStats.games?.loses?.all?.total || 'N/A'}</strong></p>
                                    <p className="mb-2"><strong>Draws: {teamStats.games?.draws?.all?.total || 'N/A'}</strong></p>
                                </>
                            ) : (
                                <p>No statistics available for the selected team.</p>
                            )}
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
