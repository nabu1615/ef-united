import { defineField, defineType } from "sanity";

export const md3Type = defineType({
  name: "md3",
  title: "MD3",
  type: "document",
  fields: [
    defineField({
      name: "state",
      title: "Estado",
      type: "string",
      options: {
        list: [
          { title: "Pendiente", value: "pending" },
          { title: "Aprobado", value: "approved" },
          { title: "Rechazado", value: "rejected" },
        ], // Lista de opciones
        layout: "radio", // Opcional: Esto cambia el tipo de selección a botones de radio
      },
      initialValue: "pending",
    }),
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
  orderings: [
    {
      title: "Pendings first",
      name: "pending",
      by: [{ field: "state", direction: "desc" }],
    },
    {
      title: "Approved first",
      name: "approved",
      by: [{ field: "state", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      id: "_id",
      state: "state",
    },
    prepare({ id, state }) {
      const stateTitle = state + " - " + id;
      return {
        title: stateTitle,
      };
    },
  },
});
