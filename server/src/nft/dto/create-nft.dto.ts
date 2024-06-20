import { IsString } from "class-validator";

export class CreateNftDTO {
  @IsString()
  readonly address: string;

  @IsString()
  readonly title: string;

  @IsString()
  readonly uri: string;
}
