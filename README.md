# API Users & Places

API para gerenciamento de usuários e lugares, com autenticação utilizando JWT, rotas protegidas para criação, edição, exclusão e listagem de dados.

## Índice

- [Descrição](#descrição)
- [Funcionalidades](#funcionalidades)
- [Instalação](#instalação)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Execução](#execução)
- [Rotas da API](#rotas-da-api)
- [Validações](#validações)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Descrição

Esta API permite o gerenciamento de usuários e lugares. Ela inclui funcionalidades de registro de usuários, autenticação, listagem e busca de lugares, além de proteção de rotas para ações restritas a usuários autenticados e administradores.

## Funcionalidades

- Registro de novos usuários com criptografia de senhas (bcrypt).
- Autenticação e geração de tokens JWT.
- Listagem de todos os usuários (rota protegida).
- Busca de usuários por ID (rota protegida).
- Criação, edição e remoção de lugares (restrita a administradores).
- Listagem e busca de lugares por nome.
- Proteção de rotas para garantir segurança.

## Instalação

Para rodar a aplicação localmente, siga os passos abaixo:

### Pré-requisitos

- [Node.js](https://nodejs.org/) v14 ou superior
- [PostgreSQL](https://www.postgresql.org/)

### Passos

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/api-users-places.git
   cd api-users-places
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis de ambiente:

   ```bash
   DB_HOST=localhost
   DB_USER=seu_usuario_db
   DB_PASSWORD=sua_senha_db
   DB_NAME=nome_do_banco
   DB_PORT=5432
   JWT_SECRET=sua_chave_secreta_para_jwt
   ```

4. Inicialize o banco de dados:

   Certifique-se de ter um banco de dados PostgreSQL rodando com as credenciais que você configurou no `.env`.

5. Execute as migrações:

   ```bash
   npx sequelize-cli db:migrate
   ```

## Configuração do Ambiente

Certifique-se de que você tenha as seguintes variáveis configuradas no seu arquivo `.env`:

```bash
DB_HOST=localhost         # Host do banco de dados
DB_USER=seu_usuario_db    # Usuário do banco de dados
DB_PASSWORD=sua_senha_db  # Senha do banco de dados
DB_NAME=nome_do_banco     # Nome do banco de dados
DB_PORT=5432              # Porta padrão do PostgreSQL
JWT_SECRET=sua_chave_secreta_para_jwt # Chave secreta para o JWT
```

## Execução

O servidor estará disponível em: `http://localhost:3000`

### Ambiente de Produção

Para rodar o projeto em ambiente de produção, use:

```bash
npm start
```

## Rotas da API

### Autenticação

- `POST /users/register`: Registrar um novo usuário
  - Corpo da requisição:
    ```json
    {
      "name": "Yuri Moraes",
      "email": "yuri@user.com",
      "password": "senha123"
    }
    ```

- `POST /users/login`: Autenticar e obter token JWT
  - Corpo da requisição:
    ```json
    {
      "email": "yuri@user.com",
      "password": "senha123"
    }
    ```

### Usuários

- `GET /users`: Listar todos os usuários (rota protegida)
- `GET /users/:id`: Buscar um usuário por ID (rota protegida)
- `PUT /users/:id`: Editar dados de um usuário (rota protegida)
  - Corpo da requisição:
    ```json
    {
      "name": "Novo Nome",
      "password": "novaSenha123"
    }
    ```

- `DELETE /users/:id`: Deletar um usuário (rota protegida)

### Lugares (Places)

- `GET /places`: Listar todos os lugares
- `GET /places/:id`: Buscar um lugar por ID
- `GET /places?name={nome}`: Buscar lugares pelo nome
- `POST /places`: Criar um novo lugar (rota protegida, admin)
  - Corpo da requisição:
    ```json
    {
      "name": "Praça Central",
      "desc": "Uma praça no centro da cidade",
      "endereco": "Rua Principal, 123",
      "telefone": "(31) 99999-9999",
      "nota": 4.5,
      "placeId": "PC123",
      "img": "https://exemplo.com/imagem.jpg",
      "fotos": ["https://exemplo.com/foto1.jpg", "https://exemplo.com/foto2.jpg"]
    }
    ```

- `PUT /places/:id`: Atualizar informações de um lugar (rota protegida, admin)
  - Corpo da requisição:
    ```json
    {
      "name": "Praça Nova",
      "desc": "Descrição atualizada",
      "endereco": "Rua Nova, 456"
    }
    ```

- `DELETE /places/:id`: Deletar um lugar (rota protegida, admin)

### Exemplo de Autenticação

A autenticação JWT exige que você envie o token no cabeçalho `Authorization` em todas as requisições protegidas.

```http
Authorization: Bearer <seu_token_jwt>
```

## Validações

A API inclui as seguintes validações:

1. **Registro de Usuário**:
   - O campo `email` deve ser único.
   - A senha deve ter pelo menos 6 caracteres.

2. **Login**:
   - O `email` e a `senha` são validados.
   - O token JWT é gerado ao fazer login com sucesso.

3. **Places**:
   - O nome e o endereço são campos obrigatórios para a criação de um lugar.
   - Apenas administradores podem criar, atualizar e deletar lugares.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução para JavaScript.
- **Express**: Framework para construção de APIs.
- **Sequelize**: ORM para gerenciamento do banco de dados.
- **PostgreSQL**: Banco de dados relacional.
- **bcrypt**: Para hashing de senhas.
- **JWT**: Para autenticação baseada em tokens.

## Contribuição

Sinta-se à vontade para contribuir com este projeto. Você pode abrir issues ou enviar pull requests.

### Passos para Contribuir

1. Faça um fork do projeto.
2. Crie uma branch para sua feature/bugfix:
   ```bash
   git checkout -b minha-feature
   ```
3. Faça suas alterações e commit:
   ```bash
   git commit -m "Minha nova feature"
   ```
4. Envie para o repositório remoto:
   ```bash
   git push origin minha-feature
   ```
5. Abra um Pull Request!

## Licença

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.
