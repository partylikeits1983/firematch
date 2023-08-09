// User.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    gender: string;

    @Column()
    preference: string;

    @Column()
    subscription: string;

    @Column()
    sign_up_date: number;

    @Column()
    last_active: number; 

    @Column()
    photo_ids: string[]; 
    
    @Column()
    likes: string[];

    @Column()
    geolocation: string;

}
