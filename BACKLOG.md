# 📋 BACKLOG - GovernaCann (Dona Liamba OS) MVP

**Objetivo do MVP:** Validar o fluxo de ponta a ponta da plataforma de gestão de associações, garantindo integração com IoT em tempo real, rastreabilidade transparente via Smart Wallets (Privy), pagamentos via PIX, controle estrito de cotas para pacientes e orquestração dos agentes CrewAI.

---

## 🏗️ 1. Infraestrutura & Core Engine
- [x] Estruturação base do monorepo (Frontend Next.js, Backend Node.js, Agentes Python).
- [x] Configuração inicial do banco de dados (Neon SQL) com esquema multi-tenant (`associationId`).
- [ ] **Gestão de Tenant e Isolamento:** Implementar validação estrita no backend para garantir que todas as queries e mutações (Sanity e Neon) filtrem corretamente por `associationId`.
- [x] **Integração Backend/CrewAI:** Refinar o `agent-bridge.js` para garantir chamadas não bloqueantes aos scripts Python, incluindo logs estruturados e timeout.
  - *Detalhe da Atualização:* Adicionado log estruturado em formato JSON (`timestamp`, `level`, `message`, `duration`) e implementado um timeout configurável (padrão 30s) para garantir que processos Python inativos ou bloqueados sejam encerrados com segurança (`SIGTERM`), rejeitando a Promise apropriadamente. Testes unitários e E2E adicionados e verificados.
- [ ] **Pipeline de Deploy:** Consolidar e testar o deploy estático do frontend via GitHub Actions para o GitHub Pages.

## 🔒 2. Identidade, Wallets & Rastreabilidade
- [ ] **Autenticação com Privy:** Finalizar fluxo de login gerando e vinculando o `privy_id` aos registros locais (Neon SQL).
- [ ] **Smart Wallets para Colaboradores:** Automatizar a criação de wallets no momento do login para prestadores de serviço e colaboradores.
- [ ] **Rastreabilidade de Ações (Audit Trail):** Gravar movimentações críticas (ex: atualizações de estoque, dispensação) on-chain ou em banco imutável usando a wallet do colaborador logado.
- [ ] **Tokenização Leve de Ativos (Inovação):** Definir e prototipar a estratégia de baixo custo (ex: L2 ou off-chain state channels) para rastrear os produtos medicinais do cultivo à entrega de forma acessível.

## 💰 3. Financeiro, Acolhimento & Pagamentos
- [ ] **Integração de Pagamento via PIX:** Implementar gateway/API para geração e conciliação automática de cobranças via PIX.
- [ ] **Controle de Cota de Pacientes:** Criar a lógica de negócio estrita no backend para bloquear a compra/dispensação caso o paciente exceda a sua cota prescrita (limite do laudo médico).
- [ ] **Gestão de Assinaturas/Mensalidades:** Sistema para verificar status de pagamento da associação do paciente antes de autorizar novos pedidos.

## 🌿 4. Cultivo, IoT & Telemetria
- [ ] **Ingestão de Dados IoT em Tempo Real:** Configurar o broker MQTT para recebimento contínuo de telemetria do cultivo (temperatura, umidade, luz).
- [ ] **Armazenamento e Descarte Seguro:** Implementar estratégia de banco de séries temporais (ou tabela otimizada no Neon) agregando dados antigos e descartando ruídos para economizar espaço, mantendo a performance analítica.
- [ ] **Automação Baseada em Regras:** Lógica para envio de comandos reversos via MQTT caso os parâmetros saiam do limite ideal do cultivo.

## 🤖 5. Agentes de IA (CrewAI)
- [ ] **Fallback e Tratamento de Erros:** Ajustar `main.py` para lidar com falhas da API da OpenAI, acionando o mock mode silenciosamente caso necessário.
- [ ] **Agente Grow/IoT:** Implementar a análise da telemetria armazenada e geração de insights em linguagem natural para o cultivador.
- [ ] **Agente Legal/Regulatory:** Parametrizar a verificação de conformidade do limite de cota dos pacientes com base na LGPD e regras vigentes.

## 🖥️ 6. Frontend & Experiência do Usuário (UX)
- [ ] **Dashboard do Colaborador:** View para consultar a rastreabilidade dos produtos e status em tempo real do cultivo.
- [ ] **Portal do Paciente:** Visualização clara do consumo da cota, histórico de pedidos via PIX e facilitação na renovação de receitas.
- [ ] **Tratamento Global de Erros UI:** Interceptadores de erro robustos para exibir alertas (toasts/modais) amigáveis caso o backend, o PIX ou a IA falhem.

---

