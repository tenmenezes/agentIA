import z from "zod";

export const DietPlanRequestSchema = z.object({
  nome: z.string().min(2),
  idade: z.number().positive(),
  altura_cm: z.number().positive(),
  peso_kg: z.number().positive(),
  sexo: z.enum(["Masculino", "Feminino"]),
  nivel_atividade: z.enum([
    "sedentario",
    "levemente_ativo",
    "moderadamente_ativo",
    "muito_ativo",
    "extremamente_ativo",
  ]),
  objetivo: z.enum([
    "perda_de_peso",
    "ganho_de_peso_saudavel",
    "recomposicao_corporal",
    "manter_peso",
    "melhorar_performance",
  ]),
});

export type DietPlanRequest = z.infer<typeof DietPlanRequestSchema>;
