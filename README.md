# Hermes – IA para Atendimento de Chamados de Emergência 🚑🔥🚓

Hermes é um protótipo web que demonstra como **LLMs**  podem
automatizar o fluxo de registro, análise e despacho de ocorrências dos números 190 / 193,
reduzindo tempo de resposta e melhorando a qualidade dos dados capturados.  
O front-end foi construído com **Next .js 15 + React 18** e **TailwindCSS**; o back-end usa
**Genkit**, **Firebase** e ações de servidor (“server actions”) para classificar, resumir e
persistir cada chamada. :contentReference[oaicite:0]{index=0}

---

## ✨ Funcionalidades

| 🛠️ Recurso | Descrição |
| --- | --- |
| **Transcrição em tempo real** | Caixa de texto switchável entre gravação de áudio (Web Speech API) ou digitação manual. :contentReference[oaicite:1]{index=1} |
| **Classificação automática** | Fluxo `classify-call` retorna *Ocorrência* × *Incidente*, tipo de despacho e dados do chamador. :contentReference[oaicite:2]{index=2} |
| **Resumo por IA** | Fluxo `summarize-call` gera síntese concisa para revisão posterior. :contentReference[oaicite:3]{index=3} |
| **Visualização geográfica** | Integração com Google Maps via `@vis.gl/react-google-maps`. :contentReference[oaicite:4]{index=4} |
| **Persistência (mockada)** | Função `saveCallRecordToFirestore` ilustra gravação no Firestore + notificação FCM (TODO). :contentReference[oaicite:5]{index=5} |
| **UI moderna** | Componentes Radix UI, Lucide Icons e tema completamente personalizável em Tailwind. :contentReference[oaicite:6]{index=6} |

---

## 🏗️ Arquitetura em alto nível

```

Next.js 15 (App Router)
├─ src/app/page.tsx       ← UI, estado e orquestração
├─ src/app/actions.ts     ← Server Actions (Edge / Node)
│   ├─ classifyCallFlow   (AI)
│   └─ summarizeCallFlow  (AI)
└─ Firebase (opcional)
├─ Firestore          ← Histórico de chamadas
└─ FCM                ← Push “Nova Ocorrência”

````
*Todos os fluxos Genkit residem em **`src/ai/flows/`***. :contentReference[oaicite:7]{index=7}

---

## ⚙️ Requisitos

* **Node >= 20 LTS**  
* **npm >= 10** (ou pnpm/yarn)  
* **Conta Google Cloud** com chave **Gemini API**  

---

## 🚀 Instalação & execução

```bash
git clone https://github.com/munizigor/hermes_startupgov.git
cd hermes_startupgov

# Instala dependências
npm install

# Copia variáveis de ambiente e preenche suas chaves
cp .env.example .env.local
# edite NEXT_PUBLIC_GOOGLE_MAPS_API_KEY e GEMINI_API_KEY

# Ambiente de desenvolvimento (porta 9002)
npm run dev

# Build de produção
npm run build && npm start
````

Scripts disponíveis em **package.json**. ([GitHub][1])

---

## 🔐 Variáveis de ambiente

| Nome                              | Propósito                                    |
| --------------------------------- | -------------------------------------------- |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Token Google Maps JavaScript                 |
| `GEMINI_API_KEY`                  | Chave da API Google Gemini (GenAI)           |
| `NEXT_PUBLIC_WEBSOCKET_URL`       | Endpoint opcional para transcrição WebSocket |

Exemplo completo em **.env.example**. ([GitHub][2])

---

## 🗂️ Estrutura de pastas (parcial)

```
.
├─ src/
│  ├─ ai/flows/          # Flows Genkit (LLM)
│  ├─ app/               # App Router
│  │  ├─ page.tsx        # Dashboard
│  │  └─ actions.ts      # Server Actions
│  ├─ components/        # UI (Radix + shadcn)
│  └─ hooks/             # React hooks
├─ public/               # Assets estáticos
├─ tailwind.config.ts    # Design tokens / cores
└─ next.config.ts        # Configurações Next.js
```

([GitHub][3], [GitHub][4], [GitHub][5], [GitHub][6])

---

## 🛤️ Roadmap curto

1. **Ativar transcrição de áudio** via Web Speech API ou serviço cloud.
2. **Persistência real** no Firestore + Cloud Functions.
3. **Envio de push** pelo FCM para outros atendentes (broadcast).
4. Dashboards analíticos (Recharts) de SLA e tipologia de incidentes.
5. Hardening de segurança e deploy em **Firebase Hosting** ou **Vercel**.

---

## 🤝 Contribuindo

1. Abra uma *issue* descrevendo o bug ou proposta.
2. *Fork* ➜ *feature branch* ➜ *pull request*.
3. Garanta que `npm run lint && npm run typecheck` passem antes do PR.

---

## 📝 Licença

Este repositório ainda não possui arquivo de licença explícito. Sugere-se adicionar
uma licença permissiva (MIT/Apache-2.0) para facilitar contribuições.

---

## 📫 Contato

Criado por **Igor Muniz** – *[igor.muniz@exemplo.gov.br](mailto:igor.muniz@exemplo.gov.br)* • Feedbacks e PRs são bem-vindos!

```

> **Observação:** O README assume que o futuro deploy usará Firebase, mas todas as
referências a Firestore/FCM estão atualmente *mockadas* no código-fonte. Ajuste
as instruções caso a arquitetura mude.
