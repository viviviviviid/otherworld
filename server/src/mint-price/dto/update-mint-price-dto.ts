import { IsNumber } from "class-validator";

export class UpdateMintPriceDTO {
  @IsNumber()
  readonly mint_price: number;
}
