import { PartialType } from "@nestjs/mapped-types";
import { CreateNftDTO } from "./create-nft.dto";

export class UpdateNftDTO extends PartialType(CreateNftDTO) {}