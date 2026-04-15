import { Controller, Get } from '@nestjs/common';
import { ClaimsService } from './claims.service';

@Controller('claims')
export class ClaimsController {
  constructor(private claimsService: ClaimsService) {}

  @Get()
  getClaims() {
    return this.claimsService.getClaims();
  }
}
