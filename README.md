# 🧠 Agente IA – Gerador de Planos Alimentares Personalizados

Projeto desenvolvido por **Yago Menezes**, integrando **Next.js**, **OpenAI API**, **Zod**, e **TypeScript**.  
O objetivo é criar um **assistente nutricional inteligente**, capaz de gerar **dietas semanais completas** e personalizadas conforme o perfil do usuário.

---

# Preview do site

> O site esta atualmente hospedado como prévia na vercel como [agentIA](https://agent-ia-beta.vercel.app)

---

## 🚀 Visão Geral

O **Agente IA** é um sistema composto por duas partes:

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
    │   │   │   │   ├── diet-from.tsx
    │   │   │   │   └── diet-generator.tsx
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
    │   │       └── diet-data.type.ts
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

Define a personalidade da IA Nutricionista, incluindo regras fixas:

- Gera dietas semanais com 7 dias e 4 refeições por dia;

- Sempre responde em Markdown legível;

- Usa linguagem acolhedora e profissional;

- Evita calorias, macros ou fórmulas explícitas;

- Traz variações e substituições alimentares comuns no Brasil.

## 2️⃣ buildUserPrompt()

Constrói o contexto do usuário, usando seus dados:

- Nome, idade, peso, altura, sexo, nível de atividade e objetivo;

- Adapta o plano conforme “ganho de peso”, “perda de peso” ou “manutenção”;

- Mantém linguagem motivacional e personalizada.

## 3️⃣ buildDocsPrompt()

Inclui o documento técnico de diretrizes nutricionais (diretrizes.md), usado como base científica oculta.
A IA consulta internamente esse arquivo para formular respostas coerentes, mas sem exibir dados técnicos.

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

### O componente DietGenerator.tsx faz:

- A requisição para /api/plan

- Recebe o texto em stream

- Renderiza em tempo real via ReactMarkdown

- Aplica estilos customizados (h1, h2, h3, hr)

- Faz scroll automático conforme o texto é gerado

### Botões principais:

- Gerar dieta → inicia/parar streaming

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

A IA retorna em tempo real um plano alimentar semanal, com estrutura Markdown:
```
# Plano Alimentar Semanal – Foco em Ganho de Peso Saudável

Olá Yago!  
Baseando-se no seu perfil, criamos uma dieta para auxiliar no aumento de massa magra, com alimentos naturais, proteínas de qualidade e carboidratos energéticos.

---

## 🥣 Segunda-feira
**Café da Manhã:**  
- 3 ovos mexidos  
- 2 fatias de pão integral  
- 1 banana com pasta de amendoim  

...
```
## 🧩 Melhorias Futuras

- 📄 Exportar dieta em PDF diretamente do navegador

- 📊 Dashboard com gráficos de macronutrientes

- 🧬 Personalização automática com histórico do usuário

- 🗓️ Ajuste automático conforme evolução semanal

---

## 👨‍💻 Autor

### Yago Menezes
### Estudante de Análise e Desenvolvimento de Sistemas

💻 GitHub – [tenmenezes](https://github.com/tenmenezes)

🌐 Portfólio – [tenmenezes.github.io](https://tenmenezes.github.io)

> “Com constância e equilíbrio, você chegará aos seus objetivos!”
