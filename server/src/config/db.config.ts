import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MintPrice } from 'src/mint-price/entities/mint-price.entity';
import { NFT } from 'src/nft/entities/nft.entity';
import { User } from 'src/user/entities/user.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mariadb',
  host: 'localhost',
  port: 3306,
  username: 'root', 
  password: '12345678',
  database: 'upgradable',
  entities: [NFT, User, MintPrice],
  synchronize: true, // entity와 db table을 자동으로 동기화 옵션
  // 개발 환경에서만 true, 불일치 발생하면 table drop. 즉 배포 단계에서는 데이터 손실방지를 위해 false
};