CREATE DATABASE smartcimed_db;

USE smartcimed_db;
DROP TABLE IF EXISTS produtos_quimicos;
DROP TABLE IF EXISTS movimentacoes;
CREATE TABLE produtos_quimicos (
	id INT primary key auto_increment,
    marca Varchar(150) Not NULL,
    categoria varchar(80) not null,
    valor_unitario decimal(10,2) not null,
    estoque_minimo int not null default 0,
    estoque_maximo int not null default 0,
    created_at timestamp default current_timestamp
); 
CREATE TABLE movimentacoes(
	id INT primary key auto_increment,
	produtos_quimicos_id int not null,
    tipo ENUM('ENTRADA', 'SAIDA') NOT NULL,
    quantidade int not null, 
    data_movimentacao datetime not null default current_timestamp,
    created_at timestamp default current_timestamp,
    CONSTRAINT fk_movimentacoes_produtos_quimicos
		FOREIGN KEY (produtos_quimicos_id) REFERENCES produtos_quimicos(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);


INSERT INTO produtos_quimicos (marca, categoria, valor_unitario, estoque_minimo, estoque_maximo) 
VALUES('see', 'limpeza de chão', 12.00, 4, 20),
('bassura', 'limpeza de móveis sujos', 25.90, 2, 10),
('Clean Code', 'limpeza de aparelhos de alta Tecnologia', 120.00, 1, 30);
INSERT INTO movimentacoes (produtos_quimicos_id, tipo, quantidade, data_movimentacao) VALUES
(1, 'ENTRADA', 10, '2026-01-03 09:00:00'),
(1, 'SAIDA', 3, '2026-01-10 15:10:00'),
(1, 'SAIDA', 2, '2026-01-15 11:30:00'),
(2, 'ENTRADA', 8, '2026-01-04 10:00:00'),
(2, 'SAIDA', 4, '2026-01-17 16:00:00'),
(3, 'ENTRADA', 6, '2026-01-05 08:30:00'),
(3, 'SAIDA', 1, '2026-01-20 13:15:00');

create VIEW vw_produtos_quimicos as
SELECT p.id as produtos_quimicos_id,
p.marca,
p.categoria,
p.valor_unitario,
SUM(
CASE 
	WHEN m.tipo = 'ENTRADA' THEN m.quantidade
    WHEN m.tipo = 'SAIDA' THEN -m.quantidade
    ELSE 0
END) as saldo_estoque,
SUM(
CASE 
	WHEN m.tipo = 'ENTRADA' THEN m.quantidade
    WHEN m.tipo = 'SAIDA' THEN -m.quantidade
    ELSE 0
END) * p.valor_unitario as valor_total_item
from produtos_quimicos p
left join movimentacoes m on m.produtos_quimicos_id = p.id
group by p.id,
p.marca,
p.categoria,
p.valor_unitario;




SELECT * FROM produtos_quimicos;

DROP DATABASE smartcimed_db;
