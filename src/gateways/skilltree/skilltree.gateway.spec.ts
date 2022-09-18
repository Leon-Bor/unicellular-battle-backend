import { Test, TestingModule } from '@nestjs/testing';
import { SkilltreeGateway } from './skilltree.gateway';

describe('SkilltreeGateway', () => {
  let gateway: SkilltreeGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SkilltreeGateway],
    }).compile();

    gateway = module.get<SkilltreeGateway>(SkilltreeGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
