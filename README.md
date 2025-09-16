# Projeto2025
Trabalho de DP

Sistema de gerenciamento de Floricultura com loja online integrada

create table if not exists imagem {
  id int not null autoincrement primarykey
  nomeIMG varchar(255) not null
  dadosIMG longblob
}
