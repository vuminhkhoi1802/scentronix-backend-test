import { Test, TestingModule } from '@nestjs/testing';
import { HttpService, HttpModule } from '@nestjs/axios';
import { FindServerService } from './findServer.service';
import { Server } from '../interfaces/server.interface';
import { HttpException } from '@nestjs/common';
import MockAdapter from 'axios-mock-adapter';

describe('FindServerService', () => {
  let service: FindServerService;
  let mock: MockAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [FindServerService],
    }).compile();

    service = module.get(FindServerService);
    const httpService = module.get<HttpService>(HttpService);
    mock = new MockAdapter(httpService.axiosRef);
  });

  afterEach(() => {
    mock.restore();
  });

  const servers: Server[] = [
    { url: 'https://does-not-work.perfume.new', priority: 1 },
    { url: 'https://gitlab.com', priority: 4 },
    { url: 'http://app.scnt.me', priority: 3 },
    { url: 'https://offline.scentronix.com', priority: 2 },
  ];

  describe('checkServerStatus', () => {
    it('should return true if the server is online', async () => {
      mock.onGet('https://gitlab.com').reply(200);

      const result = await service.checkServerStatus(servers[1]);
      expect(result).toBe(true);
    });

    it('should return false if the server is offline', async () => {
      mock.onGet('https://does-not-work.perfume.new').networkError();

      const result = await service.checkServerStatus(servers[0]);
      expect(result).toBe(false);
    });

    it('should return false if the server times out', async () => {
      mock.onGet('https://does-not-work.perfume.new').timeout();

      const result = await service.checkServerStatus(servers[0]);
      expect(result).toBe(false);
    });

    it('should return false if the server responds with a non-200 status', async () => {
      mock.onGet('https://offline.scentronix.com').reply(404);

      const result = await service.checkServerStatus(servers[3]);
      expect(result).toBe(false);
    });
  });

  describe('findServer', () => {
    it('should return the online server with the lowest priority', async () => {
      mock.onGet('https://does-not-work.perfume.new').timeout();
      mock.onGet('https://gitlab.com').reply(200);
      mock.onGet('http://app.scnt.me').reply(200);
      mock.onGet('https://offline.scentronix.com').reply(404);

      const result = await service.findServer(servers);
      expect(result).toEqual({ url: 'http://app.scnt.me', priority: 3 });
    });

    it('should throw an error if no servers are online', async () => {
      mock.onGet('https://does-not-work.perfume.new').timeout();
      mock.onGet('https://gitlab.com').timeout();
      mock.onGet('http://app.scnt.me').timeout();
      mock.onGet('https://offline.scentronix.com').timeout();

      await expect(service.findServer(servers)).rejects.toThrow(HttpException);
    });
  });
});
