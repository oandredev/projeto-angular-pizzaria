## Projeto Angular + Json-Server para a matéria de Projeto Integrador 2 do curso de TADS.

### Tema: Pizzaria

### Integrantes:

André Rodrigues

Fernanda Souza

### Versões do Projeto:

- NODE: v22.18.0

- NPM: v11.6.0

- ANGULAR/CLI: v20.3.1

- TSC: v5.9.2

- JSON-SERVER: v1.0.0-beta.3

<hr>

### Comandos Git:

Clonar Repositório

```bash
git clone https://github.com/oandredev/projeto-angular-pizzaria
```

Trocar de Branch

```bash
git checkout main
```

Trocar de Branch e Criar uma nova

```bash
git checkout branch feat/nova-feature
```

<hr>

Sincronizar com a branch main (remota)

```bash
git pull origin main
```

OBS: Caso alterações ocorram na main durante o seu trabalho, significa que sua branch é main "antiga" do que main, logo para evitar conflitos futuros, use os seguintes comandos para sincronizar a main com seu código atual (mesmo que não tem sido alterados os mesmos arquivos)

```bash
git fetch origin
```

```bash
git merge origin/main
```

Visualizar branch atual

```bash
git branch
```

<hr>

### ENVIAR

Adicionar alterações (com . (ponto) irá todos os arquivos, caso queira algo especifico escreve o nome no lugar do ponto)

```bash
git add .
```

Mensagem do Commit

```bash
git commit -m "Cria header inicial"

```

Envia as alterações para o Git, onde o destino é a NOVA BRANCH que foi criada localmente e que agora vai se tornar remota também

```bash
git push origin feature/header
```

<hr>

### IMPORTANTE:

Para cada funcionalidade que for alterar gere uma nova branch com esse padrão feat/nomeDaAlteracao, onde feat representa feature, pode usar fix (correção) ou outros:

- feat → nova funcionalidade
- fix → correção de bug
- docs → alteração apenas na documentação
- style → mudanças de formatação/código que não afetam lógica
- refactor → mudanças de código sem alteração de comportamento
- perf → melhoria de desempenho
- test → adição/alteração de testes
- build → mudanças no build ou dependências
- ci → mudanças em pipelines de CI/CD
- chore → manutenção ou tarefas não relacionadas ao código
- revert → desfaz um commit anterior

### DICAS:

FETCH → Apenas busca atualizações remotas (refresh)
PULL → Busca e aplica as atualizações na branch atual
