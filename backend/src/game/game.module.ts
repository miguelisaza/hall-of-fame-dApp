import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { Game } from './game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Game]), ConfigModule.forRoot()],
  providers: [GameService],
  controllers: [GameController],
})
export class GameModule {}
