import { IsDefined, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";
import { Context } from "koa";
import { Body, Controller, Ctx, Delete, Get, HttpCode, JsonController, Param, Post, Put } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import User, { UserPlan, UserStatus } from "../models/User";
import ExposeError from "../../exceptions/ExposeError";

class Child {
  @IsString()
  name: string;
}

class CreateUserBody {
  @IsNotEmpty()
  @IsDefined()
  @MinLength(5)
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  rePassword: string;

  get passwordsAreNotEqual(): boolean {
    return this.password !== this.rePassword;
  }
}

class UserResponse {
  @IsString()
  name: string;

  @IsString({ each: true })
  hobbies: string[];
}

class PaginationQuery {
  @IsNumber()
  @IsPositive()
  public limit: number;

  @IsNumber()
  @IsOptional()
  public offset?: number;
}

@OpenAPI({
  security: [{ basicAuth: [] }],
})
@JsonController("/v1")
export default class UserController {
  @Get("/users")
  @OpenAPI({ summary: "Return a list of users" })
  // @ResponseSchema(UserResponse, {isArray: true})
  public async getAll() {
    const dudes = await User.findAll();
    return dudes.values();
  }

  @Get("/users/:id")
  @OpenAPI({ summary: "Yaaa", tags: ["hmm"] })
  async getOne(@Param("id") id: number) {
    const dude = await User.findByPk(id, {
      // attributes: ['id', 'email'],
    });
    return dude;
    return {
      a: dude?.email,
      b: dude?.id,
    };
  }

  @HttpCode(201)
  @OpenAPI({ summary: "Creates a new user" })
  @Post("/users")
  async post(@Body() user: CreateUserBody, @Ctx() ctx) {
    if (user.passwordsAreNotEqual) {
      throw new ExposeError(409, "passwords are not equal");
    }

    await User.create({
      email: user.email,
      password: user.password,
      status: UserStatus.active,
      plan: UserPlan.free,
    });

    return "created";
  }

  @Put("/users/:id")
  put(@Param("id") id: number, @Ctx() ctx: Context): string {
    ctx.body = "Updating a user...";
    console.log(ctx.length);
    return "Updating a user...";
  }

  @Delete("/users/:id")
  remove(@Param("id") id: number) {
    return "Removing user...";
  }
}
