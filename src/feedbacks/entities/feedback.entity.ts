import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

export @Entity()
class Feedback {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    text: string

    @Column({ type: 'timestamptz' })
    @CreateDateColumn()
    date: Date;

    @Column({ nullable: true })
    filename: string

    @Column({ nullable: true })
    pathOfFile: string
}