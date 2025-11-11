"use client";

import z from "zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Utensils } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const dietSchema = z.object({
  nome: z.string().min(2, "O nome é obrigatório."),
  idade: z.number().int().positive(),
  altura_cm: z.number().positive(),
  peso_kg: z.number().positive(),
  sexo: z.enum(["Masculino", "Feminino"], { error: "Selecione o sexo." }),
  nivel_atividade: z.enum(
    [
      "sedentario",
      "levemente_ativo",
      "moderadamente_ativo",
      "muito_ativo",
      "extremamente_ativo",
    ],
    {
      error: "Selecione o nível de atividade.",
    }
  ),
  objetivo: z.enum(
    [
      "perda_de_peso",
      "ganho_de_peso_saudavel",
      "recomposicao_corporal",
      "manter_peso",
      "melhorar_performance",
    ],
    {
      error: "Selecione o objetivo.",
    }
  ),
});

type DietSchemaFormData = z.infer<typeof dietSchema>;

interface DietFormProps {
  onSubmit: (data: DietSchemaFormData) => void;
}

export function DietForm({ onSubmit }: DietFormProps) {
  const form = useForm<DietSchemaFormData>({
    resolver: zodResolver(dietSchema),
    defaultValues: {
      nome: "",
      idade: undefined,
      altura_cm: undefined,
      peso_kg: undefined,
      sexo: undefined,
      nivel_atividade: undefined,
      objetivo: undefined,
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-0 shadow-2xl">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4 mx-auto">
              <Utensils className="w-14 h-14 text-green-700" />
            </div>
            <h1 className="text-3xl font-bold text-green-700 mb-2">
              Calcule sua Dieta
            </h1>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  Dados Pessoais
                </h3>
              </div>

              {/* CAMPOS NOME E IDADE */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Digite seu nome" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="idade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Idade</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          {...form.register("idade", {
                            setValueAs: (v) =>
                              v === "" ? undefined : Number(v),
                          })}
                          placeholder="Digite sua idade"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* CAMPOS PESO, SEXO E ALTURA */}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="peso_kg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Peso em kg</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          {...form.register("peso_kg", {
                            setValueAs: (v) =>
                              v === "" ? undefined : parseFloat(v),
                          })}
                          placeholder="Digite seu peso em kg"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="altura_cm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Altura em cm</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          {...form.register("altura_cm", {
                            setValueAs: (v) =>
                              v === "" ? undefined : parseFloat(v),
                          })}
                          placeholder="Digite sua altura em cm"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sexo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sexo</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Selecione seu sexo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Masculino">Masculino</SelectItem>
                          <SelectItem value="Feminino">Feminino</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              {/* CAMPOS NÍVEL DE ATIVIDADE E OBJETIVO */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nivel_atividade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nível de atividade</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Selecione seu nível de atividade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sedentario">Sedentário</SelectItem>
                          <SelectItem value="levemente_ativo">
                            Levemente ativo
                          </SelectItem>
                          <SelectItem value="moderadamente_ativo">
                            Moderadamente ativo
                          </SelectItem>
                          <SelectItem value="muito_ativo">
                            Muito ativo
                          </SelectItem>
                          <SelectItem value="extremamente_ativo">
                            Extremamente ativo
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="objetivo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Objetivo</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Selecione seu objetivo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="perda_de_peso">
                            Perda de peso
                          </SelectItem>
                          <SelectItem value="ganho_de_peso_saudavel">
                            Ganho de peso saudável
                          </SelectItem>
                          <SelectItem value="recomposicao_corporal">
                            Recomposição corporal
                          </SelectItem>
                          <SelectItem value="manter_peso">
                            Manter peso
                          </SelectItem>
                          <SelectItem value="melhorar_performance">
                            Melhorar performance
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              <Button className="w-full mt-4 hover-opacity-90 cursor-pointer transition py-6">
                Gerar minha dieta
              </Button>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  );
}
