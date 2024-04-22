import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ContactsValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    dsContato: schema.string(),
    nrCelular: schema.string(),
    dsEmail: schema.string(),
    stAtivo: schema.boolean(),
  })

  public messages: CustomMessages = {}
}



