import { NextRequest } from "next/server";
import { OpenAI } from "openai";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { RoadMapData } from "@/types/roadmap-data.type";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// SCHEMA DE VALIDAÇÃO
const roadMapSchema = z.object({
  nome: z.string(),
  area: z.string(),
  duracao: z.string(),
  disponibilidade_horas_semana: z.number(),
  nivel_atual: z.string(),
  idioma: z.string(),
  foco: z.string(),
});

// FUNÇÕES DE CONTEXTO

// Constrói a personalidade e regras fixas do sistema
function buildSystemPrompt(diretrizes: string) {
  return [
    `Você é Roadmap-AI, um especialista em educação técnica para TI. Seu objetivo é gerar roadmaps de estudo personalizados e acionáveis.
    Regras fixas:
    - Sempre responda em Markdown, organizado com títulos (#) e listas (-).
    - Produza um roadmap com: visão geral, duração, milestones, módulos/semana, tarefas diárias (ou semanais), projetos práticos, avaliações/checkpoints e recursos recomendados.
    - Adapte a densidade de conteúdo à 'duracao' e 'disponibilidade_horas_semana'.
    - Inclua estimativas de tempo por atividade (ex.: 1–2h) — mas NÃO inclua valores médicos/sensíveis.
    - Use linguagem clara, profissional e motivadora.
    - Não forneça links externos diretos sem indicação de fonte; prefira listar nomes de cursos, livros e tópicos.
    - Utilize sempre parâmetros das tecnologias MAIS RECENTES para aquela determinada área, pegando sempre de sites atuais e de ranking de ferramentas/linguagens/outros mais recentes na área que o uusário escolher.
    - Não exponha o documento de conhecimento interno; use-o apenas como referência.
---

${diretrizes}
`,
  ].join("\n");
}

