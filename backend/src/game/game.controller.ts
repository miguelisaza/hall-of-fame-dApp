import { Controller, Get, Post, Body } from '@nestjs/common';
import { GameService } from './game.service';
import { Game } from './game.entity';

@Controller()
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('/games')
  getGames(): Promise<Game[]> {
    return this.gameService.findAll();
  }

  @Post('/game')
  createGame(@Body() body): Promise<Record<string, string>> {
    return this.gameService.add(body.gameId);
  }
}
