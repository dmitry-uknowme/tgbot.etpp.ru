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
  tg_profile: any;

  @Column()
  subscribes: { name: string; desctiption: string; created_at: Date }[] | [];

  @Column()
  current_role: 'ORGANIZER' | 'PARTICIPANT' | null;

  @Column()
  connected_platforms: {
    name: 'COMMERCIAL' | 'FZ223' | 'MARKET';
    profile_id: string;
  }[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
