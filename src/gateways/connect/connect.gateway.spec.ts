import { Test, TestingModule } from '@nestjs/testing';
import { ConnectGateway } from './connect.gateway';

describe('ConnectGateway', () => {
  let gateway: ConnectGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConnectGateway],
    }).compile();

    gateway = module.get<ConnectGateway>(ConnectGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
