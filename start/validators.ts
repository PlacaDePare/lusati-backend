// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
// import Database from '@ioc:Adonis/Lucid/Database';
// import { schema, rules } from '@ioc:Adonis/Core/Validator';

// export const uniqueValue = (table: string, column: string) => {
//   return rules.unique({
//     async validate(value: any, { table, column }: HttpContextContract) {
//       const count = await Database.from(table).where(column, value).count('* as count');

//       return count[0].count === 0;
//     },
//     message: `The {{field}} '{{value}}' already exists in ${table}`,
//   });
// };
