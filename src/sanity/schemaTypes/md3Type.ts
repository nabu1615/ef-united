import { defineField, defineType } from "sanity";

export const md3Type = defineType({
  name: "md3",
  title: "MD3",
  type: "document",
  fields: [
    defineField({
      name: "evidence",
      title: "Evidencia",
      type: "image",
    }),
    defineField({
      name: "matches",
      title: "Partidos",
      type: "array",
      of: [{ type: "reference", to: [{ type: "match" }] }],
    }),
  ],

  preview: {
    select: {
      id: "_id",
    },
    prepare({ id }) {
      return {
        title: `ID: ${id}`,
      };
    },
  },
});
