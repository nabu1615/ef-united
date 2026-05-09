"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Team = {
  name: string;
  money: string;
};

export const columns: ColumnDef<Team>[] = [
  {
    accessorKey: "name",
    header: "Nombre de equipo",
  },
  {
    accessorKey: "userName",
    header: "Nombre de usuario",
  },
  {
    accessorKey: "money",
    header: "Dinero MD3s",
  },
];