## 🚨 7. Pontos Cegos & Edge Cases (Resiliência)
- [ ] **Resiliência do PIX:** Como lidar com falhas de webhook do provedor de PIX? Implementar um fallback de polling (`cron job`) para reconciliar pagamentos pendentes de forma assíncrona.
- [ ] **Segurança e Vazamento de Dados (PII):** Validar estritamente que os logs do sistema e os inputs da IA **nunca** expõem PII (Informações de Identificação Pessoal) de pacientes. Usar apenas o `privy_id`.
- [ ] **Limites de Cota Concorrentes (Race Conditions):** Adicionar *locks* de transação no banco de dados para evitar "double-spending" da cota do paciente em requisições simultâneas.
- [ ] **Desconexão de Sensores IoT:** Implementar alertas automáticos (via Agente de Cultivo) caso os sensores parem de enviar telemetria por mais de 'X' minutos, garantindo ação rápida para não perder a safra.
- [ ] **Timeouts dos Agentes de IA:** Como a IA pode demorar mais que o tempo de timeout padrão de uma requisição HTTP, adotar um padrão de processamento em background, retornando um Job ID para o frontend consultar o status do agente posteriormente.

---

## 🗺️ 8. Mapeamento de Jornadas (User Stories) e Testes BDD

Nesta seção, mapeamos as principais jornadas de usuário do sistema GovernaCann, especificando a implementação técnica (stack) e as histórias de usuário. Para garantir a qualidade e a aderência aos requisitos (como controle de cota e isolamento), utilizaremos testes BDD para cada jornada.

### 🏛️ Jornada 1: Nova Associação (Onboarding e Legal)
**Stack:** Next.js (UI de onboarding modular via Sanity/JSON), Node.js (criação de registros no Neon SQL e geração do `associationId`), CrewAI (Agente Legal para validação de estatuto), Privy (Wallet base da associação).

- [ ] **US 1.1 - Criação de Associação:** Como fundador, quero me registrar via Privy e preencher os dados da associação para que o sistema crie um tenant isolado (`associationId`) e minha smart wallet no Base L2.
- [ ] **US 1.2 - Validação de Estatuto:** Como fundador, quero enviar um rascunho do meu estatuto para que o Agente Legal (CrewAI) valide sua conformidade e devolva as correções necessárias.
- [ ] **Teste BDD 1.1:** `Cenário: Registro de nova associação com sucesso`.
- [ ] **Teste BDD 1.2:** `Cenário: Validação de estatuto pelo agente CrewAI`.

### 🌱 Jornada 2: Grow (Cultivo Inteligente e IoT)
**Stack:** Node.js (MQTT Broker/Client para telemetria), Neon SQL (Timeseries data), CrewAI (Agente Grow para análise), Next.js (Dashboard do cultivador).

- [ ] **US 2.1 - Ingestão de Telemetria:** Como cultivador, quero que os sensores IoT (temperatura, umidade) publiquem dados via MQTT e que o backend armazene esses dados em tempo real no Neon SQL atrelados ao meu lote e `associationId`.
- [ ] **US 2.2 - Análise de Safra:** Como cultivador, quero visualizar no dashboard alertas gerados pelo Agente Grow (CrewAI) quando as métricas IoT saírem do padrão, para corrigir o ambiente preventivamente.
- [ ] **Teste BDD 2.1:** `Cenário: Ingestão de métricas MQTT em tempo real`.
- [ ] **Teste BDD 2.2:** `Cenário: Alerta de temperatura fora do padrão gerado por IA`.

### 🫂 Jornada 3: Patient Care (Acolhimento e Dispensação)
**Stack:** Next.js (Portal do paciente/Tirinhas), Node.js (regras de cota e integração PIX), Neon SQL (histórico de dispensação, sem PII).

- [ ] **US 3.1 - Verificação de Cota (Prescrição):** Como paciente, quero ver meu limite mensal de medicamentos no portal para saber o quanto ainda posso solicitar.
- [ ] **US 3.2 - Bloqueio de Dispensação:** Como farmacêutico/dispensador, quero que o sistema bloqueie a entrega de um produto se o paciente já atingiu sua cota mensal (conforme laudo e `privy_id`).
- [ ] **Teste BDD 3.1:** `Cenário: Paciente visualiza sua cota restante`.
- [ ] **Teste BDD 3.2:** `Cenário: Bloqueio de dispensação ao exceder cota do laudo`.

### 📊 Jornada 4: Auditoria (Pagamentos e Compliance)
**Stack:** Node.js (integração webhook PIX, auditoria imutável via wallet), CrewAI (Agente Audit).

- [ ] **US 4.1 - Pagamento de Mensalidade:** Como paciente, quero gerar uma cobrança PIX no portal e, após o pagamento, ver minha mensalidade atualizada via webhook sem intervenção humana.
- [ ] **US 4.2 - Conciliação Automática:** Como tesoureiro, quero que o Agente Audit valide transações PIX com as dispensações mensais e me alerte sobre anomalias no fluxo de caixa.
- [ ] **Teste BDD 4.1:** `Cenário: Atualização de mensalidade via webhook PIX`.
- [ ] **Teste BDD 4.2:** `Cenário: Relatório de discrepância gerado pelo agente Audit`.

### 🧪 Configuração de Pipeline BDD
- [ ] **Configuração Jest/Cucumber:** Integrar suporte a BDD (ex: `jest-cucumber`) no backend para rodar as especificações de jornada.
- [ ] **Relatório de Execução (Skipped):** Configurar a pipeline do GitHub Actions para mapear, executar e reportar esses testes BDD. *Inicialmente, os testes devem ser configurados como "skipped" (ignorados) para demonstrar o mapeamento das jornadas no report do CI antes da implementação real.*
