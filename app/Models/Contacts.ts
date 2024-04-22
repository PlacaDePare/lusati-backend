import {
  BaseModel,
  ManyToMany,
  column,
  manyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import Group from "./Group";

export default class Contacts extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public dsContato: string;

  @column()
  public nrCelular: string;

  @column()
  public dsEmail: string;

  @column()
  public stAtivo: boolean;

  @manyToMany(() => Group, {
    localKey: "id",
    relatedKey: "id",
    pivotTable: "contatos_grupocontatos",
    pivotForeignKey: "contato_id",
    pivotRelatedForeignKey: "grupocontato_id",
  })
  public gruposcontatos: ManyToMany<typeof Group>;

  static get table() {
    return "contatos";
  }
}
