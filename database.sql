CREATE DATABASE RestauranteDb;
GO

USE RestauranteDb;
GO

CREATE TABLE Usuarios (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nome NVARCHAR(100) NOT NULL,
    Login NVARCHAR(50) NOT NULL UNIQUE,
    SenhaHash NVARCHAR(255) NOT NULL,
    Setor NVARCHAR(20) NOT NULL -- 'COZINHA', 'COPA', 'GERENTE'
);
GO

CREATE TABLE Produtos (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nome NVARCHAR(100) NOT NULL,
    Tipo NVARCHAR(20) NOT NULL, -- 'PRATO' ou 'BEBIDA'
    Preco DECIMAL(10,2) NOT NULL
);
GO

CREATE TABLE Pedidos (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Mesa INT NOT NULL,
    NomeCliente NVARCHAR(100) NOT NULL,
    Telefone NVARCHAR(20) NULL,
    Status NVARCHAR(20) NOT NULL, -- 'EmPreparo', 'Pronto', 'Entregue'
    DataCriacao DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

CREATE TABLE PedidoItens (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    PedidoId INT NOT NULL,
    ProdutoId INT NOT NULL,
    Quantidade INT NOT NULL,
    PrecoUnitario DECIMAL(10,2) NOT NULL,
    CONSTRAINT FK_PedidoItens_Pedidos FOREIGN KEY (PedidoId) REFERENCES Pedidos(Id),
    CONSTRAINT FK_PedidoItens_Produtos FOREIGN KEY (ProdutoId) REFERENCES Produtos(Id)
);
GO

INSERT INTO Produtos (Nome, Tipo, Preco) VALUES
('Coca-Cola Lata', 'BEBIDA', 5.00),
('Suco de Laranja', 'BEBIDA', 6.00),
('Água', 'BEBIDA', 3.00),
('Feijoada', 'PRATO', 25.00),
('Lasanha', 'PRATO', 20.00),
('Macarrão', 'PRATO', 18.00);
GO
