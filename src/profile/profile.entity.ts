import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tg_chat_id: string;

  @Column()
  tg_user_id: string;

  @Column()
  tg_user_first_name: string;

  @Column()
  tg_user_username: string;

  @Column()
  platform_email: string;

  // @OneToMany(()=>Subscribe, (subscribe=>subscribe.name));
  // subscribes: string[]; /* { name: string; desctiption: string; created_at: Date }[] | []; */

  @Column()
  current_role: 'ORGANIZER' | 'PARTICIPANT';

  // @Column()
  // connected_platforms: {
  //   name: 'COMMERCIAL' | 'FZ223' | 'MARKET';
  //   profile_id: string;

  // }[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}

// tg_chat_id: string;
// tg_user_id: string;
// tg_user_first_name: string;
// tg_user_username
// platform_email: string;
// platform_password: string;
