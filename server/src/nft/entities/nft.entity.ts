import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class NFT {
  @PrimaryGeneratedColumn()
  token_id: number;

  @Column()
  address: string;

  @Column()
  title: string;

  @Column()
  uri: string;

  @Column({ default: false })
  isMint: boolean;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, user => user.nftSources)
  user: User;
}




