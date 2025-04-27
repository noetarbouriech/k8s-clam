import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id!: number;  // Note the ! operator for definite assignment

    @Column()
    title!: string;

    @Column()
    description!: string;

    @Column({ default: false })
    completed!: boolean;
}