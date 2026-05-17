# 📋 BACKLOG - GovernaCann (Dona Liamba OS) MVP

**Objetivo do MVP / Próxima Release:** Validar o fluxo de ponta a ponta da plataforma de gestão de associações medicinais canábicas. O sistema deve garantir a orquestração segura dos agentes CrewAI, integração com IoT em tempo real (MQTT), rastreabilidade imutável via Smart Wallets L2, pagamentos via PIX e controle estrito de cotas para pacientes com tratamento de erros robusto.

---

## 🏗️ Infra & Core Engine
- [x] **Setup do Monorepo:** Estruturação base (Frontend Next.js, Backend Node.js, Agentes Python).
- [x] **Database Setup:** Configuração inicial do banco de dados (Neon SQL) com esquema multi-tenant (`associationId`).
- [ ] **Gestão de Tenant e Isolamento:** Implementar validação estrita no backend Node.js (via middleware JWT) para garantir que todas as queries e mutações (Sanity CMS e Neon SQL) filtrem obrigatoriamente pelo contexto do `associationId`. *Critério de Aceite: Nenhuma query deve retornar dados de outra associação.*
- [ ] **Integração Backend/CrewAI:** Refinar o `backend/utils/agent-bridge.js` usando `child_process` para garantir chamadas assíncronas aos scripts Python, incluindo logs estruturados, tratamento de timeout e error boundaries.
- [ ] **Pipeline de Deploy:** Consolidar e testar o workflow do GitHub Actions em `.github/workflows/deploy-frontend.yml` configurado para `static export` do Next.js no GitHub Pages.
- [ ] **Otimização de Custos e Modelagem Sanity:** Implementar queries no Sanity usando um dataset único filtrado via query por `associationId` no backend para otimizar os custos com o CMS mantendo a segurança multi-tenant.

## 🖥️ Frontend & UX
- [ ] **Dashboard do Colaborador:** Desenvolver as views no Next.js para consultar a rastreabilidade dos produtos on-chain e os status em tempo real do cultivo (via métricas IoT agregadas).
- [ ] **Portal do Paciente:** Implementar a visualização do consumo da cota medicinal, histórico de pedidos via PIX e fluxo facilitado (Tirinhas de UX) na renovação de receitas.
- [ ] **Tratamento Global de Erros UI:** Criar interceptadores de erro globais e modais amigáveis no Next.js caso o backend, integrações PIX ou a camada de IA falhem.

## 🔒 Segurança & Resiliência
- [ ] **Autenticação e Smart Wallets (Privy):** Finalizar o fluxo completo com o Privy, gerando e vinculando o `privy_id` (PK) aos registros locais do Neon SQL no momento de login.
- [ ] **Rastreabilidade L2 (Audit Trail):** Automatizar a geração de wallets L2 para os colaboradores e desenvolver a função de gravar eventos críticos operacionais (ex: dispensação, auditoria, estoque) on-chain.
- [ ] **Controle Restrito de Cota:** Desenvolver a lógica no backend para travar a compra/dispensação estritamente nos limites definidos pelo laudo médico. *Critério de Aceite: Se a cota ultrapassar 1g a mais do que o prescrito, a transação no banco não deve efetivar.*
- [ ] **Segurança de PII (LGPD):** Garantir que apenas o `privy_id` circule entre os serviços (Neon e CrewAI), limitando e controlando estritamente os dados do paciente expostos às LLMs.

## 📈 Monitoramento & Analytics
- [ ] **Ingestão e Descarte de IoT (MQTT):** Configurar o broker MQTT para telemetria em tempo real. Implementar estratégia (ex: cron jobs no Node.js ou features nativas do Postgres) para agregação e expurgo automático de dados brutos antigos visando reduzir custos de storage.
- [ ] **Automação de Cultivo:** Desenvolver rotinas para enviar comandos automáticos de reversão pelo MQTT (ex: ligar o exaustor se a temperatura ou umidade ultrapassar o threshold da strain).
- [ ] **Agentes CrewAI de Monitoramento:** Desenvolver prompt enginering e tools para o agente **Grow/IoT** sumarizar o cultivo diário; e o agente **Regulatory** monitorar a conformidade das dispensações baseadas nas regras.

---

## 🚨 Pontos Cegos & Edge Cases
- [ ] **Resiliência de Webhooks (PIX):** Implementar um fallback (`cron job` via Node) para fazer a conciliação assíncrona (polling de status) caso o webhook do provedor PIX falhe ou atrase.
- [ ] **Race Conditions em Cota de Pacientes:** Adicionar locks transacionais estritos no Neon SQL para evitar o "double-spending" na compra simultânea do mesmo paciente, estourando sua cota permitida.
- [ ] **Fallback do CrewAI:** Garantir que o `agents/main.py` possua tratamento de erro robusto. Se a API da OpenAI falhar ou demorar demais, o sistema deve acionar o fallback mock nativo silenciosamente, retornando status processável sem derrubar o backend.
- [ ] **Desconexão de Sensores IoT:** O sistema deve disparar um alerta crítico imediato caso os sensores das estufas parem de enviar payloads pelo MQTT por mais de 'X' minutos, evitando prejuízos irremediáveis na safra.
- [ ] **Timeouts do Gateway AI:** Considerando respostas longas da IA, implementar no Node.js um pattern de *Async Job com Polling* (ex: retorna HTTP 202 com Job ID e o Next.js faz o pooling do resultado para a UX) ao invés de manter conexões HTTP abertas que podem gerar timeouts excessivos no Vercel/Infra.