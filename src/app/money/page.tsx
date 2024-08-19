import { getTeamsMD3s } from "@/utils/api";
import React from "react";
import { Team, columns } from "../../components/columns";
import { DataTable } from "../../components/data-table";
import { getUserMoney } from "@/utils/utils";

const Money = async () => {
  const teamsMd3s = await getTeamsMD3s();

  const data =
    teamsMd3s &&
    teamsMd3s.teams.map((team: any): Team => {
      const teamId = team.id;
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      });

      const money = getUserMoney(team.md3S, teamId);

      return {
        name: team.name || "",
        money: formatter.format(money),
      };
    });

  if (!teamsMd3s) {
    return <div>No se encontraron resultados</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data || []} />
    </div>
  );
};

export default Money;
