import { IsNotEmpty, IsNumber, IsOptional, Matches } from 'class-validator';

export class ListUserDto {
  @IsNotEmpty()
  @IsNumber()
  pageNumber: number;

  @IsNotEmpty()
  @IsNumber()
  itemsPerPage: number;
}
