import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConnectGateway } from './gateways/connect/connect.gateway';
import { GameGateway } from './gateways/game/game.gateway';
import { QueueGateway } from './gateways/queue/queue.gateway';
import { SettingsGateway } from './gateways/settings/settings.gateway';
import { SkilltreeGateway } from './gateways/skilltree/skilltree.gateway';
import { GameService } from './services/game/game.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    GameService,

    //Gateways
    ConnectGateway,
    GameGateway,
    QueueGateway,
    SettingsGateway,
    SkilltreeGateway,
  ],
})
export class AppModule {}
