import { SignOutButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

export const UserNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Usuario no encontrado</h1>
      <p className="mt-2 text-sm">
        Correo no encontrado en la base de datos de la liga
      </p>
      <p className="mt-2 text-sm">
        Por favor, cierra sesión y vuelve a intentarlo con un correo valido
      </p>
      <SignOutButton>
        <Button className="mt-4" variant="destructive">
          Cerrar sesión
        </Button>
      </SignOutButton>
    </div>
  );
};
