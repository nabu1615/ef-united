import React from "react";
import { Team, columns } from "../../components/columns";
import { DataTable } from "../../components/data-table";
import { getUserMoney } from "@/utils/utils";
import { fetchTeams } from "@/utils/api";
import { Md3 } from "@/types/api";

const Money = async () => {
  const people = await fetchTeams();

  const data =
    people &&
    people.map((person: any): any => {
      const userId = person._id;
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      });

      const approvedMd3s = person?.md3s?.filter((md3: Md3) => {
        return md3.state === "approved";
      });

      const money = getUserMoney(approvedMd3s, userId);

      return {
        name: person?.name || "",
        money: formatter.format(money),
      };
    });

  const sortedData = data.sort((a: any, b: any) => {
    const moneyA = parseFloat(a.money.replace(/[$,]/g, ""));
    const moneyB = parseFloat(b.money.replace(/[$,]/g, ""));
    return moneyB - moneyA;
  });

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={sortedData || []} />
    </div>
  );
};

export default Money;
