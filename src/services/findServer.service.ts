import { Injectable, HttpException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Server } from '../interfaces/server.interface';

@Injectable()
export class FindServerService {
  private readonly logger = new Logger(FindServerService.name);

  constructor(private readonly httpService: HttpService) {}

  async checkServerStatus(server: Server): Promise<boolean> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(server.url, { timeout: 5000 }),
      );
      this.logger.log(
        `Checked server ${server.url} - Status: ${response.status}`,
      );
      return response.status >= 200 && response.status < 300;
    } catch (error) {
      this.logger.error(
        `Error checking server ${server.url}: ${error.message}`,
      );
      return false;
    }
  }

  async findServer(servers: Server[]): Promise<Server> {
    this.logger.log('Starting to find the server with the lowest priority');
    const serverStatusPromises = servers.map((server) =>
      this.checkServerStatus(server).then((isOnline) => ({ server, isOnline })),
    );

    const serverStatuses = await Promise.all(serverStatusPromises);
    const onlineServers = serverStatuses
      .filter((status) => status.isOnline)
      .map((status) => status.server);

    if (onlineServers.length === 0) {
      this.logger.warn('No servers are online');
      throw new HttpException('No servers are online', 503);
    }

    onlineServers.sort((a, b) => a.priority - b.priority);
    const selectedServer = onlineServers[0];

    this.logger.log(
      `Selected server: ${selectedServer.url} with priority ${selectedServer.priority}`,
    );
    return selectedServer;
  }
}
