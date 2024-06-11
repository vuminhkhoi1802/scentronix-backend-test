// src/controllers/findServer.controller.ts

import { Controller, Get, Query, Logger } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindServerService } from '../services/findServer.service';
import { Server } from '../interfaces/server.interface';

@ApiTags('servers')
@Controller('servers')
export class FindServerController {
  private readonly logger = new Logger(FindServerController.name);

  constructor(private readonly findServerService: FindServerService) {}

  @Get('find')
  @ApiQuery({
    name: 'urls',
    type: String,
    example: 'https://example.com,https://another.com',
    description: 'Comma-separated list of server URLs',
  })
  @ApiQuery({
    name: 'priorities',
    type: String,
    example: '1,2',
    description: 'Comma-separated list of server priorities',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the online server with the lowest priority',
    type: Server,
  })
  @ApiResponse({ status: 503, description: 'No servers are online' })
  async findServer(
    @Query('urls') urls: string,
    @Query('priorities') priorities: string,
  ): Promise<Server> {
    this.logger.log('Received request to find server');
    const servers: Server[] = urls.split(',').map((url, index) => ({
      url,
      priority: Number(priorities.split(',')[index]),
    }));

    return this.findServerService.findServer(servers);
  }
}
