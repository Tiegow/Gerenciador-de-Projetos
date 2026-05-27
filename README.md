<h1 align="center">Gerenciador de Projetos 🚀</h1>

<p align="center">
  Uma aplicação para gerenciamento de projetos ágeis, construída com Next.js 16, React 19 e PostgreSQL. Ideal para organizar fluxos de trabalho através de painéis Kanban dinâmicos.
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js" />
  <img alt="React" src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-7.8-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img alt="Neon DB" src="https://img.shields.io/badge/Neon-PostgreSQL-00E599?style=for-the-badge&logo=postgresql&logoColor=black" />
  <img alt="TailwindCSS" src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
</p>

---

## ✨ Funcionalidades Principais

* 📋 **Painel Kanban Interativo**: Arraste e solte tarefas entre colunas para atualizar seu status dinamicamente utilizando a biblioteca `@dnd-kit`.
* 🔐 **Autenticação Segura**: Gerenciamento de credenciais via senhas hasheadas e login persistente utilizando o **NextAuth.js v5 (Auth.js)**.
* 🎨 **Design Premium e Dark Mode**: Interface polida (*glassmorphism*) e responsiva construída com **Tailwind CSS** e **shadcn/ui**.
* 🤝 **Colaboração e Gestão**: Links de convites, comentários nas tarefas, definição de prazos, criação de tags customizáveis e designação de membros responsáveis.
* 🧪 **Testes Automatizados**: Suíte de testes integrada usando **Vitest** e React Testing Library para componentes visuais e validação de dados (Zod).

## 🛠️ Stack Tecnológica

* **Frontend:** [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), Lucide Icons.
* **Gerenciamento de Estado:** Zustand, React Query.
* **Backend:** Next.js Server Actions & API Routes, Zod (Validação).
* **Banco de Dados & ORM:** [Prisma ORM](https://www.prisma.io/), [Neon DB (PostgreSQL Serverless)](https://neon.tech/).
* **Testes:** Vitest, Testing Library, JSDOM.

---

## 🚀 Como Executar Localmente

Siga os passos abaixo para testar e executar a aplicação em seu ambiente de desenvolvimento.

### 1. Pré-requisitos
* Node.js (v20 ou superior)
* Banco de Dados PostgreSQL (Recomendado criar um cluster grátis no [Neon](https://neon.tech/))

### 2. Clonando o Repositório
```bash
git clone https://github.com/seu-usuario/gerenciador-de-projetos.git
cd gerenciador-de-projetos
```

### 3. Instalando as Dependências
```bash
npm install
```

### 4. Configurando Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto e preencha as variáveis abaixo (utilize o `.env.example` como base):

```env
# Conexão com o Banco de Dados (Use a URL com pooler caso seja Neon)
DATABASE_URL="postgresql://user:password@hostname/dbname?sslmode=require&pgbouncer=true"

# Usada pelo Prisma CLI para rodar migrações (URL direta, sem pooler)
DATABASE_URL_UNPOOLED="postgresql://user:password@hostname/dbname?sslmode=require"

# Chave secreta para os Cookies do NextAuth v5
# (Você pode gerar rodando: npx auth secret)
AUTH_SECRET="sua-chave-secreta-forte-aqui"

# URL base da aplicação
NEXTAUTH_URL="http://localhost:3000"
```

### 5. Configurando o Banco de Dados
Sincronize o Prisma Schema com seu banco de dados PostgreSQL recém-criado:
```bash
npm run db:push
```

### 6. Executando a Aplicação
Inicie o servidor de desenvolvimento utilizando o *Turbopack* para carregamento ultrarrápido:
```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000) 🎉

---

## 🧪 Rodando os Testes Automatizados

O projeto utiliza Vitest para garantir a resiliência do sistema e a qualidade do código.

Para executar os testes unitários e de integração uma única vez:
```bash
npm run test
```

Para rodar os testes em modo "Watch" durante o desenvolvimento:
```bash
npm run test:watch
```

---

## 🌐 Acesso ao Projeto em Produção

O projeto encontra-se hospedado e pode ser acessado através do link abaixo:

🔗 **[Acessar Gerenciador de Projetos (Deploy)](https://gerenciador-de-projetos-zeta.vercel.app/login)**