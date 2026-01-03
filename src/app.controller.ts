/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller()
export class AppController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get('health')
  async getHealth() {
    const dbState = this.connection.readyState;
    let dbStatus = 'disconnected';
    switch (dbState) {
      case 0:
        dbStatus = 'disconnected';
        break;
      case 1:
        dbStatus = 'connected';
        break;
      case 2:
        dbStatus = 'connecting';
        break;
      case 3:
        dbStatus = 'disconnecting';
        break;
    }

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        type: 'MongoDB',
        status: dbStatus,
        readyState: dbState,
      },
    };
  }
}
