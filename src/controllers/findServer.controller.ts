import {
  Controller,
  Post,
  Body,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindServerService } from '../services/findServer.service';
import { Server } from '../interfaces/server.interface';
import { findServerRequestBodySchema } from '../schemas/server.schema';

@ApiTags('servers')
@Controller('servers')
export class FindServerController {
  private readonly logger = new Logger(FindServerController.name);

  constructor(private readonly findServerService: FindServerService) {}

  @Post('find')
  @ApiBody({ type: [Server], description: 'Array of server objects' })
  @ApiResponse({
    status: 200,
    description: 'Returns the online server with the lowest priority',
    type: Server,
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 503, description: 'No servers are online' })
  async findServer(
    @Body() servers: Server[],
  ): Promise<Server | BadRequestException> {
    try {
      await findServerRequestBodySchema.validate(servers, {
        abortEarly: false,
      });
    } catch (errors) {
      this.logger.error('Validation failed', errors);
      throw new BadRequestException(errors.errors);
    }
    this.logger.log('Received request to find server');
    return this.findServerService.findServer(servers);
  }
}
