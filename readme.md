# Hall of Fame dApp

This project is a full-stack application that leverages Ethereum smart contracts to manage and track high scores from different games. It's split into two main parts - a backend built with Nest.js and a frontend created with Next.js using TailwindCSS for styles.

## Backend (Nest.js)

This backend application serves as the bridge between the Ethereum smart contract and the frontend. It exposes a REST API that the frontend consumes. The backend is in charge of creating and interacting with the smart contracts on the Ethereum blockchain. It is responsible for actions such as creating a new game (which deploys a new contract), submitting scores to a game, and fetching the hall of fame (top 10 scores) for a specific game.

You can find this backend service in the `backend` folder. To start the backend service, navigate to this directory in your terminal and run the following commands:


## Frontend 

The frontend of the application provides a user interface for interacting with the smart contracts via the backend. It allows users to create new games, submit scores to these games, and view the hall of fame for each game. It communicates with the backend through the REST API to perform these tasks.

This Next.js project is in the `frontend` folder. To start the frontend application, navigate to this directory in your terminal and execute these commands:


## How to use the dApp

- Read the readme files for each subfolder and do the necessary configuration.
- Start both the backend and frontend applications as described above.
- Open the frontend application in your browser (http://localhost:3000).
- You can add a new game by clicking on the "Add Game" button.
- Once a game is added, it will appear in the table on the main page. From here, you can view its contract address, submit a new score, or view the current hall of fame.
- To submit a new score, enter a player name and score, then click the "Submit Score" button.
- To view the hall of fame for a game, click on the "Hall of Fame" button. This will display the top 10 scores for that game.