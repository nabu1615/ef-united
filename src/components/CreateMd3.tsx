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
import { User, Team } from "@/types/api";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Loader from "./Loader";
import { UploadFile } from "./UploadFile";
import { useToast } from "./ui/use-toast";
import { Toaster } from "./ui/toaster";

const formErrors = {
  away_team: "Selecciona un equipo",
  home_score: "Introduce el marcador de tu equipo",
  away_score: "Introduce el marcador del rival",
};

const FormSchemaBase = z.object({
  away_team: z.string({
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

const CreateMd3 = ({ user, teams }: { user: User; teams: Team[] }) => {
  const [formSchema, setFormSchema] = useState(FormSchemaBase);
  // @ts-ignore
  const resolver = new zodResolver(formSchema);

  const form = useForm({
    resolver: resolver,
  });

  const team = user.team;
  const filteredTeams: Team[] = teams.filter((t) => t.id !== team?.id);
  const [awayTeam, setAwayTeam] = useState({
    name: "",
    id: "",
  });
  const [matches, setMatches]: any = useState([]);
  const [homeScore, setHomeScore] = useState();
  const [awayScore, setAwayScore] = useState();
  const [showPenals, setShowPenals] = useState(false);
  const [md3Done, setMd3Done] = useState(false);
  const [showMatchForm, setShowMatchForm] = useState(false);
  const [createMd3Loader, setCreateMd3Loader] = useState(false);
  const [open, setOpen] = useState(false);
  const [uploadedFileId, setUploadedFileId] = useState([]);
  const { toast } = useToast();
  const [disableScores, setDisableScores] = useState(false);

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

  const resetForm = (data?: any) => {
    if (data) {
      form.reset({
        ...data,
        away_score: "",
        home_score: "",
        penals: undefined,
      });
    } else {
      form.reset();
      setMatches([]);
    }

    setAwayScore(undefined);
    setHomeScore(undefined);
  };

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

  const getTeamName = (id: string) => {
    return teams.find((team) => team.id === id)?.name as string;
  };

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

  const createMd3 = async (matches: any, teams: any, evidence: any) => {
    const response = await fetch("/api/createMd3", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        matches,
        teams,
        evidence,
      }),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || "Error creating md3");
    }

    const responseData = await response.json();

    return responseData;
  };

  const createMatch = async (data: any[], user: { team: { id: string } }) => {
    setCreateMd3Loader(true);
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const responses = [];

    // Manejo de promesas para cada partido
    for (const match of data) {
      try {
        const response = await fetch("/api/createMatch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            homeTeamId: user.team.id,
            awayTeamId: match.away_team,
            homeScore: Number(match.home_score),
            awayScore: Number(match.away_score),
            penals: match.penals,
          }),
        });

        // Manejo de la respuesta de la solicitud
        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.error || "Error creating match");
        }

        const responseData = await response.json();

        responses.push(responseData);

        // Esperar un segundo antes de la siguiente solicitud
        await delay(100);
      } catch (error) {
        console.error("Error creating match:", error);
        throw error; // Re-lanzar el error para manejarlo fuera de esta función
      }
    }

    return responses;
  };

  useEffect(() => {
    if (md3Done) {
      setShowMatchForm(false);

      if (uploadedFileId.length > 0) {
        createMatch(matches, user)
          .then(async (responses) => {
            // Crear el MD3
            const matchesIds = responses.map((response) => {
              return {
                id: response.matchId,
              };
            });

            const teamsIds = [
              {
                id: user.team.id,
              },
              {
                id: awayTeam.id,
              },
            ];

            try {
              const md3Response = await createMd3(
                matchesIds,
                teamsIds,
                uploadedFileId
              );
              console.log("MD3 created successfully", md3Response);

              setCreateMd3Loader(false);
            } catch (error) {
              console.log("Error creating MD3:", error);
            }

            setMd3Done(false);
            setUploadedFileId([]);
            setOpen(false);
            setMatches([]);
            setAwayTeam({
              id: "",
              name: "",
            });
            form.reset();
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
  }, [md3Done, matches, uploadedFileId]);

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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Registrar MD3</Button>
        </DialogTrigger>
        <DialogContent className="w-[95%]">
          <DialogHeader>
            <DialogTitle className="text-left">
              📝 Registra un nuevo MD3
            </DialogTitle>
            <button
              onClick={() => {
                toast({
                  title: "Md3 creado con éxito",
                  description:
                    "Uno de los administradores aprobara tu MD3, ¡gracias!",
                  variant: "success",
                });
              }}
            >
              toas
            </button>
            <DialogDescription className="py-2 text-left my-4">
              Porfavor selecciona el rival y el resultado de los partidos.
            </DialogDescription>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {matches.length < 1 && (
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="away_team"
                      render={({ field }) => (
                        <FormItem className="my-3">
                          <FormLabel className="py-2 text-left w-full block">
                            Selecciona equipo rival
                          </FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              setAwayTeam({
                                id: value,
                                name: getTeamName(value),
                              });
                              setShowMatchForm(true);
                            }}
                            disabled={matches.length > 0}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="---" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {filteredTeams.map((t) => (
                                <SelectItem key={t.id} value={t.id}>
                                  {t.name}
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
                  } bg-slate-200/50 my-6 rounded-md p-4`}
                >
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
                              {team?.name}
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
                    <div className="flex flex-col justify-center items-center relative top-4">
                      🆚
                    </div>
                    <div className="grid gap-1">
                      <FormField
                        name="away_score"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="pt-2 text-left block mb-4">
                              {awayTeam.name || "Equipo Rival"}
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
                                  {team?.name} Ganá por penales / Rival no pone
                                  penales
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="away" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {awayTeam.name || "Equipo Rival"} Ganá por
                                  penales / No pongo penales
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage className="text-xs pb-3" />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                <div
                  className={
                    "flex items-center" +
                    " justify-" +
                    (matches.length >= 1 ? "between" : "end")
                  }
                >
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
                </div>
              </form>
            </Form>
            <div className={md3Done ? "block" : "hidden"}>
              {!createMd3Loader && (
                <UploadFile setUploadedFileId={setUploadedFileId} />
              )}
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
