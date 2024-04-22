
import { SnakeCaseNamingStrategy, BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class LiteralNamingStrategy extends SnakeCaseNamingStrategy {
  public serializedName(_model: typeof BaseModel, propertyName: string) {
    return propertyName; 
  }
}