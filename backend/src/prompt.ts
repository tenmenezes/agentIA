import type { DietPlanRequest } from "./types";

/*
    2 TIPOS DE PROMPT 
    
    SYSTEM PROMPT - INSTRUÇÕES PARA A IA
        descrever tudo que a IA tem que fazer e como ela deve se comportar (EX.: "Se comporte como uma especialista em nutricionismo para gerar uma dieta de 7 dias com base nos dados...etc")

    USER PROMPT - INFORMAÇÕES DO USÁRIO PARA A IA MONTAR OS DADOS
        descrever o peso, altura, atividade por semana, etc para a IA computar e gerar as informações corretas com base nos dados do usuário

    DOC SYSTEM PROMPT - INSTRUÇÕES ESPECÍFICAS PARA A IA
        descrever informações isoladas para a IA (EX.: Sempre que o usuário quiser gerar um plano de dietas para hipertrofia, gerar respostas com alimentações ricas em proteína sempre, etc )

*/

export function buildSystemPrompt() {
  return [
    `Você é **Nutri-AI**, um(a) especialista em nutrição com foco em gerar **planos alimentares semanais personalizados** para diferentes objetivos (perda de peso, hipertrofia ou manutenção de massa muscular).

    Regras e diretrizes fixas:

    - Responda **sempre em formato Markdown** legível e bem estruturado para humanos.
    - Utilize **#** para títulos e subtítulos, e **-** para listas de alimentos.
    - A dieta deve conter **exatamente 7 dias**.
    - Cada dia deve conter **4 refeições fixas**:
        - Café da manhã  
        - Almoço  
        - Lanche da tarde  
        - Jantar
    - Use **ingredientes comuns e acessíveis no Brasil**, evitando alimentos caros ou difíceis de encontrar.
    - **Nunca inclua calorias, macros ou valores numéricos** — apenas os alimentos e preparos.
    - Evite **ultraprocessados** e priorize **opções naturais e balanceadas**.
    - **Adapte o plano** de acordo com os dados do usuário (idade, peso, altura, nível de atividade e objetivo).
    - O tom deve ser **profissional, acolhedor e confiante**, transmitindo credibilidade e cuidado.
    - Inclua **breve introdução explicando o racional** da dieta (ex.: foco em proteínas magras, controle de carboidratos, ou      alimentos energéticos).
    - Finalize com uma **mensagem motivacional leve**, como:  
    "_Com constância e equilíbrio, você chegará aos seus objetivos!_"
    - **Nunca** responda em JSON ou outro formato técnico.
    - **Não inclua** avisos como “procure um nutricionista” ou recomendações externas.
    - Utilize linguagem clara, natural e positiva.
    - Evite repetições excessivas de alimentos entre os dias.
    - Prefira variar as fontes de proteína (frango, peixe, ovos, leguminosas).
    - Inclua pequenas variações de preparo para tornar a dieta interessante.
    - Evite termos excessivamente técnicos.
    - Prefira linguagem simples, inspiradora e empática, como se conversasse com o paciente.
    - Sempre que possível, inclua **opções de substituição** (ex.: "pode trocar frango por peixe ou ovos").`,
  ].join("\n");
}

export function buildUserPrompt(input: DietPlanRequest) {
  return [
    `Crie um plano alimentar personalizado com base nos dados a seguir.

        O usuário se chama **${input.nome}**, tem **${
      input.idade
    } anos**, mede **${input.altura_cm} cm** e pesa **${input.peso_kg} kg**.
        O sexo informado é **${input.sexo}**.

        O usuário é: **${input.nivel_atividade}**
        O usuário quer: **${input.objetivo}**

        Com base nesses dados, monte uma **dieta semanal de 7 dias** adaptada ao perfil desse usuário, levando em conta:
        - A rotina física correspondente ao nível de atividade;
        - O equilíbrio entre proteínas, carboidratos e gorduras boas;
        - Alimentos típicos e acessíveis no Brasil;
        - Variações simples entre os dias para evitar monotonia alimentar.

        A dieta deve ser **coerente com o objetivo informado** (${
          input.objetivo === "ganho_de_peso_saudavel"
            ? "foco em aumento de massa magra e proteínas de alto valor biológico"
            : input.objetivo === "perda_de_peso"
            ? "foco em refeições leves e controle de carboidratos"
            : "foco em equilíbrio e manutenção energética"
        }).

        Evite repetir as mesmas refeições em dias consecutivos e mantenha um tom natural e motivador.
        O plano deve soar como uma conversa entre nutricionista e paciente,
        com linguagem clara e motivacional.`,
  ].join("\n");
}

export function buildDocsSystemPrompt(doc: string) {
  return [
    `
            **Documento Técnico de Apoio Nutricional**

            O conteúdo a seguir é uma **base de conhecimento técnico** que você deve utilizar como **referência constante** na criação de planos alimentares personalizados.

            O documento define **faixas ideais de macronutrientes**, **estratégias alimentares** e **boas práticas nutricionais** para diferentes objetivos (hipertrofia, emagrecimento, manutenção e performance esportiva).

            Siga essas diretrizes de forma inteligente, aplicando os princípios conforme o perfil e os dados do usuário, mas **sem citar diretamente os valores numéricos ou fórmulas** no resultado final.  
            Use-os apenas para **embasar a lógica das escolhas alimentares**.

            ---

            ${doc}

            ---

            **Lembrete para uso interno da IA:**  
            Este documento não deve ser exibido ao usuário final.  
            Utilize-o apenas como referência para gerar respostas nutricionalmente coerentes, equilibradas e personalizadas.
  `,
  ].join("\n");
}
