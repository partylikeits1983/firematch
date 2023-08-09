import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('users') // Specify the table name here
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;


}
