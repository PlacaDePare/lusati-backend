import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string | null;

  @column()
  public email: string | null;

  @column()
  password: string | null;

  @column()
  status: boolean;

  @column()
  forcePasswordReset: boolean;

  @column()
  resetPasswordToken: string | null;

  public static async verifyPassword(user: User, password: string) {
    return await Hash.verify(user.password, password)
  }

}
