import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoreService } from './score.service';
import { ScoreController } from './score.controller';
import { GameService } from 'src/game/game.service';
import { Game } from 'src/game/game.entity';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Game])],
  providers: [ScoreService, GameService],
  controllers: [ScoreController],
})
export class ScoreModule {}
