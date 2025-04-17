import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../../users/entities/user.entity';

@Entity('refresh_sessions')
export class RefreshSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  refreshTokenHash: string;

  @Column()
  fingerprint: string;

  @Column()
  expiresAt: Date;
}
