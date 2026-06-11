import { Module } from '@nestjs/common';
import { NeedsService } from './needs.service';
import { NeedsController } from './needs.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [NeedsService],
  controllers: [NeedsController]
})
export class NeedsModule {}
