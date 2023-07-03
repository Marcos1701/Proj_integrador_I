"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const pg_1 = __importDefault(require("pg"));
const client = new pg_1.default.Client({
    host: 'localhost',
    port: 5433,
    database: 'planr',
    user: 'postgres',
    password: 'postgres'
});
exports.client = client;
client.connect().then(() => {
    console.log("Conectado ao banco de dados");
}).catch((err) => {
    console.log(err);
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        client.query(`
    CREATE TABLE IF NOT EXISTS metodo_login(
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL
    );
    `);
        client.query(`
    CREATE TABLE IF NOT EXISTS usuario (
        id varchar PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        senha VARCHAR(255),
        id_metodo_login INTEGER NOT NULL,
        token VARCHAR NOT NULL,
        FOREIGN KEY (id_metodo_login) REFERENCES metodo_login(id)
        );
     `);
        client.query(`
    CREATE TABLE IF NOT EXISTS ADM (
        id_usuario varchar PRIMARY KEY,
        id_responsavel varchar NOT NULL,
        FOREIGN KEY (id_usuario) REFERENCES usuario(id),
        FOREIGN KEY (id_responsavel) REFERENCES usuario(id)
    );
    `);
        client.query(`
        CREATE OR REPLACE FUNCTION ADICIONAR_USUARIO(id_usuario varchar, nome_usuario VARCHAR(255), email_usuario VARCHAR(255), id_metodo_login INTEGER, token_usuario varchar, senha_usuario VARCHAR(255) DEFAULT NULL)
        RETURNS VOID AS $$
        BEGIN   
        IF (id_usuario IS NULL OR nome_usuario IS NULL OR email_usuario IS NULL OR id_metodo_login IS NULL OR token_usuario IS NULL) THEN
                RAISE EXCEPTION 'Nome, email ou metodo de login invalido';
            ELSIF EXISTS (SELECT * FROM USUARIO WHERE email = email_usuario) THEN
                RAISE EXCEPTION 'Email ja cadastrado';
            ELSIF EXISTS (SELECT * FROM USUARIO WHERE token = token_usuario) THEN
                RAISE EXCEPTION 'USUARIO ja cadastrado';
            END IF;

            IF (senha_usuario IS NULL) THEN
                IF NOT EXISTS (SELECT * FROM METODO_LOGIN WHERE id = id_metodo_login AND NOME ILIKE 'GOOGLE') THEN
                    RAISE EXCEPTION 'Metodo de login invalido';
                END IF;
                INSERT INTO usuario (id, nome, email, id_metodo_login, token) VALUES (id_usuario, nome_usuario, email_usuario, id_metodo_login, token_usuario);
            ELSE
                INSERT INTO usuario (id, nome, email, senha, id_metodo_login, token) VALUES (id_usuario, nome_usuario, email_usuario, senha_usuario, id_metodo_login, token_usuario);
            END IF;
        END;
        $$ LANGUAGE PLPGSQL;

        CREATE OR REPLACE FUNCTION EDITAR_USUARIO(token_usuario varchar, novo_token varchar, nome_usuario VARCHAR(255) DEFAULT NULL, email_usuario VARCHAR(255) DEFAULT NULL, senha_usuario VARCHAR(255) DEFAULT NULL)
        RETURNS VOID AS $$
        BEGIN
            IF (token_usuario IS NULL) THEN
                RAISE EXCEPTION 'token do usuario invalido';
            END IF;

            IF NOT EXISTS (SELECT * FROM USUARIO WHERE token = token_usuario) THEN
                RAISE EXCEPTION 'Usuario nao cadastrado';
            END IF;

            IF (novo_token IS NOT NULL) THEN
                IF EXISTS (SELECT * FROM USUARIO WHERE token = novo_token) THEN
                    RAISE EXCEPTION 'Token ja cadastrado';
                END IF;
                UPDATE USUARIO SET token = novo_token WHERE token = token_usuario;
            END IF;

            IF (email_usuario IS NOT NULL) THEN
                IF EXISTS (SELECT * FROM USUARIO WHERE email = email_usuario) THEN
                    RAISE EXCEPTION 'Email ja cadastrado';
                END IF;
                UPDATE USUARIO SET email = email_usuario WHERE token = token_usuario;
            END IF;

            IF (nome_usuario IS NOT NULL) THEN
                UPDATE USUARIO SET nome = nome_usuario WHERE token = token_usuario;
            END IF;

            IF (senha_usuario IS NOT NULL) THEN
                UPDATE USUARIO SET senha = senha_usuario WHERE token = token_usuario;
            END IF;
        END;
        $$ LANGUAGE PLPGSQL;

        CREATE OR REPLACE FUNCTION EXCLUIR_USUARIO(token_usuario varchar)
        RETURNS VOID AS $$
        BEGIN
            IF (token_usuario IS NULL) THEN
                RAISE EXCEPTION 'token do usuario invalido';
            END IF;

            IF NOT EXISTS (SELECT * FROM USUARIO WHERE token = token_usuario) THEN
                RAISE EXCEPTION 'Usuario nao cadastrado';
            END IF;

            DELETE FROM USUARIO WHERE token = token_usuario;
        END;
        $$ LANGUAGE PLPGSQL;

        CREATE OR REPLACE FUNCTION VALIDA_LOGIN(email_usuario VARCHAR(255), senha_usuario VARCHAR(255))
        RETURNS BOOLEAN AS $$
        BEGIN
            IF (email_usuario IS NULL OR senha_usuario IS NULL) THEN
                RAISE EXCEPTION 'Email ou senha invalidos'; 
            END IF;
            IF EXISTS (SELECT * FROM USUARIO WHERE email = email_usuario AND senha = senha_usuario) THEN
                RETURN TRUE;
            ELSE
                RETURN FALSE;
            END IF;
        END;
        $$ LANGUAGE PLPGSQL;

        CREATE OR REPLACE FUNCTION GET_DATA(token_user VARCHAR(255))
        RETURNS TABLE (id_usuario varchar, nome_usuario VARCHAR(255), email_usuario VARCHAR(255), senha_usuario VARCHAR(255), id_metodo_login_usuario INTEGER, token_usuario varchar) AS $$
        BEGIN

            IF (token_user IS NULL) THEN
                RAISE EXCEPTION 'token do usuario invalido';
            END IF;

            IF NOT EXISTS (SELECT * FROM USUARIO WHERE token = token_user) THEN
                RAISE EXCEPTION 'Usuario nao cadastrado';
            END IF;

            RETURN QUERY SELECT id, nome, email, senha, id_metodo_login, token FROM USUARIO WHERE token = token_user;
        END;
        $$ LANGUAGE PLPGSQL;

        CREATE OR REPLACE FUNCTION GET_ID_USUARIO(email_usuario VARCHAR(255))
        RETURNS VARCHAR AS $$
        BEGIN
            IF (email_usuario IS NULL) THEN
                RAISE EXCEPTION 'Email invalido';
            END IF;
            IF EXISTS (SELECT * FROM USUARIO WHERE email = email_usuario) THEN
                RETURN (SELECT id FROM USUARIO WHERE email = email_usuario);
            ELSE
                RAISE EXCEPTION 'Email nao cadastrado';
            END IF;
        END;
        $$ LANGUAGE PLPGSQL;

        CREATE OR REPLACE FUNCTION ADICIONAR_ADM(id_responsavel INTEGER, id_usuario INTEGER)
        RETURNS VOID AS $$
        BEGIN
            IF (id_usuario IS NULL) THEN
                RAISE EXCEPTION 'Id do usuario invalido';
            END IF;
            IF (id_responsavel IS NULL) THEN
                RAISE EXCEPTION 'Id do responsavel invalido';
            END IF;

            IF EXISTS (SELECT * FROM USUARIO WHERE id = id_usuario) THEN
                IF EXISTS (SELECT * FROM ADM WHERE id_usuario = id_usuario) THEN
                    RAISE EXCEPTION 'Usuario ja e um administrador';
                END IF;

                IF EXISTS (SELECT * FROM USUARIO WHERE id = id_responsavel) THEN
                    IF NOT EXISTS (SELECT * FROM ADM WHERE id_usuario = id_responsavel) THEN
                        RAISE EXCEPTION 'Responsavel nao e um administrador';
                    END IF;
                    INSERT INTO ADM (id_usuario, id_responsavel) VALUES (id_usuario, id_responsavel);
                ELSE
                    RAISE EXCEPTION 'Responsavel nao cadastrado';
                END IF;
            ELSE
                RAISE EXCEPTION 'Usuario nao cadastrado';
            END IF;
        END;
        $$ LANGUAGE PLPGSQL;
    `).catch(err => console.log(`Erro ao criar funcoes: ${err}`));
        client.query(`
        CREATE TABLE IF NOT EXISTS TAREFA (
            id VARCHAR PRIMARY KEY,
            titulo VARCHAR(150) NOT NULL,
            descricao VARCHAR(300) NOT NULL,
            data_criacao DATE DEFAULT CURRENT_DATE NOT NULL,
            DATA_CONCLUSAO DATE DEFAULT NULL,
            PRIORIDADE INTEGER DEFAULT 0 NOT NULL,
            STATUS CHAR(1) DEFAULT 'P' NOT NULL, -- P = Pendente, C = Concluida, A = Atrasada
            id_usuario VARCHAR NOT NULL,
            FOREIGN KEY (id_usuario) REFERENCES usuario(id)
        );
    `).catch(err => console.log(`Erro ao criar tabela tarefa: ${err}`));
        client.query(`
        CREATE OR REPLACE FUNCTION ADICIONAR_TAREFA(id_task varchar, titulo VARCHAR(150), descricao VARCHAR(300), id_usuario VARCHAR, prioridade INTEGER DEFAULT NULL, data_conclusao DATE DEFAULT NULL)
        RETURNS VOID AS $$
        BEGIN
            IF (titulo IS NULL OR descricao IS NULL OR id_usuario IS NULL OR id_task IS NULL) THEN
                RAISE EXCEPTION 'Titulo, descricao ou id do usuario invalidos';
            END IF;
            IF (data_conclusao IS NULL) THEN
                IF (prioridade IS NULL) THEN
                    INSERT INTO TAREFA (id, titulo, descricao, id_usuario) VALUES (id_task, titulo, descricao, id_usuario);
                ELSE
                    INSERT INTO TAREFA (id, titulo, descricao, id_usuario, prioridade) VALUES (id_task, titulo, descricao, id_usuario, prioridade);
                END IF;
            ELSE
                IF (prioridade IS NULL) THEN
                    INSERT INTO TAREFA (id, titulo, descricao, id_usuario, data_conclusao) VALUES (id_task, titulo, descricao, id_usuario, data_conclusao);
                ELSE
                    INSERT INTO TAREFA (id, titulo, descricao, id_usuario, data_conclusao, prioridade) VALUES (id_task, titulo, descricao, id_usuario, data_conclusao, prioridade);
                END IF;
            END IF;
        END;
        $$ LANGUAGE PLPGSQL;


        DROP FUNCTION IF EXISTS GET_TAREFAS;
        CREATE OR REPLACE FUNCTION GET_TAREFAS(id_do_usuario VARCHAR)
        RETURNS TABLE (id_tr VARCHAR, titulo_tr VARCHAR(150), descricao_tr VARCHAR(300), data_criacao_tr DATE, data_conclusao_tr DATE, prioridade_tr INTEGER, status_tr CHAR(1)) AS $$
        BEGIN
            IF (id_do_usuario IS NULL) THEN
                RAISE EXCEPTION 'Id do usuario invalido';
            END IF;

            IF EXISTS (SELECT * FROM USUARIO WHERE id = id_do_usuario) THEN
                RETURN QUERY SELECT id id_tr, titulo titulo_tr, descricao descricao_tr, data_criacao data_criacao_tr, data_conclusao data_conclusao_tr, prioridade prioridade_tr, status status_tr FROM TAREFA WHERE id_usuario = id_do_usuario;
            ELSE
                RAISE EXCEPTION 'Usuario nao cadastrado';
            END IF;
        END;
        $$ LANGUAGE PLPGSQL;

        CREATE OR REPLACE FUNCTION GET_TAREFA(id_tarefa VARCHAR, id_do_usuario VARCHAR)
        RETURNS TABLE (id_tr VARCHAR, titulo_tr VARCHAR(150), descricao_tr VARCHAR(300), data_criacao_tr DATE, data_conclusao_tr DATE, prioridade_tr INTEGER) AS $$
        BEGIN
            IF (id_tarefa IS NULL) THEN
                RAISE EXCEPTION 'Id da tarefa invalido';
            END IF;

            IF (id_do_usuario IS NULL) THEN
                RAISE EXCEPTION 'Id do usuario invalido';
            END IF;

            IF EXISTS (SELECT * FROM TAREFA WHERE id = id_tarefa and id_usuario = id_do_usuario) THEN
                RETURN QUERY SELECT id_tr, titulo_tr, descricao_tr, data_criacao_tr, data_conclusao_tr, prioridade_tr FROM TAREFA WHERE id = id_tarefa and  id_usuario = id_do_usuario;
            ELSE
                RAISE EXCEPTION 'Tarefa nao cadastrada ou nao pertence ao usuario';
            END IF;
        END;
        $$ LANGUAGE PLPGSQL;


        CREATE OR REPLACE FUNCTION EDITAR_TAREFA(ID_DO_USUARIO VARCHAR, id_tarefa VARCHAR, titulo_tr VARCHAR(150), descricao_tr VARCHAR(300), prioridade_tr INTEGER DEFAULT NULL, data_conclusao_tr DATE DEFAULT NULL)
        RETURNS VOID AS $$
        BEGIN
            IF (id_tarefa IS NULL) THEN
                RAISE EXCEPTION 'Id da tarefa invalido';
            END IF;

            IF (id_do_usuario IS NULL) THEN
                RAISE EXCEPTION 'Id do usuario invalido';
            END IF;

            IF EXISTS (SELECT * FROM TAREFA WHERE id = id_tarefa AND id_usuario != id_do_usuario) THEN
                RAISE EXCEPTION 'Usuario nao tem permissao para EDITAR esta tarefa';
            END IF;

            IF EXISTS (SELECT * FROM TAREFA WHERE id = id_tarefa AND id_usuario = id_do_usuario) THEN
                IF (titulo_tr IS NOT NULL) THEN
                    UPDATE TAREFA SET titulo = titulo_tr WHERE id = id_tarefa AND id_usuario = id_do_usuario;
                END IF;
                IF (descricao_tr IS NOT NULL) THEN
                    UPDATE TAREFA SET descricao = descricao_tr WHERE id = id_tarefa AND id_usuario = id_do_usuario;
                END IF;
                IF (data_conclusao_tr IS NOT NULL) THEN
                    UPDATE TAREFA SET data_conclusao = data_conclusao_tr WHERE id = id_tarefa AND id_usuario = id_do_usuario;
                END IF;
                IF (prioridade_tr IS NOT NULL) THEN
                    UPDATE TAREFA SET prioridade = prioridade_tr WHERE id = id_tarefa AND id_usuario = id_do_usuario;
                END IF;
            ELSE
                RAISE EXCEPTION 'Tarefa nao cadastrada';
            END IF;
        END;
        $$ LANGUAGE PLPGSQL;

        CREATE OR REPLACE FUNCTION DELETAR_TAREFA(id_tarefa VARCHAR, ID_DO_USUARIO VARCHAR)
        RETURNS VOID AS $$
        BEGIN
            IF (id_tarefa IS NULL) THEN
                RAISE EXCEPTION 'Id da tarefa invalido';
            END IF;

            IF (id_do_usuario IS NULL) THEN
                RAISE EXCEPTION 'Id do usuario invalido';
            END IF;

            IF EXISTS (SELECT * FROM TAREFA WHERE id = id_tarefa AND id_usuario != id_do_usuario ) THEN
                RAISE EXCEPTION 'Usuario nao tem permissao para deletar esta tarefa';
            END IF;

            IF EXISTS (SELECT * FROM TAREFA WHERE id = id_tarefa AND id_usuario = id_do_usuario) THEN
                DELETE FROM TAREFA WHERE id = id_tarefa AND id_usuario = id_do_usuario;
            ELSE
                RAISE EXCEPTION 'Tarefa nao cadastrada';
            END IF;
        END;
        $$ LANGUAGE PLPGSQL;

        CREATE OR REPLACE FUNCTION CONCLUIR_TAREFA(id_tarefa VARCHAR, id_do_usuario VARCHAR)
        RETURNS VOID AS $$
        BEGIN
            IF (id_tarefa IS NULL) THEN
                RAISE EXCEPTION 'Id da tarefa invalido';
            END IF;

            IF (id_do_usuario IS NULL) THEN
                RAISE EXCEPTION 'Id do usuario invalido';
            END IF;

            IF EXISTS (SELECT * FROM TAREFA WHERE id = id_tarefa AND id_usuario != id_do_usuario ) THEN
                RAISE EXCEPTION 'Usuario nao tem permissao para CONCLUIR esta tarefa';
            END IF;

            IF EXISTS (SELECT * FROM TAREFA WHERE id = id_tarefa AND id_usuario = id_do_usuario) THEN
                UPDATE TAREFA SET status = 'C' WHERE id = id_tarefa and  id_usuario = id_do_usuario;
            ELSE
                RAISE EXCEPTION 'Tarefa nao cadastrada';
            END IF;
        END;
        $$ LANGUAGE PLPGSQL;


        CREATE OR REPLACE FUNCTION DESCONCLUIR_TAREFA(id_tarefa VARCHAR, id_do_usuario VARCHAR)
        RETURNS VOID AS $$
        BEGIN
            IF (id_tarefa IS NULL) THEN
                RAISE EXCEPTION 'Id da tarefa invalido';
            END IF;

            IF (id_do_usuario IS NULL) THEN
                RAISE EXCEPTION 'Id do usuario invalido';
            END IF;

            IF EXISTS (SELECT * FROM TAREFA WHERE id = id_tarefa AND id_usuario != id_do_usuario ) THEN
                RAISE EXCEPTION 'Usuario nao tem permissao para DESCONCLUIR esta tarefa';
            END IF;

            IF EXISTS (SELECT * FROM TAREFA WHERE id = id_tarefa AND id_usuario = id_do_usuario) THEN
                IF (SELECT status FROM TAREFA WHERE id = id_tarefa AND id_usuario = id_do_usuario) = 'C' THEN
                    IF EXISTS (SELECT * FROM TAREFA WHERE id = id_tarefa AND id_usuario = id_do_usuario AND data_conclusao > CURRENT_DATE) THEN
                        UPDATE TAREFA SET status = 'A' WHERE id = id_tarefa and  id_usuario = id_do_usuario;
                    ELSE
                        UPDATE TAREFA SET status = 'P' WHERE id = id_tarefa and  id_usuario = id_do_usuario;
                    END IF;
                ELSE
                    RAISE EXCEPTION 'Tarefa nao esta concluida';
                END IF;
            ELSE
                RAISE EXCEPTION 'Tarefa nao cadastrada';
            END IF;
        END;
        $$ LANGUAGE PLPGSQL;

        CREATE OR REPLACE FUNCTION GET_USUARIOS(ID_RESPONSAVEL VARCHAR)
        RETURNS TABLE (id INTEGER, nome VARCHAR(150), email VARCHAR(150), senha VARCHAR(150), data_criacao DATE) AS $$
        BEGIN
            IF (ID_RESPONSAVEL IS NULL) THEN
                RAISE EXCEPTION 'Id do responsavel invalido';
            END IF;

            IF EXISTS (SELECT * FROM ADM WHERE id_usuario = ID_RESPONSAVEL) THEN
                RETURN QUERY SELECT id, nome, email, senha, data_criacao FROM USUARIO;
            ELSE
                RAISE EXCEPTION 'Usuario nao possui permissao para acessar essa funcao';
            END IF;
        END;
        $$ LANGUAGE PLPGSQL;

        CREATE OR REPLACE FUNCTION GET_TAREFAS_USUARIO(ID_RESPONSAVEL VARCHAR, ID_DO_USUARIO VARCHAR)
        RETURNS TABLE (id VARCHAR, titulo VARCHAR(150), descricao VARCHAR(300), data_criacao DATE, data_conclusao DATE, prioridade INTEGER) AS $$
        BEGIN
            IF (ID_RESPONSAVEL IS NULL OR ID_DO_USUARIO IS NULL) THEN
                RAISE EXCEPTION 'Id do responsavel ou id do usuario invalidos';
            END IF;

            IF EXISTS (SELECT * FROM ADM WHERE id_usuario = ID_RESPONSAVEL) THEN
                IF EXISTS (SELECT * FROM USUARIO WHERE id = ID_DO_USUARIO) THEN
                    RETURN QUERY SELECT id, titulo, descricao, data_criacao, data_conclusao, prioridade FROM TAREFA WHERE id_usuario = ID_DO_USUARIO;
                ELSE
                    RAISE EXCEPTION 'Usuario nao cadastrado';
                END IF;
            ELSE
                RAISE EXCEPTION 'Usuario nao possui permissao para acessar essa funcao';
            END IF;
        END;
        $$ LANGUAGE PLPGSQL;

        CREATE OR REPLACE FUNCTION GET_ALL_TAREFAS(ID_RESPONSAVEL INTEGER)
        RETURNS TABLE (id VARCHAR, titulo VARCHAR(150), descricao VARCHAR(300), data_criacao DATE, data_conclusao DATE, prioridade INTEGER) AS $$
        BEGIN
            IF (ID_RESPONSAVEL IS NULL) THEN
                RAISE EXCEPTION 'Id do responsavel invalido';
            END IF;

            IF EXISTS (SELECT * FROM ADM WHERE id_usuario = ID_RESPONSAVEL) THEN
                RETURN QUERY SELECT id, titulo, descricao, data_criacao, data_conclusao, prioridade FROM TAREFA;
            ELSE
                RAISE EXCEPTION 'Usuario nao possui permissao para acessar essa funcao';
            END IF;
        END;
        $$ LANGUAGE PLPGSQL;

        CREATE OR REPLACE FUNCTION GET_TAREFAS_PENDENTES(ID_RESPONSAVEL INTEGER)
        RETURNS TABLE (id VARCHAR, titulo VARCHAR(150), descricao VARCHAR(300), data_criacao DATE, data_conclusao DATE, prioridade INTEGER) AS $$
        BEGIN
            IF (ID_RESPONSAVEL IS NULL) THEN
                RAISE EXCEPTION 'Id do responsavel invalido';
            END IF;

            IF EXISTS (SELECT * FROM ADM WHERE id_usuario = ID_RESPONSAVEL) THEN
                RETURN QUERY SELECT id, titulo, descricao, data_criacao, data_conclusao, prioridade FROM TAREFA WHERE status = 'P';
            ELSE
                RAISE EXCEPTION 'Usuario nao possui permissao para acessar essa funcao';
            END IF;
        END;
        $$ LANGUAGE PLPGSQL;

        CREATE OR REPLACE FUNCTION GET_TAREFAS_CONCLUIDAS(ID_RESPONSAVEL INTEGER)
        RETURNS TABLE (id VARCHAR, titulo VARCHAR(150), descricao VARCHAR(300), data_criacao DATE, data_conclusao DATE, prioridade INTEGER) AS $$
        BEGIN
            IF (ID_RESPONSAVEL IS NULL) THEN
                RAISE EXCEPTION 'Id do responsavel invalido';
            END IF;

            IF EXISTS (SELECT * FROM ADM WHERE id_usuario = ID_RESPONSAVEL) THEN
                RETURN QUERY SELECT id, titulo, descricao, data_criacao, data_conclusao, prioridade FROM TAREFA WHERE status = 'C';
            ELSE
                RAISE EXCEPTION 'Usuario nao possui permissao para acessar essa funcao';
            END IF;

        END;
        $$ LANGUAGE PLPGSQL;

        CREATE OR REPLACE FUNCTION GET_TAREFAS_ATRASADAS(ID_RESPONSAVEL INTEGER)
        RETURNS TABLE (id VARCHAR, titulo VARCHAR(150), descricao VARCHAR(300), data_criacao DATE, data_conclusao DATE, prioridade INTEGER) AS $$
        BEGIN
            IF (ID_RESPONSAVEL IS NULL) THEN
                RAISE EXCEPTION 'Id do responsavel invalido';
            END IF;

            IF EXISTS (SELECT * FROM ADM WHERE id_usuario = ID_RESPONSAVEL) THEN
                RETURN QUERY SELECT id, titulo, descricao, data_criacao, data_conclusao, prioridade FROM TAREFA WHERE data_conclusao < CURRENT_DATE;
            ELSE
                RAISE EXCEPTION 'Usuario nao possui permissao para acessar essa funcao';
            END IF;
        END;
        $$ LANGUAGE PLPGSQL;

        CREATE OR REPLACE FUNCTION ATUALIZAR_TAREFAS()
        RETURNS VOID AS $$
        BEGIN
            UPDATE TAREFA SET status = 'A' WHERE status = 'P' AND data_conclusao > CURRENT_DATE;
            UPDATE TAREFA SET status = 'P' WHERE status = 'A' AND data_conclusao < CURRENT_DATE;
        END;
        $$ LANGUAGE PLPGSQL;

        `).catch((err) => {
            console.log(`Erro ao criar as funções referentes as tarefas: ${err}`);
        });
    }
    catch (error) {
        console.log(error);
    }
}))();
