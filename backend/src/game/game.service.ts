import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ethers } from 'ethers';
import { Game } from './game.entity';
import { ConfigService } from '@nestjs/config';
import { HallOfFame__factory } from '../../hardhat/typechain-types';

@Injectable()
export class GameService {
  provider: ethers.providers.Provider;
  voteTokenContract: ethers.Contract;
  contractSymbol: string;
  contractAddress: string;
  privateKey: string;
  wallet: ethers.Wallet;
  signer: ethers.Wallet;

  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('INFURA_API_KEY');
    const network = this.configService.get<string>('NETWORK');
    const privateKey = this.configService.get<string>('MNEMONIC');

    this.wallet = ethers.Wallet.fromMnemonic(privateKey);
    this.provider = new ethers.providers.InfuraProvider(network, apiKey);
    this.signer = this.wallet.connect(this.provider);
  }

  findAll(): Promise<Game[]> {
    return this.gameRepository.find();
  }

  findOne(gameId: string): Promise<Game | null> {
    return this.gameRepository.findOneBy({ gameId });
  }

  findOneByAddress(contractAddress: string): Promise<Game | null> {
    return this.gameRepository.findOneBy({ contractAddress });
  }

  async remove(id: number): Promise<void> {
    await this.gameRepository.delete(id);
  }

  async add(gameId: string): Promise<Record<string, string>> {
    const factory = new HallOfFame__factory(this.signer);
    const contract = await factory.deploy(
      ethers.utils.formatBytes32String(gameId),
    );

    const contractTransactionReceipt = await contract.deployTransaction.wait();

    await this.gameRepository.save({
      gameId,
      contractAddress: contract.address,
      isActive: true,
    });

    return {
      message: 'Game created',
      blockNumber: contractTransactionReceipt.blockNumber.toString(),
      contract: `https://mumbai.polygonscan.com/address/${contract.address}`,
    };
  }
}
