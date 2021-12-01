import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Auth {
  // @PrimaryGeneratedColumn()
  // id: number;

  @Column({ primary: true })
  refresh_token: string;

  @Column()
  tg_id: string;

  @Column()
  chat_id: string;

  // @CreateDateColumn({ name: 'created_at' })
  // created_at: Date;

  // @UpdateDateColumn({ name: 'updated_at' })
  // updated_at: Date;
}
