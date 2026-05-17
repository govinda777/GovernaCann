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
