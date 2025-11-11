import OpenAI from "openai";
import {
  buildSystemPrompt,
  buildUserPrompt,
  buildDocsSystemPrompt,
} from "./prompt";
import type { DietPlanRequest } from "./types";
import fs from "fs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
  timeout: 2 * 60 * 1000, // 2 minutos
  logLevel: "debug",
});

export async function* generateDietPlan(input: DietPlanRequest) {
  const diretrizes = fs.readFileSync("knowledge/diretrizes.md", "utf-8");

  const stream = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: buildSystemPrompt() },
      { role: "system", content: buildDocsSystemPrompt(diretrizes) },
      { role: "user", content: buildUserPrompt(input) },
    ],
    temperature: 0.6, // quanto maior o número, mais "criativo" ele vai tentar ser
    stream: true,
  });

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) yield delta;
  }
}

/*

> function*

  generator function, quando a função consegue "pausar" e guardar o estado interno que ela estava quando parou

> yield

  uma espécie de return que pode parar em um certo ponto e continuar retornando depois, "pausando o retorno"

> Importância do stream

  stream: false > o modelo pensa, gera tudo que tem que gerar e só devolve a resposta completa
  stream: true > o modelo pensa, gera a resposta parcialmente, e te devolve cada vez que vai adicionando novas informações

*/
