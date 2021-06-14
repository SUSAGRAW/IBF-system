import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '../../mock/repositoryMock.factory';
import { AdminAreaDataEntity } from './admin-area-data.entity';
import { AdminAreaDataService } from './admin-area-data.service';

describe('AdminAreaDataService', (): void => {
  let service: AdminAreaDataService;

  beforeEach(
    async (): Promise<void> => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          AdminAreaDataService,
          {
            provide: getRepositoryToken(AdminAreaDataEntity),
            useFactory: repositoryMockFactory,
          },
        ],
      }).compile();

      service = module.get<AdminAreaDataService>(AdminAreaDataService);
    },
  );

  it('should be defined', (): void => {
    expect(service).toBeDefined();
  });
});
