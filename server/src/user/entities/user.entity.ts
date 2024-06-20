import { NFT } from "src/nft/entities/nft.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => NFT, nft => nft.address)
  nftSources: NFT[];
}




