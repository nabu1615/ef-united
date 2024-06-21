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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar MD3</DialogTitle>
          <DialogDescription className="py-2">
            Porfavor selecciona el rival y el resultado de los partidos.
          </DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="away_team"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="py-2">Equipo Rival</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setAwayTeam(value);
                        }}
                        disabled={matches.length > 0}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona rival" />
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

              <h5 className="text-sm font-medium border-b mb-1 my-2">
                {matchNumber()} Partido
              </h5>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="grid gap-2">
                  <FormField
                    name="home_score"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="py-2">{team?.name}</FormLabel>
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
                <div className="grid gap-2">
                  <FormField
                    name="away_score"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="py-2">
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
                      <FormLabel className="text-sm font-medium border-b pb-1 w-full block">
                        Penales
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
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
                              {awayTeam || "Equipo Rival"} Ganá por penales / No
                              pongo penales
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

              <Button
                disabled={md3Done}
                variant="action"
                type="submit"
                className="w-full my-4"
              >
                Registrar Partido
              </Button>
            </form>
          </Form>
          <div className="grid gap-2">
            <Label htmlFor="evidence">Subir imagenes</Label>
            <Input type="file" id="evidence" />
          </div>
          <Button type="submit" className="w-full" disabled>
            Guardar MD3
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMd3;
