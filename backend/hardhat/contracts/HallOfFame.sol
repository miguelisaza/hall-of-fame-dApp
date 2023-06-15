// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import '@openzeppelin/contracts/utils/Context.sol';

contract HallOfFame is Context {
    address private owner;
    bytes32 public gameId;

    struct HighScore {
        bytes32 playerName;
        uint score;
    }

    HighScore[10] public highScores;

    constructor(bytes32 _gameId) {
        gameId = _gameId;
        owner = _msgSender(); // Use OpenZeppelin's Context for msg.sender

        for (uint i = 0; i < 10; i++) {
            highScores[i] = HighScore(bytes32(0), 0);
        }
    }

    modifier onlyOwner() {
        require(_msgSender() == owner, 'Only the owner can call this function');
        _;
    }

    function transferOwnership(address newAddress) public onlyOwner {
        owner = newAddress;
    }

    function submitScore(bytes32 playerName, uint score) public onlyOwner {
        uint index = 10; // out of bounds by default
        for (uint i = 0; i < 10; i++) {
            // save the position where the score is higher than the submitted one
            if (score > highScores[i].score) {
                index = i;
                break;
            }
        }

        // if the score fits into the top 10
        if (index < 10) {
            // shift the scores to make room for the new one
            for (uint i = 9; i > index; i--) {
                highScores[i] = highScores[i - 1];
            }

            // insert the new score
            highScores[index] = HighScore(playerName, score);
        }
    }

    function getChampion() public view returns (bytes32, bytes32, uint) {
        return (gameId, highScores[0].playerName, highScores[0].score);
    }
}
