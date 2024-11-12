import { fetchPeople, fetchUserMd3s } from "@/utils/api";
import React, { Fragment } from "react";
import Md3List from "@/components/Md3List";
import { Md3, User } from "@/types/api";
import CreateMd3 from "@/components/CreateMd3";
import { getUser } from "@/server/get-user";
import { UserPoints } from "@/components/UserPoints";

const Dashboard = async () => {
  const user = await getUser();
  const { email } = user;

  const { md3s } = await fetchUserMd3s(email!);

  const md3Approved = md3s?.filter((md3: Md3) => md3.state === "approved");

  const users = (await fetchPeople()) as User[];

  if (!user) {
    return <div>Person not found</div>;
  }

  return (
    <Fragment>
      <div className="bg-slate-100 px-6 rounded-xl w-full md:w-3/4 py-8">
        <UserPoints md3Approved={md3Approved} />
        <div className="flex w-full justify-between items-center mb-10 mt-4">
          <h2 className="my-4">🎮️ MD3 Jugados y Aprobados</h2>

          {user && users && <CreateMd3 user={user} users={users} />}
        </div>

        {md3Approved &&
          md3Approved.map((md3: Md3, index: number) => {
            return <Md3List key={index} md3s={md3} />;
          })}
      </div>
    </Fragment>
  );
};

export default Dashboard;
