import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Profile')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tg_profile: string;

  // @OneToMany(()=>Subscribe, (subscribe=>subscribe.name));
  // subscribes: string[]; /* { name: string; desctiption: string; created_at: Date }[] | []; */

  @Column()
  current_role: 'ORGANIZER' | 'PARTICIPANT' | null;

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
