import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('users') // Specify the table name here
export class User {
    @PrimaryColumn()
    user_id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    username: string;

    @Column()
    gender: string;

    @Column()
    age: number;

    @Column()
    preference: string;

    @Column()
    subscription: string;

    @Column()
    sign_up_date: number;

    @Column()
    last_active: number;

    @Column('text', { array: true, default: () => 'ARRAY[]' })
    photo_ids: string[];

    @Column('text', { array: true, default: () => 'ARRAY[]' })
    likes: number[];
    

    @Column()
    share_location: boolean;

    @Column('point')
    geolocation: string;

    @Column()
    bio: string;
}
