/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";

import LiteralNamingStrategy from "App/Models/ColumnStrategy/LiteralStrategy";
import { BaseModel } from "@ioc:Adonis/Lucid/Orm";

BaseModel.namingStrategy = new LiteralNamingStrategy();

Route.resource("group", "GroupController");
Route.get("groups/combo", "GroupController.comboBox")

Route.resource("contacts", "ContactsController");
Route.put("contacts/status/:id", "ContactsController.status");
Route.post("contacts/sync", "ContactsController.sync");
