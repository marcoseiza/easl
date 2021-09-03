import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class User {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Column({ type: "text", unique: true })
    username: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    name: string | null;

    @Column({ type: "text", unique: true })
    githubId: string;

    @Field()
    @Column({ type: "text" })
    pictureUrl: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    bio: string | null;

    // Not in database.
    @Field(() => String, { nullable: true })
    accessToken: string | null;
}
