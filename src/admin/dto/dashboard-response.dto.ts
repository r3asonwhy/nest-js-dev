import { ApiProperty } from '@nestjs/swagger';

export class DashboardResponseDto {
  @ApiProperty({
    example: 150,
    description: 'Total active users with client role',
  })
  users: number;
}
