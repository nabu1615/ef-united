import { getTeams } from "@/utils/api";
import React, { Fragment } from "react";
import Md3List from "@/components/Md3List";
import { Md3, Team } from "@/types/api";
import CreateMd3 from "@/components/CreateMd3";
import { getUser } from "@/server/get-user";
import { UserPoints } from "@/components/UserPoints";

const Dashboard = async () => {
  const user = await getUser();
  const md3s = user?.team?.md3S as Md3[];
  const teams = (await getTeams()) as Team[];

  if (!user) {
    return <div>Person not found</div>;
  }

  return (
    <Fragment>
      <div className="bg-slate-100 px-6 rounded-xl w-full md:w-3/4 py-8">
        <UserPoints />
        <div className="flex w-full justify-between items-center mb-10 mt-4">
          <h2 className="my-4">🎮️ MD3 Jugados y Aprobados</h2>

          {user && teams && <CreateMd3 user={user} teams={teams} />}
        </div>

        {md3s &&
          md3s.map((md3: Md3, index: number) => {
            return <Md3List key={index} md3s={md3} />;
          })}
      </div>
    </Fragment>
  );
};

export default Dashboard;
