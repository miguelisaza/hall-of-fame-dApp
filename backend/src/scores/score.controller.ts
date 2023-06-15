import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ScoreService } from './score.service';

@Controller()
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Get('/hallOfFame/id/:gameId')
  getGameScoresById(@Param('gameId') gameId: string) {
    return this.scoreService.getHallOfFameById(gameId);
  }

  @Get('/hallOfFame/address/:address')
  getGameScoresByAddress(@Param('address') address: string) {
    return this.scoreService.getHallOfFameByAddress(address);
  }

  @Get('/champion/id/:gameId')
  getChampionById(@Param('gameId') gameId: string) {
    return this.scoreService.getChampionById(gameId);
  }

  @Get('/champion/address/:address')
  getChampionByAddress(@Param('address') address: string) {
    return this.scoreService.getChampionByAddress(address);
  }

  @Post('/score/')
  submitScoreById(@Body() { gameId, playerName, score }) {
    return this.scoreService.submitScoreById(gameId, playerName, score);
  }

  @Post('/score/address')
  submitScoreByAddress(@Body() { address, playerName, score }) {
    return this.scoreService.submitScoreByAddress(address, playerName, score);
  }
}
