import { ApiProperty } from '@nestjs/swagger';

export class Server {
  @ApiProperty({
    example: 'https://dummyUrl.com',
    description: 'The URL of the server',
  })
  url: string;

  @ApiProperty({ example: 1, description: 'The priority of the server' })
  priority: number;
}
