import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GroupValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    dsGrupocontato: schema.string(),
    stAtivo: schema.boolean(),
  })

  public messages: CustomMessages = {}
}
