import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './game/game.entity';
import { GameModule } from './game/game.module';
import { ScoreModule } from './scores/score.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'rootroot',
      database: 'games',
      entities: [Game],
      synchronize: true,
    }),
    GameModule,
    ScoreModule,
  ],
})
export class AppModule {}
