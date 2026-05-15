# GovernaCann (Dona Liamba OS)

**GovernaCann** é uma plataforma inovadora de marca branca (white-label) desenvolvida especificamente para facilitar e gerenciar associações de medicina canábica.

Nossa principal proposta de valor é oferecer uma **plataforma ponta a ponta** que te ajuda não apenas a criar a sua própria associação, mas também a gerenciar cada detalhe da sua operação — desde os primeiros passos da abertura legal até a entrega final do tratamento ao paciente.

## 🎯 Objetivo e Proposta de Valor

Nossa missão é descomplicar a gestão de associações de pacientes, centralizando todas as necessidades operacionais e regulatórias em um único lugar. Oferecemos ferramentas que cobrem:

- **Abertura e Governança:** Guiamos a criação da sua associação garantindo que todos os **requisitos legais** sejam cumpridos desde o primeiro dia.
- **Financeiro e Contabilidade:** Ferramentas integradas para controle de caixa, auditoria, mensalidades e contabilidade geral da associação.
- **Recursos Humanos (RH):** Gestão da equipe, médicos prescritores, cultivadores e colaboradores essenciais para a operação.
- **Produção e Armazenamento:** Rastreabilidade completa do cultivo, desde a semente até o armazenamento seguro da colheita e produtos processados.
- **IoT e Automação no Cultivo:**
  - **Métricas IoT:** Monitoramento em tempo real do ambiente de cultivo (temperatura, umidade, luz, etc.) utilizando MQTT.
  - **Comandos IoT e Automação:** Controle remoto e automatizado de equipamentos de cultivo para otimizar a produção e reduzir falhas humanas.
- **Acolhimento e Entrega ao Cliente:** Gestão da jornada do paciente (Patient Care), controle de dispensação, renovação de laudos e logística de entrega dos produtos medicinais.

Em resumo: o GovernaCann está com você **desde a concepção e abertura da associação até a entrega do bem-estar nas mãos do paciente**.

## 🏗️ Arquitetura e Tecnologias

A plataforma foi construída utilizando uma arquitetura moderna, modular e escalável:

- **Frontend:** Desenvolvido em **Next.js** (configurado para `static export` via GitHub Pages), oferecendo uma experiência de usuário fluida e responsiva.
- **Backend:** Orquestrador principal em **Node.js/Express** responsável por integrar todas as áreas da plataforma.
- **Inteligência Artificial (Agentes CrewAI):** Scripts em **Python** que rodam em background, englobando 5 especialistas virtuais:
  1. **Legal:** Governança e estatutos.
  2. **Regulatory:** Compliance e conformidade contínua.
  3. **Grow/IoT:** Especialista em cultivo e análise de telemetria.
  4. **Patient Care:** Acolhimento e suporte ao paciente.
  5. **Audit:** Especialista financeiro.
- **Banco de Dados e Conformidade (LGPD):** Utilizamos **Neon SQL** com esquema multi-tenant (suporte a várias associações na mesma instância). O banco foi desenhado visando minimização de dados e *não* armazena PII (Informações de Identificação Pessoal).
- **Gestão de Identidade:** Todos os dados sensíveis e autenticação (incluindo smart wallets) são tratados com segurança pelo **Privy**. O banco de dados relacional utiliza o `privy_id` como chave primária.
- **Gerenciamento de Conteúdo:** Schemas estruturados utilizando **Sanity CMS**.

## 🚀 Como Iniciar

1. Instale as dependências do **Backend** e **Frontend**:

   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. Instale as dependências dos **Agentes de IA**:

   ```bash
   cd agents && pip install -r requirements.txt
   ```

*(Certifique-se de configurar suas chaves do Privy, Neon SQL, MQTT e OpenAI no seu ambiente para o funcionamento completo da plataforma).*
