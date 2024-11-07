import { defineField, defineType } from "sanity";

export const personType = defineType({
  name: "person",
  title: "Person",
  type: "document",
  description: "A person",
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) =>
        rule
          .regex(
            /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
            {
              name: "email",
              invert: false,
            }
          )
          .error("El formato del email no es válido"),
    }),
    defineField({
      name: "name",
      title: "Nombre de Usuario",
      type: "string",
    }),
    defineField({
      name: "userName",
      title: "Usuario PSP",
      type: "string",
    }),
    defineField({
      name: "md3s",
      title: "MD3s",
      type: "array",
      of: [{ type: "reference", to: [{ type: "md3" }] }],
    }),
  ],
});
