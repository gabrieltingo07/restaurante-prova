--Criar banco de DADOS (RestauranteDb)
IF DB_ID('RestauranteDb') IS NULL
BEGIN
    CREATE DATABASE RestauranteDb;
END
GO
------------------------------------------------------------

-- Usar o banco de dados
USE RestauranteDb;
GO

------------------------------------------------------------

-- Apagar tabelas antigas:


IF OBJECT_ID('PedidoItens', 'U') IS NOT NULL
    DROP TABLE PedidoItens;
IF OBJECT_ID('Pedidos', 'U') IS NOT NULL
    DROP TABLE Pedidos;
IF OBJECT_ID('Produtos', 'U') IS NOT NULL
    DROP TABLE Produtos;
GO

------------------------------------------------------------

-- Criar tabela de Produtos


CREATE TABLE Produtos (
    Id           INT IDENTITY(1,1) PRIMARY KEY,
    Nome         NVARCHAR(100) NOT NULL,
    Tipo         NVARCHAR(20)  NOT NULL,   -- 'PRATO' ou 'BEBIDA'
    Preco        DECIMAL(10,2) NOT NULL
);
GO

------------------------------------------------------------

-- Criar tabela de Pedidos

CREATE TABLE Pedidos (
    Id           INT IDENTITY(1,1) PRIMARY KEY,
    Mesa         NVARCHAR(10)   NOT NULL,
    NomeCliente  NVARCHAR(100)  NOT NULL,
    Telefone     NVARCHAR(20)   NULL,
    Status       NVARCHAR(20)   NOT NULL  --Status de preparo
);
GO

------------------------------------------------------------

-- Criar tabela de PedidoItens


CREATE TABLE PedidoItens (
    Id            INT IDENTITY(1,1) PRIMARY KEY,
    PedidoId      INT           NOT NULL,
    ProdutoId     INT           NOT NULL,
    Quantidade    INT           NOT NULL,
    PrecoUnitario DECIMAL(10,2) NOT NULL,

    CONSTRAINT FK_PedidoItens_Pedidos 
        FOREIGN KEY (PedidoId) REFERENCES Pedidos(Id),

    CONSTRAINT FK_PedidoItens_Produtos 
        FOREIGN KEY (ProdutoId) REFERENCES Produtos(Id)
);
GO

------------------------------------------------------------

-- Inserir alguns produtos iniciais (cardápio)

INSERT INTO Produtos (Nome, Tipo, Preco) VALUES
('Prato Feito',       'PRATO', 25.00),
('Hambúrguer',        'PRATO', 30.00),
('Lasanha',           'PRATO', 32.00),
('Refrigerante Lata', 'BEBIDA', 6.00),
('Suco Natural',      'BEBIDA', 8.50),
('Água Mineral',      'BEBIDA', 4.00);
GO