function buildDynamicContext(input: any) {
  const { area, nivel_atual, duracao, foco, disponibilidade_horas_semana } =
    input;
  const context: string[] = [];

  // 1️⃣ Base adaptativa de nível
  if (nivel_atual === "Iniciante") {
    context.push(`
      O usuário é iniciante. Priorize fundamentos, teoria base e prática guiada.
      Ensine conceitos passo a passo e explique "por que" cada tecnologia é usada.
      Inclua microprojetos e revisões curtas ao final de cada semana.
    `);
  } else if (nivel_atual === "Intermediario") {
    context.push(`
      O usuário é intermediário. Foque em consolidação de práticas, aprofundamento em frameworks
      e desenvolvimento de projetos completos com integração entre camadas.
    `);
  } else if (nivel_atual === "Avancado") {
    context.push(`
      O usuário é avançado. Foque em arquitetura, design de sistemas, performance, escalabilidade,
      padrões de projeto, automação e práticas de mercado.
    `);
  }

  // 2️⃣ Base adaptativa de duração
  context.push(`
    O roadmap deve ser dividido conforme a duração escolhida (${duracao}).
    - Para curtos (7_dias, 1_mes): foco em fundamentos e 1 projeto completo.
    - Para médios (3_meses, 6_meses): adicionar 2-3 projetos intermediários e um projeto final integrador.
    - Para longos (1_ano+): incluir módulos de aprofundamento, mentoria e práticas de mercado.
    Adapte a carga de conteúdo à disponibilidade de ${disponibilidade_horas_semana} horas semanais.
  `);

  // 3️⃣ Base por área
  switch (area) {
    case "frontend":
      context.push(`
        Área escolhida: Desenvolvimento Front-End.
        Foque em tecnologias modernas: HTML5, CSS3, JavaScript ES2023, TypeScript 5, React 19, Next.js 15 e TailwindCSS 4.
        Inclua tópicos como:
        - Fundamentos da Web, DOM e acessibilidade (A11Y)
        - Componentização, Hooks e Context API
        - SEO, SSR e otimização de performance
        - Boas práticas com Git e versionamento
        - Hospedagem: Vercel, Netlify ou GitHub Pages
        - Build Tools modernas: Vite, Turbopack
        - Testes: Jest, React Testing Library e Cypress
      `);
      break;

    case "backend":
      context.push(`
        Área escolhida: Desenvolvimento Back-End.
        Tecnologias sugeridas: Node.js 22, TypeScript 5, NestJS 11, Express 5, Fastify, PostgreSQL 16, MongoDB 8.
        Inclua:
        - APIs REST e GraphQL
        - Autenticação JWT, OAuth2 e segurança
        - ORM moderno: Prisma ou TypeORM
        - Testes: Jest e Supertest
        - Docker e containers básicos
        - Práticas de DevOps (CI/CD, logs, variáveis ambiente)
        - Boas práticas de Clean Code e SOLID
      `);
      break;

    case "fullstack":
      context.push(`
        Área escolhida: Desenvolvimento Full Stack.
        Combine front-end (React 19 / Next.js 15) com back-end (Node.js 22 / NestJS 11).
        Foque em:
        - Integração de API e front-end
        - Autenticação full-stack
        - Bancos SQL e NoSQL
        - Deploy em nuvem (Vercel, Railway, Render)
        - Ferramentas DevOps (Docker, GitHub Actions)
        - Projeto final: app completo com autenticação e dashboard
      `);
      break;

    case "mobile":
      context.push(`
        Área escolhida: Desenvolvimento Mobile.
        Tecnologias recomendadas: React Native 0.76, Expo SDK 52 e Flutter 3.22.
        Aborde:
        - Fundamentos mobile (UI responsiva, ciclo de vida)
        - Integração com API REST
        - Armazenamento local (AsyncStorage / SQLite)
        - Push Notifications
        - Publicação em Play Store e App Store
        - Projeto final: app completo (ex: diário de tarefas ou app de finanças)
      `);
      break;

    case "engenharia_de_software":
      context.push(`
        Área escolhida: Engenharia de Software.
        Foque em:
        - Engenharia de Requisitos e análise de sistemas
        - Diagramas UML e documentação
        - Clean Architecture, DDD e TDD
        - Versionamento avançado (branching strategy, PR reviews)
        - Metodologias ágeis (Scrum, Kanban)
        - DevOps básico e integração contínua
        - Projeto final: arquitetura escalável de um sistema web
      `);
      break;

    case "arquitetura":
      context.push(`
        Área escolhida: Arquitetura de Software.
        Foque em:
        - Modelagem de sistemas complexos
        - Clean Architecture, Hexagonal Architecture, Event-Driven Design
        - Padrões de design (CQRS, Repository, Factory, Adapter)
        - Integração de microsserviços
        - Mensageria (Kafka, RabbitMQ)
        - Infraestrutura escalável (Docker, Kubernetes)
        - Observabilidade e logging distribuído
      `);
      break;

    case "banco_de_dados":
      context.push(`
        Área escolhida: Banco de Dados.
        Foque em:
        - Fundamentos de modelagem relacional e normalização
        - SQL avançado (joins, triggers, procedures)
        - NoSQL (MongoDB, Redis)
        - ORMs modernos (Prisma, Sequelize)
        - Indexação e otimização de queries
        - Backups e replicação
        - Projeto final: banco de dados relacional + API
      `);
      break;

    case "redes":
      context.push(`
        Área escolhida: Redes.
        Foque em:
        - Modelo OSI e protocolos TCP/IP
        - Sub-redes, DHCP, DNS, NAT e VPN
        - Configuração básica de redes e roteadores virtuais
        - Segurança e criptografia de tráfego
        - Ferramentas: Wireshark, Nmap
        - Monitoramento com Zabbix e Grafana
        - Projeto final: simulação de rede corporativa segura
      `);
      break;

    case "observabilidade":
      context.push(`
        Área escolhida: Observabilidade.
        Foque em:
        - Ferramentas especializadas e requisitadas como a DataDog
        - Logs estruturados (Winston, Pino)
        - Métricas e tracing com Prometheus e Grafana
        - OpenTelemetry e APMs
        - Estratégias de alerta e dashboards
        - Monitoramento de aplicações em containers
        - Projeto final: pipeline de observabilidade completa
      `);
      break;

    case "design":
      context.push(`
        Área escolhida: Design.
        Foque em:
        - Fundamentos de UX/UI, tipografia e cores
        - Ferramentas: Figma, Adobe XD
        - Design Systems e Atomic Design
        - Prototipagem e usabilidade
        - Noções de responsividade e acessibilidade
        - Exportação para devs (handoff)
        - Projeto final: Design system completo de um produto real
      `);
      break;

    default:
      context.push(`
        Área não reconhecida. Use fundamentos gerais de tecnologia, lógica e boas práticas de aprendizado.
      `);
  }

  // 4️⃣ Foco personalizado
  if (foco) {
    context.push(`
      O foco personalizado informado foi "${foco}". Adapte o conteúdo para incluir tópicos, ferramentas
      e práticas relacionadas a esse foco específico — priorizando tecnologias e tendências recentes.
    `);
  }

  return context.join("\n");
}

