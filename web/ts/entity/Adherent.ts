import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";
import "reflect-metadata";

@Entity()
export class Adherent {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 30
    })
    nom: string;

    @Column({
        length: 30
    })
    prenom: string;

    @Column({
        length: 80
    })
    adresse: string;

    @Column({
        length: 50
    })
    email: string;
}