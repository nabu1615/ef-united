import { getUser } from "@/server/get-user";
import { UserButton } from "@clerk/nextjs";
import { User } from "@/components/User";
import React from "react";

const Header = async () => {
  const user = await getUser();

  return (
    <header className="flex justify-between w-full">
      <div className="w-full">
        <User user={user} />
      </div>
      <div className="w-full flex items-center justify-end">
        <span className="mr-2 text-sm font-light">Mi Perfil</span>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
};

export default Header;
