"use client";
import React, { useEffect, useState } from "react";
import AddGameModal from "./components/AddGameModal";
import SubmitScoreModal from "./components/SubmitScoreModal";
import HallOfFame from "./components/HallOfFame";

type Game = {
  id: number;
  gameId: string;
  contractAddress: string;
  isActive: boolean;
};

export default function GameList() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [addGameModalOpen, setAddGameModalOpen] = useState<boolean>(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isHallOfFameModalOpen, setIsHallOfFameModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  const fetchGames = () => {
    setLoading(true);
    setError(null);

    fetch("http://localhost:3001/games")
      .then((res) => res.json())
      .then((games) => {
        setGames(games);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load game data.");
        setLoading(false);
      });
  };

  const handleAddGameClick = () => {
    setAddGameModalOpen(true);
  };

  const handleGameAdded = () => {
    fetchGames();
  };

  const handleScoreSubmitClick = (game) => {
    setSelectedGame(game);
    setIsSubmitModalOpen(true);
  };

  const handleDisplayHallOfFame = (game) => {
    setSelectedGame(game);
    setIsHallOfFameModalOpen(true);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 pt-6">
      <AddGameModal
        isOpen={addGameModalOpen}
        onClose={() => setAddGameModalOpen(false)}
        onGameAdded={handleGameAdded}
      />
      <h1 className="text-4xl my-4 text-center text-yellow-500 bg-gray-800 p-2 rounded">
        Game List!
      </h1>

      <button
        className="bg-green-500 text-white py-2 px-4 rounded mb-4 block mx-auto"
        onClick={handleAddGameClick}>
        Add Game
      </button>

      <div className="bg-gray-800 rounded p-4">
        {isLoading ? (
          <p className="text-yellow-400">Loading...</p>
        ) : (
          <table className="table-auto w-full text-yellow-400">
            <thead>
              <tr>
                <th className="px-4 py-2">Game ID</th>
                <th className="px-4 py-2">Contract Address</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr key={game.id} className="hover:bg-gray-700">
                  <td className="border px-4 py-2">{game.gameId}</td>
                  <td className="border px-4 py-2">
                    <a
                      href={`https://mumbai.polygonscan.com/address/${game.contractAddress}`}
                      target="_blank"
                      className="text-blue-500">
                      {game.contractAddress}
                    </a>
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-blue-500 text-white py-2 px-4 rounded"
                      onClick={() => handleDisplayHallOfFame(game)}>
                      Hall Of Fame
                    </button>
                    <button
                      className="ml-5 bg-green-500 text-white rounded px-4 py-2"
                      onClick={() => handleScoreSubmitClick(game)}>
                      Submit Score
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {isSubmitModalOpen && selectedGame && (
        <SubmitScoreModal
          gameId={selectedGame.gameId}
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
        />
      )}
      {isHallOfFameModalOpen && selectedGame && (
        <HallOfFame
          gameId={selectedGame.gameId}
          isOpen={isHallOfFameModalOpen}
          onClose={() => setIsHallOfFameModalOpen(false)}
        />
      )}
    </div>
  );
}
