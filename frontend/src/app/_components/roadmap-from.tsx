"use client";

import z from "zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { MapIcon, Utensils } from "lucide-react";
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

const roadMapSchema = z.object({
  nome: z.string().min(2, "O nome é obrigatório."),
  area: z.enum(
    [
      "frontend",
      "backend",
      "fullstack",
      "mobile",
      "engenharia_de_software",
      "arquitetura",
      "observabilidade",
      "banco_de_dados",
      "redes",
      "design",
    ],
    {
      error: "Selecione sua área de atuação.",
    }
  ),
  duracao: z.enum(
    ["7_dias", "1_mes", "3_meses", "6_meses", "1_ano", "1_ano_meio", "2_anos"],
    {
      error: "Selecione a duração do RoadMap.",
    }
  ),
  disponibilidade_horas_semana: z
    .number()
    .int()
    .min(1, "A disponibilidade de horas é obrigatória.")
    .max(168),
  nivel_atual: z.enum(["Iniciante", "Intermediario", "Avancado"], {
    error: "Selecione seu nível.",
  }),
  idioma: z.enum(["pt-BR", "en-US"], {
    error: "Selecione o idioma que deseja.",
  }),
  foco: z.string().optional(), //ex: focar em docker, performance web, clean code...
});

type RoadMapSchemaFormData = z.infer<typeof roadMapSchema>;

interface RoadMapFormProps {
  onSubmit: (data: RoadMapSchemaFormData) => void;
}

export function RoadMapForm({ onSubmit }: RoadMapFormProps) {
  const form = useForm<RoadMapSchemaFormData>({
    resolver: zodResolver(roadMapSchema),
    defaultValues: {
      nome: "",
      area: undefined,
      duracao: undefined,
      disponibilidade_horas_semana: undefined,
      nivel_atual: undefined,
      idioma: undefined,
      foco: "",
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-0 shadow-2xl">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4 mx-auto">
              <MapIcon className="w-14 h-14 text-blue-700" />
            </div>
            <h1 className="text-3xl font-bold text-blue-700 mb-2">
              Faça seu RoadMap
            </h1>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  Dados Pessoais
                </h3>
              </div>

              {/* CAMPOS NOME E ÁREA */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Digite seu nome*" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Àrea que deseja atuar</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Selecione sua área*" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="frontend">
                            Desenvolvimento Front-End
                          </SelectItem>
                          <SelectItem value="backend">
                            Desenvolvimento Back-End
                          </SelectItem>
                          <SelectItem value="fullstack">
                            Desenvolvimento Full Stack
                          </SelectItem>
                          <SelectItem value="mobile">
                            Desenvolvimento Mobile
                          </SelectItem>
                          <SelectItem value="engenharia_de_software">
                            Engenharia de software
                          </SelectItem>
                          <SelectItem value="arquitetura">
                            Arquitetura de software
                          </SelectItem>
                          <SelectItem value="banco_de_dados">
                            Banco de dados
                          </SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="observabilidade">
                            Observabilidade
                          </SelectItem>
                          <SelectItem value="redes">Redes</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              {/* CAMPOS DURAÇÃO, DISPONIBILIDADE E NIVEL */}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="duracao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duração do seu RoadMap</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Selecione a duração*" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="7_dias">1 Semana</SelectItem>
                          <SelectItem value="1_mes">1 Mês</SelectItem>
                          <SelectItem value="3_meses">3 Meses</SelectItem>
                          <SelectItem value="6_meses">6 Meses</SelectItem>
                          <SelectItem value="1_ano">1 Ano</SelectItem>
                          <SelectItem value="1_ano_meio">
                            1 Ano e meio
                          </SelectItem>
                          <SelectItem value="2_anos">2 Anos</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="disponibilidade_horas_semana"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Disponibilidade em horas</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          {...form.register("disponibilidade_horas_semana", {
                            setValueAs: (v) =>
                              v === "" ? undefined : parseFloat(v),
                          })}
                          placeholder="Digite as horas disponíveis*"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nivel_atual"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nível atual na área</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Nível de conhecimento*" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Iniciante">Iniciante</SelectItem>
                          <SelectItem value="Intermediario">
                            Intermediário
                          </SelectItem>
                          <SelectItem value="Avancado">Avançado</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              {/* CAMPOS IDIOMA E FOCO */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="idioma"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>idioma do seu RoadMap</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Selecione o idioma*" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pt-BR">
                            Português brasileiro (PT-BR)
                          </SelectItem>
                          <SelectItem value="en-US">Inglês (EN-US)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="foco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Foco principal (opcional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Digite seu foco ex: web performance" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Button className="w-full mt-4 hover-opacity-90 cursor-pointer transition py-6">
                Gerar meu RoadMap
              </Button>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  );
}
