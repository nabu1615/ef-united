import { defineField, defineType } from "sanity";

export const matchType = defineType({
  name: "match",
  title: "Match",
  type: "document",
  description: "A match",
  fields: [
    defineField({
      name: "homeScore",
      title: "Home Score",
      type: "number",
      validation: (rule) => rule.required().min(0).max(99),
    }),
    defineField({
      name: "awayScore",
      title: "Away Score",
      type: "number",
      validation: (rule) => rule.required().min(0).max(99),
    }),
    defineField({
      name: "penals",
      title: "Penals",
      type: "string",
      options: {
        list: ["home", "away"],
      },
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
