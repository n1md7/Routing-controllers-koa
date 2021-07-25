import { AutoIncrement, BelongsTo, Column, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import Role from "./Role";
import UserInfo from "./UserInfo";

export enum UserPlan {
  free = "free",
  premium = "premium",
}

export enum UserStatus {
  active = "active",
  disabled = "disabled",
  blocked = "blocked",
}

export interface UserCreateAttributes {
  email: string;
  password: string;
  status: UserStatus;
  plan: UserPlan;
}

export interface UserAttributes extends UserCreateAttributes {
  id: number;
  roles?: Role[];
  userInfo?: UserInfo;
}

@Table({
  tableName: "users",
  timestamps: true,
})
export default class User extends Model<UserAttributes, UserCreateAttributes> {
  @PrimaryKey
  @ForeignKey(() => UserInfo)
  @AutoIncrement
  @Column
  id: number;

  @Column
  email: string;

  @Column
  password: string;

  @Column
  status: UserStatus;

  @Column
  plan: UserPlan;

  @HasMany(() => Role)
  roles?: Role[];

  @BelongsTo(() => UserInfo)
  userInfo?: UserInfo;
}
