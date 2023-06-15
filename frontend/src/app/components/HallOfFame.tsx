"use client";
import React, { useEffect, useState } from "react";
import Modal from "./Modal";

interface PlayerScore {
  playerName: string;
  score: number;
}

interface HallOfFameProps {
  gameId: string;
  isOpen: boolean;
  onClose: () => void;
}

const HallOfFame: React.FC<HallOfFameProps> = ({ gameId, isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hallOfFame, setHallOfFame] = useState<PlayerScore[]>([]);

  useEffect(() => {
    const fetchHallOfFame = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3001/hallOfFame/id/${gameId}`
        );
        const data = await response.json();
        setHallOfFame(data.hallOfFame);
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    };

    fetchHallOfFame();
  }, [gameId]);

  const handleOnClose = () => {
    onClose();

    setIsLoading(true);
    setHallOfFame([]);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <div className="text-center mb-4">
        <h2 className="text-2xl font-semibold">
          {isLoading ? "Hall of Fame Loading..." : `${gameId} Hall of Fame!`}
        </h2>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">#</th>
              <th className="py-3 px-6 text-left">Player Name</th>
              <th className="py-3 px-6 text-center">Score</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {hallOfFame.map((score, index) => (
              <tr
                className="border-b border-gray-200 hover:bg-gray-100"
                key={index}>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <span className="font-medium">{index + 1}</span>
                </td>
                <td className="py-3 px-6 text-left">
                  {score.playerName || "-"}
                </td>
                <td className="py-3 px-6 text-center">{score.score || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Modal>
  );
};

export default HallOfFame;
