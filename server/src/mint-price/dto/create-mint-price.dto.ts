import { IsNumber, IsString } from "class-validator";

export class CreateMintPriceDTO {
  @IsNumber()
  readonly mint_price: number;
}
