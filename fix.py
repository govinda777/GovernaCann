with open("BACKLOG.md", "r") as f:
    content = f.read()

import re

new_content = re.sub(
    r"<<<<<<< HEAD.*?=======",
    "## 🏗️ Infra & Core Engine\n- [x] **Setup do Monorepo:** Estruturação base (Frontend Next.js, Backend Node.js, Agentes Python).\n- [x] **Database Setup:** Configuração inicial do banco de dados (Neon SQL) com esquema multi-tenant (`associationId`).\n- [ ] **Gestão de Tenant e Isolamento:** Implementar validação estrita no backend Node.js (via middleware JWT) para garantir que todas as queries e mutações (Sanity CMS e Neon SQL) filtrem obrigatoriamente pelo contexto do `associationId`. *Critério de Aceite: Nenhuma query deve retornar dados de outra associação.*\n- [x] **Integração Backend/CrewAI:** Refinar o `backend/utils/agent-bridge.js` usando `child_process` para garantir chamadas assíncronas aos scripts Python, incluindo logs estruturados, tratamento de timeout e error boundaries.\n  - *Detalhe da Atualização:* Adicionado log estruturado em formato JSON (`timestamp`, `level`, `message`, `duration`) e implementado um timeout configurável (padrão 30s) para garantir que processos Python inativos ou bloqueados sejam encerrados com segurança (`SIGTERM`), rejeitando a Promise apropriadamente. Testes unitários e E2E adicionados e verificados.\n- [ ] **Pipeline de Deploy:** Consolidar e testar o workflow do GitHub Actions em `.github/workflows/deploy-frontend.yml` configurado para `static export` do Next.js no GitHub Pages.\n- [ ] **Otimização de Custos e Modelagem Sanity:** Implementar queries no Sanity usando um dataset único filtrado via query por `associationId` no backend para otimizar os custos com o CMS mantendo a segurança multi-tenant.\n=======",
    content,
    flags=re.DOTALL
)

new_content = re.sub(
    r"=======.*?>>>>>>> origin/main\n",
    "",
    new_content,
    flags=re.DOTALL
)

with open("BACKLOG.md", "w") as f:
    f.write(new_content)
