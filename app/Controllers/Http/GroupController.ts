import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Group from "App/Models/Group";
import GroupValidator from "App/Validators/GroupValidator";
export default class GroupController {
  public async index({ response }: HttpContextContract) {
    const groups = await Group.query().orderBy("id", "desc");

    response.status(200);

    return groups;
  }

  public async store({ request, response }: HttpContextContract) {
    const groupData = await request.validate(GroupValidator);

    const group = await Group.create(groupData);

    response.status(201);

    return group;
  }

  public async show({ params }: HttpContextContract) {
    const group = await Group.findOrFail(params.id);

    return group;
  }

  public async update({ params, request, response }: HttpContextContract) {
    const groupData = await request.validate(GroupValidator);

    const group = await Group.findOrFail(params.id);

    group.dsGrupocontato = groupData.dsGrupocontato;

    group.stAtivo = groupData.stAtivo;

    await group.save();

    response.status(201);

    return group;
  }

  public async destroy({ params, response }: HttpContextContract) {
    const group = await Group.findOrFail(params.id);

    await group.delete();

    return response.status(204);
  }

  public async comboBox({ response }: HttpContextContract) {
    const group = await Group.query()
      // .select(["id", "ds_grupocontato"])
      .where("st_ativo", 1)
      .orderBy("id", "desc");

    response.status(200);

    return group;
  }
}
