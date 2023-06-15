"use client";

import React, { useState } from "react";
import Modal from "./Modal";

interface SubmitScoreModalProps {
  gameId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const SubmitScoreModal: React.FC<SubmitScoreModalProps> = ({
  gameId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [playerName, setPlayerName] = useState("");
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3001/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId,
          playerName,
          score,
        }),
      });

      const data = await response.json();

      setTransactionHash(data.transactionHash);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {transactionHash ? (
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">
            Score submitted!
          </h2>
          <a
            href={transactionHash}
            target="_blank"
            rel="noreferrer"
            className="underline text-blue-600">
            See in explorer
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Submit a new score!
          </h2>

          <label className="block">
            <span className="text-gray-700">Player Name</span>
            <input
              type="text"
              className="border border-gray-300 rounded px-2 py-1 w-full mb-4"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Score</span>
            <input
              type="number"
              placeholder="Score"
              className="border border-gray-300 rounded px-2 py-1 w-full mb-4"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
            />
          </label>

          <div className="text-center">
            <button
              type="submit"
              className="w-1/2 px-3 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none">
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default SubmitScoreModal;
