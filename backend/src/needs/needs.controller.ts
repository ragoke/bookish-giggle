import { Controller, Get } from '@nestjs/common';
import { NeedsService } from './needs.service';

@Controller('needs')
export class NeedsController {
  constructor(private readonly needsService: NeedsService) {}

  @Get()
  findAll() {
    return this.needsService.findAll();
  }
}
