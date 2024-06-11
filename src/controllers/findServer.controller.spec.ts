import { Test, TestingModule } from '@nestjs/testing';
import { FindServerController } from './findServer.controller';
import { FindServerService } from '../services/findServer.service';
import { Server } from '../interfaces/server.interface';
import { HttpException } from '@nestjs/common';

describe('FindServerController', () => {
  let controller: FindServerController;
  let service: FindServerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FindServerController],
      providers: [
        {
          provide: FindServerService,
          useValue: {
            findServer: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(FindServerController);
    service = module.get(FindServerService);
  });

  describe('findServer', () => {
    it('should return the server with the lowest priority', async () => {
      const mockServer: Server = { url: 'http://app.scnt.me', priority: 3 };
      const urls =
        'https://does-not-work.perfume.new,https://gitlab.com,http://app.scnt.me,https://offline.scentronix.com';
      const priorities = '1,4,3,2';

      jest.spyOn(service, 'findServer').mockResolvedValueOnce(mockServer);

      const result = await controller.findServer(urls, priorities);
      expect(result).toEqual(mockServer);
      expect(service.findServer).toHaveBeenCalledWith([
        { url: 'https://does-not-work.perfume.new', priority: 1 },
        { url: 'https://gitlab.com', priority: 4 },
        { url: 'http://app.scnt.me', priority: 3 },
        { url: 'https://offline.scentronix.com', priority: 2 },
      ]);
    });

    it('should throw an error if no servers are online', async () => {
      const urls =
        'https://does-not-work.perfume.new,https://gitlab.com,http://app.scnt.me,https://offline.scentronix.com';
      const priorities = '1,4,3,2';

      jest
        .spyOn(service, 'findServer')
        .mockRejectedValueOnce(new HttpException('No servers are online', 503));

      await expect(controller.findServer(urls, priorities)).rejects.toThrow(
        HttpException,
      );
      expect(service.findServer).toHaveBeenCalledWith([
        { url: 'https://does-not-work.perfume.new', priority: 1 },
        { url: 'https://gitlab.com', priority: 4 },
        { url: 'http://app.scnt.me', priority: 3 },
        { url: 'https://offline.scentronix.com', priority: 2 },
      ]);
    });
  });
});