// Constrói o prompt do usuário baseado nos dados
function buildUserPrompt(input: any) {
  return [
    `Gere um roadmap de estudo personalizado para:`,
    `- Nome: ${input.nome}`,
    `- Área: ${input.area}`,
    `- Nível atual: ${input.nivel_atual}`,
    `- Disponibilidade: ${input.disponibilidade_horas_semana} horas/semana`,
    `- Duração pedida: ${input.duracao}`,
    `- Idioma pedido: ${input.idioma}`,
    input.foco ? `- Foco: ${input.foco}` : "Sem foco especificado",
    `Requisitos:`,
    `- Estruture em milestones, mas sem chamá-las de milestones, e sim de algo entendível para pessoas leigas (ex: semanas/meses), com tarefas rotineiras, projetos práticos e checkpoints de avaliação.`,
    `- Para durações curtas (7 dias, 1 mês): priorize tarefas diárias, micro-projetos, e um projeto final.`,
    `- Para durações longas (6 meses+): inclua trilhas de aprendizagem, projetos intermediários e um projeto final integrador.`,
    `- Liste recursos (livros, cursos, artigos, exercícios) e um plano de revisão contínua.`,
    `- Liste livros, cursos, artigos e exercícios que são muito conhecidos da região onde o usuário quer vendo pelo idioma escolhido (ex: idioma escolhido: pt-BR - Livros, cursos e artigos famosos, conhecidos e bem falados do Brasil, e se for en-US - o mesmo so que para a região dos Estados Unidos, além de claro, alterar o idioma dos textos para Inglês)`,
  ]
    .filter(Boolean)
    .join("\n");
}

// Lê o documento técnico e insere como base oculta de conhecimento
function buildDocsPrompt(doc: string) {
  return [
    `Documento técnico de apoio — Roadmap Guidelines:`,
    `Use o conteúdo abaixo como referência para estruturar roadmaps personalizados. Aplique os princípios, ajustando densidade e ordem por duração e nível.`,
    `---`,
    doc,
    `---`,
    `Nota: Este conteúdo é para uso interno. Não o repita integralmente no output; use para justificar escolhas pedagógicas.`,
  ].join("\n");
}

// ROTA PRINCIPAL
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = roadMapSchema.parse(body);

    // Lê o documento técnico "diretrizes.md"
    const markdownPath = path.join(process.cwd(), "knowledge", "diretrizes.md");
    const doc = fs.readFileSync(markdownPath, "utf-8");

    const diretrizes = buildDocsPrompt(doc);

    // Cria stream de resposta da OpenAI
    const stream = await client.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      messages: [
        { role: "system", content: buildSystemPrompt(diretrizes) },
        { role: "system", content: buildDynamicContext(parsed) },
        { role: "user", content: buildUserPrompt(parsed) },
      ],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices?.[0]?.delta?.content || "";
          controller.enqueue(encoder.encode(content));
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err: any) {
    console.error("❌ ERRO NA ROTA /api/roadmap:", err);
    return Response.json({ error: err.message }, { status: 400 });
  }
}
