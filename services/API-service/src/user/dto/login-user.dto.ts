import { IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiModelProperty({ example: 'dunant@redcross.nl' })
  @IsNotEmpty()
  public readonly email: string;

  @ApiModelProperty({ example: 'password' })
  @IsNotEmpty()
  public readonly password: string;
}
