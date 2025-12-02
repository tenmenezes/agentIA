# 🧠 Agente IA – Gerador de Roadmaps Personalizados

Projeto desenvolvido por **Yago Menezes**, integrando **Next.js**, **TypeScript**, **Zod**, **OpenAI API** e **Tailwind CSS**.
O objetivo é criar um **gerador inteligente de roadmaps personalizados**, capaz de montar rotas de estudo sob medida para cada usuário e permitir o download do relatório final em PDF.

---

# Preview do site

> O site esta atualmente hospedado como prévia na vercel como [agentIA](https://agent-ia-beta.vercel.app)

---

## 🚀 Visão Geral

O **Agente IA** é uma aplicação full-stack construída diretamente no Next.js, usando API Routes para lidar com a geração do roadmap.
Possui:

- **Backend** → servidor Node.js / API REST (antigo projeto inicial)
- **Frontend (Next.js)** → versão moderna e integrada, hospedada na **Vercel**

Atualmente, o site online é a **versão Next.js completa**, contendo a rota `/api/plan` que processa o plano alimentar e retorna o texto em **streaming Markdown**, com formatação automática e estilo.

---

## 🧩 Tecnologias Utilizadas

| Camada | Tecnologias |
|---------|--------------|
| **Frontend** | Next.js 16+, React, TypeScript, Tailwind CSS, Lucide Icons, shadcn/ui, React Markdown |
| **Backend (integrado)** | Node.js + OpenAI API |
| **Validação** | Zod |
| **Hospedagem** | Vercel (frontend) + GitHub (repositório público) |
| **Outros** | Streaming de respostas, Markdown dinâmico, estilização com Tailwind |

---

## ⚙️ Estrutura do Projeto

```bash
📦 agentIA/
    ├── backend
    │   ├── knowledge
    │   │   └── diretrizes.md
    │   ├── src
    │   │   ├── routes
    │   │   │   └── plan.ts
    │   │   ├── agent.ts
    │   │   ├── prompt.ts
    │   │   ├── server.ts
    │   │   └── types.ts
    │   ├── .gitignore
    │   ├── package-lock.json
    │   ├── package.json
    │   └── tsconfig.json
    ├── frontend
    │   ├── knowledge
    │   │   └── diretrizes.md
    │   ├── public
    │   │   ├── file.svg
    │   │   ├── globe.svg
    │   │   ├── next.svg
    │   │   ├── vercel.svg
    │   │   └── window.svg
    │   ├── src
    │   │   ├── app
    │   │   │   ├── _components
    │   │   │   │   ├── roadmap-from.tsx
    │   │   │   │   └── roadmap-generator.tsx
    │   │   │   ├── api
    │   │   │   │   └── plan
    │   │   │   │       └── route.ts
    │   │   │   ├── favicon.ico
    │   │   │   ├── globals.css
    │   │   │   ├── layout.tsx
    │   │   │   └── page.tsx
    │   │   ├── components
    │   │   │   └── ui
    │   │   │       ├── button.tsx
    │   │   │       ├── card.tsx
    │   │   │       ├── form.tsx
    │   │   │       ├── input.tsx
    │   │   │       ├── label.tsx
    │   │   │       ├── scroll-area.tsx
    │   │   │       └── select.tsx
    │   │   ├── lib
    │   │   │   └── utils.ts
    │   │   └── types
    │   │       └── roadmap-data.type.ts
    │   ├── .gitignore
    │   ├── components.json
    │   ├── next-env.d.ts
    │   ├── next.config.ts
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── postcss.config.mjs
    │   └── tsconfig.json
    └── LICENSE
```
---

## 🧠 Funcionamento da IA

A IA utiliza três funções principais que estruturam o comportamento e o tom das respostas:

## 1️⃣ buildSystemPrompt()

Define a personalidade da IA de RoadMap, incluindo regras fixas:

- Tom profissional, claro e didático;

- Sempre responde em Markdown legível;

- Usa linguagem acolhedora e profissional;

- Estrutura obrigatória do roadmap (etapas, tópicos, materiais, sugestões);

- Entregas organizadas e fáceis de seguir.

## 2️⃣ buildUserPrompt()

Constrói o contexto do usuário, usando seus dados:

- Nome, área/atuação, duração, tempo disponível, nível na área, idioma do roadmap (sim, ele gera  tanto em idiomas diferentes) e foco principal;

- Objetivo de carreira (ex.: front-end, backend, IA, segurança);

- Mantém linguagem motivacional e personalizada.

## 3️⃣ buildDocsPrompt()

Insere os arquivos de conhecimento internos do projeto (estrutura do roadmap, diretrizes, padrões).
A IA usa estes documentos para manter consistência e profundidade.

## 🧩 Rota da API (/api/plan)

A rota utiliza Next.js Route Handlers e retorna o resultado em stream, permitindo que o texto vá aparecendo gradualmente no frontend.

```
POST /api/plan
Content-Type: application/json

{
  "nome": "Yago",
  "idade": 18,
  "altura_cm": 184,
  "peso_kg": 60,
  "sexo": "masculino",
  "nivel_atividade": "sedentário",
  "objetivo": "ganho de peso saudável"
}
```
---

## 🖥️ Frontend (Componente Principal)

### O componente RoadMapGenerator.tsx faz:

- A requisição para /api/plan

- Recebe o texto em stream

- Renderiza em tempo real via ReactMarkdown

- Aplica estilos customizados (h1, h2, h3, hr)

- Faz scroll automático conforme o texto é gerado

### Botões principais:

- Gerar RoadMap → inicia/parar streaming
- Baixar PDF → Instalação do documento em pdf com markdown convertido

### Exportação em PDF:

O usuário pode baixar o roadmap completo em PDF com um clique.
O arquivo é gerado diretamente no navegador, mantendo:

- formatação Markdown convertida
- títulos e hierarquia
- listas e seções do roadmap

---

## 📜 Estilização

O texto Markdown é estilizado usando Tailwind e ReactMarkdown.
Exemplo de formatação no frontend:

```
<ReactMarkdown
  components={{
    h1: ({ ...props }) => <h1 className="text-2xl font-bold mb-1" {...props} />,
    h2: ({ ...props }) => <h2 className="text-xl font-bold text-green-700 my-1" {...props} />,
    h3: ({ ...props }) => <h3 className="text-lg font-semibold text-zinc-800 mb-1" {...props} />,
    hr: () => <hr className="my-6 border-t-2 border-green-700/40 rounded-full" />,
  }}
>
  {output}
</ReactMarkdown>
```
---

## 🌍 Deploy na Vercel
### 🔧 Passos:

Subir o projeto para o GitHub:
```
git init
git remote add origin https://github.com/tenmenezes/agentIA.git
git add .
git commit -m "Versão final do Agente IA"
git push -u origin main
```

No painel da Vercel, importar o repositório.

Em Settings → General → Root Directory, definir:
```
frontend
```
Em Environment Variables, adicionar:
```
OPENAI_API_KEY = sua_chave_aqui
```

Clicar em Deploy.

---

🧾 Exemplo de Uso

Preenchendo os dados do usuário:
```
POST /api/plan
{
  "nome": "Yago",
  "objetivo": "Desenvolvedor Front-end",
  "nivel": "iniciante",
  "horas_semanais": 10
}
```

A IA retorna em tempo real um plano alimentar semanal, com estrutura Markdown:
```
# 🌐 Roadmap de Estudo para Frontend - Yago
## Visão Geral
Neste roadmap de 7 dias, você, Yago, vai adquirir os fundamentos essenciais do desenvolvimento frontend usando tecnologias modernas. O foco é facilitar a sua compreensão da construção de sites e aplicações web, culminando em um projeto final que você poderá adicionar ao seu portfólio. A jornada inclui o aprendizado de HTML5, CSS3, JavaScript, TypeScript, React e boas práticas de desenvolvimento.

## Estrutura do Roadmap
### Semana 1: Fundamentos do Frontend
**Objetivo**: Construir uma base sólida para o desenvolvimento web.

Dia 1: Introdução à Web
**Tópicos**: O que é a Web? Estrutura de uma página web (HTML, CSS, JavaScript).
**Tarefas**: ...
...
```
## 🧩 Melhorias Futuras

- 📄 Exportar dieta em PDF diretamente do navegador - (Feito)

- 📊 Dashboard com gráficos

- 🧬 Personalização automática com histórico do usuário

- 🗓️ Ajuste automático flexível - (Feito)

---

## 👨‍💻 Autor

### Yago Menezes
### Estudante de Análise e Desenvolvimento de Sistemas

💻 GitHub – [tenmenezes](https://github.com/tenmenezes)

🌐 Portfólio – [tenmenezes.github.io](https://tenmenezes.github.io)

> “Com constância e equilíbrio, você chegará aos seus objetivos!”
