import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
  tableName: "userInfo",
  timestamps: true,
})
export default class UserInfo extends Model {
  @PrimaryKey
  @Column
  userId: number;

  @Column
  firstName: string;

  @Column
  middleName: string;

  @Column
  lastName: string;

  @Column
  dateOfBirth: Date;

  @Column
  avatar: string;
}
