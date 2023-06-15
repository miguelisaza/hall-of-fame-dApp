"use client";

import React, { useState } from "react";
import Modal from "./Modal";

type AddGameModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onGameAdded: () => void;
};

const AddGameModal: React.FC<AddGameModalProps> = ({
  isOpen,
  onClose,
  onGameAdded,
}) => {
  const [gameIdInput, setGameIdInput] = useState<string>("");
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  const handleAddGameSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setModalContent("Loading...");

    try {
      const response = await fetch("http://localhost:3001/game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameId: gameIdInput }),
      });
      const data = await response.json();

      setModalContent(
        <div>
          <h2 className="text-xl font-bold mb-4">Game Created!</h2>
          <p>
            <a
              className="text-blue-600 hover:text-blue-800"
              href={data.contract}
              target="_blank"
              rel="noopener noreferrer">
              See in Explorer
            </a>
          </p>
        </div>
      );

      onGameAdded();
    } catch (err) {
      setModalContent("Failed to create game.");
    }
  };

  const handleClose = () => {
    onClose();
    setModalContent(null);
    setGameIdInput("");
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      {!modalContent ? (
        <form onSubmit={handleAddGameSubmit}>
          <h2 className="text-xl font-bold mb-4">Add Game</h2>
          <input
            className="border border-gray-300 rounded px-2 py-1 w-full mb-4"
            type="text"
            value={gameIdInput}
            onChange={(e) => setGameIdInput(e.target.value)}
            required
          />
          <button
            className="bg-green-500 text-white rounded px-4 py-2"
            type="submit">
            Submit
          </button>
        </form>
      ) : (
        modalContent
      )}
    </Modal>
  );
};

export default AddGameModal;
