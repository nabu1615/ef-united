"use client";

import React, { useCallback, useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User } from "@/types/api";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Loader from "./Loader";
import { UploadFile } from "./UploadFile";
import { useToast } from "./ui/use-toast";
import { Toaster } from "./ui/toaster";
import { createMatch, createMd3 } from "@/utils/api";
import Image from "next/image";

const formErrors = {
  away_user: "Selecciona un equipo",
  home_score: "Introduce el marcador de tu equipo",
  away_score: "Introduce el marcador del rival",
};

const FormSchemaBase = z.object({
  away_user: z.string({
    required_error: "Porfavor secciona un equipo",
  }),
  home_score: z
    .string({
      required_error: formErrors.home_score,
    })
    .min(1, {
      message: formErrors.home_score,
    })
    .max(2, {
      message: "Introduce un marcador entre 0 y 99",
    }),
  away_score: z
    .string({
      required_error: formErrors.away_score,
    })
    .min(1, {
      message: formErrors.away_score,
    })
    .max(2, {
      message: "Introduce un marcador entre 0 y 99",
    }),
  penals: z.enum(["home", "away"]).optional(),
});

const CreateMd3 = ({ user, users }: { user: User; users: User[] }) => {
  const [formSchema, setFormSchema] = useState(FormSchemaBase);
  // @ts-ignore
  const resolver = new zodResolver(formSchema);

  const form = useForm({
    resolver: resolver,
  });

  const filteredTeams: User[] = users.filter((t) => t._id !== user?._id);
  const [awayUser, setAwayUser] = useState({
    name: "",
    _id: "",
    userName: "",
  });
  const [matches, setMatches]: any = useState([]);
  const [homeScore, setHomeScore] = useState();
  const [awayScore, setAwayScore] = useState();
  const [showPenals, setShowPenals] = useState(false);
  const [md3Done, setMd3Done] = useState(false);
  const [showMatchForm, setShowMatchForm] = useState(false);
  const [createMd3Loader, setCreateMd3Loader] = useState(false);
  const [open, setOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState({
    id: "",
    url: "",
  });
  const { toast } = useToast();

  const penalsRequired = useCallback(() => {
    if (showPenals) {
      setFormSchema(
        // @ts-ignore
        FormSchemaBase.extend({
          penals: z.enum(["home", "away"], {
            required_error: "Porfavor selecciona el ganador por penales",
          }),
        })
      );
    } else {
      setFormSchema(FormSchemaBase);
    }
  }, [showPenals]);

  useEffect(() => {
    penalsRequired();
  }, [penalsRequired]);

  function onSubmit(data: any, event: any) {
    setMatches([...matches, data]);

    form.reset({
      ...data,
      away_score: "",
      home_score: "",
      penals: undefined,
    });

    setAwayScore(undefined);
    setHomeScore(undefined);
  }

  useEffect(() => {
    penalsRequired();
  }, [showPenals, penalsRequired]);

  useEffect(() => {
    let homeWon = 0;
    let awayWon = 0;

    if (matches.length >= 2) {
      matches.forEach((match: any) => {
        if (match.penals === "home" || match.home_score > match.away_score) {
          homeWon++;
        } else if (
          match.penals === "away" ||
          match.home_score < match.away_score
        ) {
          awayWon++;
        }
      });

      setMd3Done(homeWon !== awayWon);
    }
  }, [matches]);

  useEffect(() => {
    if (homeScore === awayScore && homeScore && awayScore) {
      setShowPenals(true);
    } else {
      setShowPenals(false);
    }
  }, [awayScore, homeScore]);

  const createMatchHandler = async (data: any[], user: User) => {
    setCreateMd3Loader(true);

    const ids = [];

    // Manejo de promesas para cada partido
    for (const match of data) {
      const newMatchObj = {
        homeUserId: user?._id,
        awayUserId: awayUser._id,
        homeScore: Number(match.home_score),
        awayScore: Number(match.away_score),
        penals: match.penals,
      };

      try {
        const response = (await createMatch(newMatchObj)) as string;
        ids.push(response);
      } catch (error) {
        console.error("Error creating match:", error);
        throw error; // Re-lanzar el error para manejarlo fuera de esta función
      }
    }

    return ids;
  };

  useEffect(() => {
    if (md3Done) {
      setShowMatchForm(false);

      if (uploadedFile.id) {
        createMatchHandler(matches, user)
          .then(async (matchesIds) => {
            // Crear el MD3
            try {
              const users = [user?._id, awayUser?._id];
              const md3Response = await createMd3(
                uploadedFile.id,
                matchesIds,
                users
              );
              console.log("MD3 creado exitosamente.");
              setCreateMd3Loader(false);
            } catch (error) {
              console.log("Error creating MD3:", error);
            }

            setMd3Done(false);
            setUploadedFile({
              id: "",
              url: "",
            });
            setOpen(false);
            setMatches([]);
            setAwayUser({
              _id: "",
              name: "",
              userName: "",
            });
            form.reset({
              home_score: "",
              away_score: "",
              penals: undefined,
              evidence: undefined,
              awayUser: undefined,
            });
            setAwayScore(undefined);
            setHomeScore(undefined);
            toast({
              title: "Md3 creado con éxito",
              description:
                "Uno de los administradores aprobara tu MD3, ¡gracias!",
              variant: "success",
            });
          })
          .catch((error) => {
            console.error("Error creating one or more matches:", error);
          });
      }
    }
  }, [md3Done, matches, uploadedFile]);

  const matchNumber = () => {
    switch (matches.length) {
      case 0:
        return "Primer";
      case 1:
        return "Segundo";
      case 2:
        return "Tercer";
      default:
        // Handle default case if needed
        break;
    }
  };

  return (
    <React.Fragment>
      <Toaster />
      <Dialog
        open={open}
        onOpenChange={(value) => {
          setOpen(value);

          setMd3Done(false);
          setMatches([]);
          setShowMatchForm(false);
          setAwayUser({
            _id: "",
            name: "",
            userName: "",
          });

          form.reset({
            awayUser: undefined,
          });
          setAwayScore(undefined);
          setHomeScore(undefined);
        }}
      >
        <DialogTrigger asChild>
          <Button>Registrar MD3</Button>
        </DialogTrigger>
        <DialogContent className="w-[95%]">
          <DialogHeader>
            <DialogTitle className="text-left">
              📝 Registra un nuevo MD3
            </DialogTitle>
            <DialogDescription className="py-2 text-left my-4">
              Porfavor carga la imagen de tu MD3, selecciona el rival y el
              resultado de los partidos.
            </DialogDescription>

            {!createMd3Loader && !uploadedFile.url && (
              <UploadFile setUploadedFile={setUploadedFile} />
            )}
            {uploadedFile.url && (
              <div className="mt-2 mb-6">
                <h5 className="text-sm text-left font-medium mb-4 my-2">
                  Evidencia
                </h5>
                <Image
                  src={uploadedFile.url}
                  alt="evidence"
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            )}
            {uploadedFile.url && (
              <>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    {matches.length < 1 && (
                      <div className="grid gap-2">
                        <FormField
                          control={form.control}
                          name="away_user"
                          render={({ field }) => (
                            <FormItem className="my-2">
                              <FormLabel className="py-2 text-left w-full block">
                                Selecciona equipo rival
                              </FormLabel>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  const getUser = users.find(
                                    (u) => u._id === value
                                  );

                                  setAwayUser({
                                    _id: getUser?._id || "",
                                    name: getUser?.name || "",
                                    userName: getUser?.userName || "",
                                  });
                                  setShowMatchForm(true);
                                }}
                                disabled={matches.length > 0}
                                defaultValue={field.value}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un equipo" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {filteredTeams.map((t) => (
                                    <SelectItem key={t._id} value={t._id}>
                                      {t.name} - {t.userName}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    <div
                      className={`${
                        showMatchForm ? "block" : "hidden"
                      } bg-slate-200/50 my-2 rounded-md p-4`}
                    >
                      {uploadedFile.url && (
                        <>
                          <h5 className="text-sm text-left font-medium mb-1 my-2">
                            {matchNumber()} Partido
                          </h5>
                          <div className="grid form-score gap-4 mb-4 relative">
                            <div className="grid gap-1">
                              <FormField
                                name="home_score"
                                control={form.control}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="pt-2 text-left block mb-4">
                                      {user?.name}
                                      <p className="text-xs text-gray-500 my-1">
                                        {user?.userName}
                                      </p>
                                    </FormLabel>
                                    <Input
                                      type="number"
                                      id="home-score"
                                      name="home_score"
                                      value={field.value}
                                      disabled={showPenals}
                                      onChange={(e) => {
                                        const value = e.target.value;

                                        field.onChange(e);
                                        setHomeScore(value as any);
                                      }}
                                    />
                                    <FormMessage className="text-xs pb-3" />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="flex flex-col justify-center items-center relative top-7">
                              🆚
                            </div>
                            <div className="grid gap-1">
                              <FormField
                                name="away_score"
                                control={form.control}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="pt-2 text-left block mb-4 ">
                                      {awayUser.name || "Equipo Rival"}
                                      <p className="text-xs text-gray-500 my-1">
                                        {awayUser.userName}
                                      </p>
                                    </FormLabel>
                                    <Input
                                      type="number"
                                      id="away-score"
                                      name="away_score"
                                      value={field.value}
                                      disabled={showPenals}
                                      onChange={(e) => {
                                        const value = e.target.value;

                                        field.onChange(e);
                                        setAwayScore(value as any);
                                      }}
                                      min={0}
                                    />
                                    <FormMessage className="text-xs pb-3" />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                          {showPenals && (
                            <FormField
                              control={form.control}
                              name="penals"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm text-left font-medium flex mb-4">
                                    Penales
                                  </FormLabel>
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className="flex flex-col"
                                      required={awayScore === homeScore}
                                    >
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value="home" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          {user?.name} Ganá por penales / Rival
                                          no pone penales
                                        </FormLabel>
                                      </FormItem>
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value="away" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          {awayUser.name || "Equipo Rival"} Ganá
                                          por penales / No pongo penales
                                        </FormLabel>
                                      </FormItem>
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage className="text-xs pb-3" />
                                </FormItem>
                              )}
                            />
                          )}
                        </>
                      )}
                    </div>
                    <div
                      className={
                        "flex items-center" +
                        " justify-" +
                        (matches.length >= 1 ? "between" : "end")
                      }
                    >
                      {uploadedFile.url && (
                        <>
                          {matches.length >= 1 && (
                            <Button
                              className={md3Done ? " hidden" : " block"}
                              variant="destructive"
                              onClick={() => {
                                form.reset();
                                setMatches([]);
                              }}
                            >
                              Empezar de nuevo
                            </Button>
                          )}
                          <Button
                            variant="action"
                            type="submit"
                            className={md3Done ? " hidden" : " block"}
                          >
                            {matches.length >= 2
                              ? "Registrar Md3"
                              : "Siguiente Partido"}
                          </Button>
                        </>
                      )}
                    </div>
                  </form>
                </Form>
              </>
            )}

            <div className={md3Done ? "block" : "hidden"}>
              {createMd3Loader && (
                <div className="flex flex-col justify-center items-center">
                  <Loader />
                  <span className="text-sm italic my-2">Creando MD3</span>
                </div>
              )}
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default CreateMd3;
