import { ApiProperty } from '@nestjs/swagger';

export class CreateMediaFileDto {
  @ApiProperty({
    example: 'e04f74f3-9061-453f-9bd2-f04e3b2e4011-image.png',
    description: 'The name of the file in the storage',
  })
  key: string;

  @ApiProperty({
    example: 'https://s3-bucket-url/e04f74f3-9061-453f-9bd2-f04e3b2e4011-image.png',
    description: 'The URL of the uploaded file',
  })
  url: string;
}
