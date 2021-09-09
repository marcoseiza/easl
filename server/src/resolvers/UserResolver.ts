import {
  Ctx,
  FieldResolver,
  Query,
  Resolver
} from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { User } from "../entity";
import { Context } from "../context";

@Resolver(User)
export class UserResolver {
  @InjectRepository(User)
  private readonly userRepo: Repository<User>;

  @FieldResolver()
  accessToken(@Ctx() ctx: Context): string | undefined {
    return ctx.req.session && (ctx.req.session as any).accessToken;
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: Context): Promise<any> {
    const { userId = "" } = ctx.req.session as any || {};
    return userId ? this.userRepo.findOne(userId) : null;
  }
}