import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { GameService } from 'src/game/game.service';
import {
  HallOfFame__factory,
  HallOfFame,
} from '../../hardhat-eth/typechain-types';

@Injectable()
export class ScoreService {
  provider: ethers.providers.Provider;
  voteTokenContract: ethers.Contract;
  contractSymbol: string;
  contractAddress: string;
  privateKey: string;
  wallet: ethers.Wallet;
  signer: ethers.Wallet;
  getContract: (address: string) => HallOfFame;

  constructor(
    private configService: ConfigService,
    private gameService: GameService,
  ) {
    const apiKey = this.configService.get<string>('INFURA_API_KEY');
    const network = this.configService.get<string>('NETWORK');
    const privateKey = this.configService.get<string>('MNEMONIC');

    this.wallet = ethers.Wallet.fromMnemonic(privateKey);
    this.provider = new ethers.providers.InfuraProvider(network, apiKey);
    this.signer = this.wallet.connect(this.provider);
    this.getContract = (address) => {
      return HallOfFame__factory.connect(address, this.signer);
    };
  }

  async _getHallOfFame(contractAddress: string) {
    const contract = this.getContract(contractAddress);

    const highScores = [];
    for (let i = 0; i < 10; i++) {
      const scoreData = await contract.highScores(i);
      highScores.push({
        playerName: ethers.utils.parseBytes32String(scoreData.playerName),
        score: scoreData.score.toNumber(),
      });
    }

    return highScores;
  }

  async _getChampion(contractAddress: string) {
    const contract = this.getContract(contractAddress);

    const [gameId, playerName, score] = await contract.getChampion();
    return {
      gameId,
      playerName: ethers.utils.parseBytes32String(playerName),
      score: score.toNumber(),
    };
  }

  async _submitScore(
    contractAddress: string,
    playerName: string,
    score: number,
  ) {
    const contract = this.getContract(contractAddress);

    if (playerName.length > 32) {
      throw new Error(
        'Player name is too long. It must be no more than 32 characters.',
      );
    }

    const contractTransaction = await contract.submitScore(
      ethers.utils.formatBytes32String(playerName),
      score,
    );

    const contractTransactionReceipt = await contractTransaction.wait();

    return {
      message: 'Score submitted successfully.',
      playerName,
      score,
      transactionHash: `https://mumbai.polygonscan.com/tx/${contractTransactionReceipt.transactionHash}`,
    };
  }

  async getHallOfFameById(gameId) {
    const { contractAddress } = await this.gameService.findOne(gameId);
    const hallOfFame = await this._getHallOfFame(contractAddress);

    return { gameId, hallOfFame };
  }

  async getHallOfFameByAddress(address) {
    const hallOfFame = await this._getHallOfFame(address);

    return { address, hallOfFame };
  }

  async getChampionById(gameId) {
    const { contractAddress } = await this.gameService.findOne(gameId);
    const champion = await this._getChampion(contractAddress);

    return { gameId, champion };
  }

  async getChampionByAddress(address) {
    const champion = await this._getChampion(address);

    return { address, champion };
  }

  async submitScoreById(gameId, playerName, score) {
    const { contractAddress } = await this.gameService.findOne(gameId);
    const result = await this._submitScore(contractAddress, playerName, score);

    return { gameId, ...result };
  }

  async submitScoreByAddress(address, playerName, score) {
    const result = await this._submitScore(address, playerName, score);

    return { address, ...result };
  }
}
