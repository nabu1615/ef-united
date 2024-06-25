"use client";

import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
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
import { Alert } from "./ui/alert";
import { DialogOverlay } from "@radix-ui/react-dialog";

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
    }),
  away_score: z
    .string({
      required_error: formErrors.away_score,
    })
    .min(1, {
      message: formErrors.away_score,
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
  const [awayTeam, setAwayTeam] = useState("");
  const [matches, setMatches]: any = useState([]);
  const [homeScore, setHomeScore] = useState();
  const [awayScore, setAwayScore] = useState();
  const [showPenals, setShowPenals] = useState(false);
  const [md3Done, setMd3Done] = useState(false);
  const [showMatchForm, setShowMatchForm] = useState(false);

  const penalsRequired = () => {
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

  useEffect(() => {
    if (md3Done) {
      setShowMatchForm(false);
    }
  }, [md3Done]);

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
    <Dialog>
      <DialogTrigger asChild>
        <Button>Registrar MD3</Button>
      </DialogTrigger>
      <DialogContent className="w-[95%]">
        <DialogHeader>
          <DialogTitle className="text-left">
            📝 Registra un nuevo MD3
          </DialogTitle>
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
                            setAwayTeam(value);
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
                              <SelectItem key={t.id} value={t.name}>
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
                            defaultValue={field.value}
                            name="home_score"
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);

                              setHomeScore(value.target.value as any);
                            }}
                            min={0}
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
                            {awayTeam || "Equipo Rival"}
                          </FormLabel>
                          <Input
                            type="number"
                            id="away-scotr"
                            defaultValue={field.value}
                            name="away_score"
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);

                              setAwayScore(value.target.value as any);
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
                                {awayTeam || "Equipo Rival"} Ganá por penales /
                                No pongo penales
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage className="text-xs pb-3" />
                      </FormItem>
                    )}
                  />
                )}
                {md3Done && (
                  <Alert variant="destructive">
                    No es necesario jugar un tercer partido
                  </Alert>
                )}
              </div>
              <div className="flex justify-end">
                <Button
                  variant="action"
                  type="submit"
                  className={"mt-4" + (md3Done ? " hidden" : " block")}
                  size="sm"
                >
                  Siguiente Partido
                </Button>
              </div>
            </form>
          </Form>
          <div className={md3Done ? "block" : "hidden"}>
            <div className="grid gap-2 bg-slate-100 mb-6 rounded-md p-4">
              <Label className="pb-3" htmlFor="evidence">
                Cargar Imagenes
              </Label>
              <Input type="file" id="evidence" />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled>
                Guardar MD3
              </Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMd3;
