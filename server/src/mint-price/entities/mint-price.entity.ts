import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class MintPrice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mint_price: number;
  
  @UpdateDateColumn()
  updated_at: Date;
}