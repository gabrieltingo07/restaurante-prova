Sistema para restaurante com:

- Cadastro de pedidos (via tela de cardápio)
- Setor Cozinha --> Vê e atualiza pedidos de PRATOS
- Setor Copa --> Vê e atualiza pedidos de BEBIDAS
- Histórico por setor:
- Cozinha --> historico_cozinha.html (pratos entregues)
- Copa --> historico_copa.html (bebidas entregues)
- Autenticação simples (usuários fixos para teste):
- Usuário: cozinha / Senha: 123
- Usuário: copa / Senha: 123

================================================================================
1. Pré-requisitos:

Para rodar o projeto é necessário ter:

1. .NET SDK instalado (versão compatível com o projeto, ex.: .NET 9.0)

2. SQL Server em Docker.

3. Uma ferramenta para executar scripts SQL como:
- Azure Data Studio.

Pacotes NuGet utilizados:

Para o backend em C# foram utilizados os seguintes pacotes NuGet:

- Dapper
- Microsoft.Data.SqlClient

Esses pacotes já estão referenciados no arquivo de projeto (.csproj),
portanto não é necessário instalá-los manualmente um por um.

- No terminal do VSCode escreva: dotnet restore para instalar todos os pacotes para rodar o sistema corretamente.

================================================================================
2. Estrutura das pastas.

ProjetoRestaurante/
ProjetoRestaurante.sln
ProjetoRestaurante/ API em C#

Frontend: Arquivos HTML/JS/CSS (login, cozinha, copa, históricos)

login.html
cozinha.html
copa.html
historico_cozinha.html
historico_copa.html
sql/banco_restaurante.sql: Script para criar o banco de dados.

================================================================================
3. Criar o banco de dados (RestauranteDb)

1. Abrir o Azure Data Studio

2. Clicar em "New Connection" ou "Nova conexão".

3. Conectar no servidor SQL:

3.2. Executar o script banco_restaurante.sql
================================================================================

1. No Azure Data Studio:

- Ir em File → Open File (Arquivo → Abrir arquivo).

- Navegar até a pasta do projeto e abrir: sql\banco_restaurante.sql

2. Conferir que o script contém algo como:

IF DB_ID('RestauranteDb') IS NULL

       CREATE DATABASE RestauranteDb;
   GO

   USE RestauranteDb;
   GO

3. Clicar em "Run" / "Executar" para rodar o script completo.

O que esse script faz:

- Cria o banco RestauranteDb (se ainda não existir).

- Apaga as tabelas antigas PedidoItens, Pedidos, Produtos (se existirem).

- Cria as tabelas:

  - Produtos
  - Pedidos
  - PedidoItens

- Insere alguns produtos iniciais (cardápio: pratos e bebidas).

- Para verificar se tudo foi criado corretamente.

USE RestauranteDb;
GO

SELECT * FROM Produtos;
SELECT * FROM Pedidos;
SELECT * FROM PedidoItens;

Resultados esperados:
- Produtos: deve listar alguns produtos já cadastrados (PRATO e BEBIDA).
- Pedidos: vazio (sem pedidos, pronto para testes).
- PedidoItens: vazio.


================================================================================
4. Ajustar a connection string da API

No projeto C#, abrir o arquivo:

  ProjetoRestaurante\appsettings.json

Localizar a seção de connection strings, por exemplo:

  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=RestauranteDb;User Id=sa;Password=SuaSenhaAqui;TrustServerCertificate=True"
  }

- Server:
- Se for Docker: localhost,1433
- User Id: usuário do SQL (ex.: sa).
- Password: senha do usuário do SQL.
- Database: RestauranteDb (deve bater com o nome criado no script SQL).

================================================================================
5. Rodar a API do projeto

Abrir o terminal na pasta do projeto:

1. Abrir o Prompt de Comando, PowerShell ou terminal do VS Code.

2. Navegar até a pasta da API por exemplo:

cd C:\RestauranteProva\ProjetoRestaurante

(Ajustar o caminho de acordo com onde o projeto foi salvo).

Executar a API:

Rodar o comando:

   dotnet run

Se tudo estiver correto a saída será parecida com:

   info: Microsoft.Hosting.Lifetime[14]
         Now listening on: http://localhost:5000
   info: Microsoft.Hosting.Lifetime[0]
         Application started. Press Ctrl+C to shut down.
   info: Microsoft.Hosting.Lifetime[0]
         Hosting environment: Development (ou Production)
   info: Microsoft.Hosting.Lifetime[0]
         Content root path: C:\CSharpProjeto\RestauranteProva\ProjetoRestaurante

A API estará rodando em: http://localhost:5000

================================================================================
6. Abrir o front-end (telas HTML)

As telas HTML podem ficar em uma pasta por exemplo:
ProjetoRestaurante\Frontend

Principais arquivos:
- login.html
- cozinha.html
- copa.html
- historico_cozinha.html
- historico_copa.html

Tela de Login HTML:

1. Abrir o arquivo login.html no navegador

- Pode ser clicando duas vezes no arquivo ou abrindo pelo VS Code com "Open with Live Server". (Caso não tenha vá nas extensões do VSCode e pesquise por LiverServer).

2. A tela de login possui campos para digitar usuário e senha.
   
Usuários de teste estão fixos na API (AuthController)

- Cozinha:
  - Usuário: cozinha
  - Senha: 123
- Copa:
  - Usuário: copa
  - Senha: 123

================================================================================
7. Telas da Cozinha e da Copa:


7.1. Tela da Cozinha mostra apenas os Pratos que são da jurisdição daquele setor e seu histórico, podendo também mudar o status dos pedidos que quando são mudados para ENTREGUES vão para a aba de histórico. O mesmo serve para o setor da COPA que são apresentados somente os pedidos de BEBIDAS.

================================================================================
8. Históricos de pedidos entregues

8.1. Histórico da Cozinha e Copa.

- Exibe apenas pedidos ENTREGUES do setor de PRATOS (Cozinha) consumindo a API
- Exibe apenas pedidos ENTREGUES do setor de PRATOS (Copa) consumindo a API

================================================================================

9. Resetar pedidos para novo teste

Caso seja necessário apagar todos os pedidos de teste e começar do zero,
pode-se executar no Azure Data Studio:

USE RestauranteDb;
GO

DELETE FROM PedidoItens;
DELETE FROM Pedidos;

================================================================================
10. Observações finais

- O script banco_restaurante.sql deve ser executado antes de rodar o projeto.
- A connection string no appsettings.json precisa apontar para o servidor SQL correto.

- Os usuários de teste "cozinha"/"123" e "copa"/"123" estão definidos fixos na API (AuthController), apenas para fins de demonstração.

O sistema foi feito de forma simples e didática, com foco em:

- Separação por setor (Cozinha/Copa),
- Atualização de status, histórico de pedidos entregues por setor.
