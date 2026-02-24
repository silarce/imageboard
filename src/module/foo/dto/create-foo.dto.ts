import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFooDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * 這是郵件描述
   * @example foo@gmail.conm
   */
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;
}
