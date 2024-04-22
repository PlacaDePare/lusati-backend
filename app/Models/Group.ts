import { DateTime } from 'luxon'
import { BaseModel, ManyToMany, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Contacts from './Contacts'

export default class Group extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public dsGrupocontato: string

  @column()
  public stAtivo: boolean

  @column.dateTime({autoCreate: true})
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Contacts, {

    pivotTable: 'contatos_grupocontatos',
    pivotForeignKey: 'grupocontato_id',
    pivotRelatedForeignKey: 'contato_id',
  })
  public contatos: ManyToMany<typeof Contacts>;

  static get table() {
    return 'grupocontatos'
  }

}
