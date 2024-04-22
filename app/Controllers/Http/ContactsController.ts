import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Contacts from "App/Models/Contacts";
import ContactsValidator from "App/Validators/ContactsValidator";
export default class ContactsController {
  public async index({ response, request }: HttpContextContract) {
    const { page, limit, order, direction, name, status } = request.qs();

    const contactsQuery = Contacts.query()
      .if(name, (query) => query.where("ds_contato", "LIKE", `%${name}%`))
      .if(status, (query) => query.where("st_ativo", status))
      .if(order, (query) => query.orderBy(order, direction));

    const contacts = await contactsQuery.paginate(page, limit);

    const countQuery = Database.from("contatos")
      .select(Database.raw("SUM(st_ativo = 1) as actives"))
      .select(Database.raw("SUM(st_ativo = 0) as inactives"))
      .select(Database.raw("COUNT(*) as total"))
      .first();

    const countResults = await countQuery;

    // Montando a resposta com os contatos paginados e a contagem de ativos/inativos
    const responseData = {
      contacts: contacts.toJSON(), // Converta os resultados paginados para JSON
      activeCount: countResults.actives || 0, // Total de contatos ativos
      inactiveCount: countResults.inactives || 0, // Total de contatos inativos
      totalCount: countResults.total, // Total de contatos gerais
    };

    response.status(200).json(responseData);
  }

  public async store({ request, response }: HttpContextContract) {
    const data = await request.validate(ContactsValidator);

    const hasNameOrEmail = await Contacts.query()
      .where("ds_contato", data.dsContato)
      .orWhere("ds_email", data.dsEmail);

    if (hasNameOrEmail.length > 0) {
      response.status(400).json({ message: "Nome ou e-mail já cadastrado!" });
      return;
    }

    const contact = await Contacts.create(data);

    response.status(201).json({ message: "Contato cadastrado com sucesso!" });
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const { id } = params;

      const contato = await Contacts.query()
        .where("id", id)
        .preload("gruposcontatos", (query) => {
          query.select("ds_grupocontato");
        })
        .firstOrFail();

      return response.status(200).send(contato);
    } catch (error) {
      if (error.name === "ModelNotFoundException") {
        return response.status(400).send({ message: "Contato não encontrado" });
      }
      console.log("error", error);
      return response.status(500).send({ message: "Erro interno do servidor" });
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    const groupData = await request.validate(ContactsValidator);

    const contact = await Contacts.findOrFail(params.id);

    contact.dsContato = groupData.dsContato;
    contact.dsEmail = groupData.dsEmail;
    contact.nrCelular = groupData.nrCelular;
    contact.stAtivo = groupData.stAtivo;

    await contact.save();

    response.status(201).json({ message: "Contato editado com sucesso!" });
  }

  public async destroy({ params, response }: HttpContextContract) {
    const contact = await Contacts.findOrFail(params.id);

    await contact.delete();

    return response
      .status(204)
      .json({ message: "Contato deletado com sucesso!" });
  }

  public async status({ params, response }: HttpContextContract) {
    const contact = await Contacts.findOrFail(params.id);

    contact.stAtivo = !contact.stAtivo;

    await contact.save();

    return response.status(201).json({
      message: `Status do contato ${contact.dsContato} atualizado com sucesso!`,
    });
  }

  public async sync({ request, response }: HttpContextContract) {
    const trx = await Database.transaction();

    try {
      const { contactId, groupIds } = request.only(["contactId", "groupIds"]);

      const contact = await Contacts.findOrFail(contactId);

      await contact.load("gruposcontatos", (query) => {
        query.useTransaction(trx);
      });

      const actual = contact.gruposcontatos.map((grupo) => grupo.id);

      const addGroup = groupIds.filter((id) => !actual.includes(id));
      const removeGroups = actual.filter((id) => !groupIds.includes(id));

      await contact.related("gruposcontatos").attach(addGroup, trx);

      if (removeGroups.length > 0) {
        await contact.related("gruposcontatos").detach(removeGroups, trx);
      }

      await trx.commit();

      return response
        .status(201)
        .send({ message: "Grupos atualizados com sucesso" });
    } catch (error) {
      // Rollback da transação em caso de erro
      await trx.rollback();

      return response
        .status(500)
        .send({ error: "Erro ao atualizar grupos do contato" });
    }
  }
}
