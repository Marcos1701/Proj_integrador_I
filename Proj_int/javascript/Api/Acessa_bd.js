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
        CREATE OR REPLACE FUNCTION ADICIONAR_USUARIO(nome_usuario VARCHAR(255), email_usuario VARCHAR(255), id_metodo_login INTEGER, token_usuario varchar, senha_usuario VARCHAR(255) DEFAULT NULL)
        RETURNS VOID AS $$
        BEGIN   
        IF (nome_usuario IS NULL OR email_usuario IS NULL OR id_metodo_login IS NULL OR token_usuario IS NULL) THEN
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
                INSERT INTO usuario (nome, email, id_metodo_login, token) VALUES (nome_usuario, email_usuario, id_metodo_login, token_usuario);
            ELSE
                INSERT INTO usuario (nome, email, senha, id_metodo_login, token) VALUES (nome_usuario, email_usuario, senha_usuario, id_metodo_login, token_usuario);
            END IF;
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

        CREATE OR REPLACE FUNCTION GET_ID_USUARIO(email_usuario VARCHAR(255))
        RETURNS INTEGER AS $$
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
        CREATE OR REPLACE FUNCTION ADICIONAR_TAREFA(id_task varchar, titulo VARCHAR(150), descricao VARCHAR(300), id_usuario INTEGER, data_conclusao DATE DEFAULT NULL, prioridade INTEGER DEFAULT NULL)
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

        CREATE OR REPLACE FUNCTION GET_TAREFAS(id_do_usuario INTEGER)
        RETURNS TABLE (id VARCHAR, titulo VARCHAR(150), descricao VARCHAR(300), data_criacao DATE, data_conclusao DATE, prioridade INTEGER) AS $$
        BEGIN
            IF (id_do_usuario IS NULL) THEN
                RAISE EXCEPTION 'Id do usuario invalido';
            END IF;

            IF EXISTS (SELECT * FROM USUARIO WHERE id = id_do_usuario) THEN
                RETURN QUERY SELECT id, titulo, descricao, data_criacao, data_conclusao, prioridade FROM TAREFA WHERE id_usuario = id_do_usuario;
            ELSE
                RAISE EXCEPTION 'Usuario nao cadastrado';
            END IF;
        END;
        $$ LANGUAGE PLPGSQL;

        CREATE OR REPLACE FUNCTION GET_TAREFA(id_tarefa VARCHAR, id_do_usuario INTEGER)
        RETURNS TABLE (id VARCHAR, titulo VARCHAR(150), descricao VARCHAR(300), data_criacao DATE, data_conclusao DATE, prioridade INTEGER) AS $$
        BEGIN
            IF (id IS NULL) THEN
                RAISE EXCEPTION 'Id da tarefa invalido';
            END IF;

            IF (id_do_usuario IS NULL) THEN
                RAISE EXCEPTION 'Id do usuario invalido';
            END IF;

            IF EXISTS (SELECT * FROM TAREFA WHERE id = id_tarefa and id_usuario = id_do_usuario) THEN
                RETURN QUERY SELECT id, titulo, descricao, data_criacao, data_conclusao, prioridade FROM TAREFA WHERE id = id_tarefa and  id_usuario = id_do_usuario;
            ELSE
                RAISE EXCEPTION 'Tarefa nao cadastrada ou nao pertence ao usuario';
            END IF;
        END;
        $$ LANGUAGE PLPGSQL;

        CREATE OR REPLACE FUNCTION EDITAR_TAREFA(ID_DO_USUARIO VARCHAR, id_tarefa VARCHAR, titulo VARCHAR(150), descricao VARCHAR(300), data_conclusao DATE DEFAULT NULL, prioridade INTEGER DEFAULT NULL)
        RETURNS VOID AS $$
        BEGIN
            IF (id_tarefa IS NULL) THEN
                RAISE EXCEPTION 'Id da tarefa invalido';
            END IF;

            IF (id_do_usuario IS NULL) THEN
                RAISE EXCEPTION 'Id do usuario invalido';
            END IF;

            IF EXISTS (SELECT * FROM TAREFA WHERE id = id_tarefa AND id_usuario = id_do_usuario) THEN
                IF (titulo IS NOT NULL) THEN
                    UPDATE TAREFA SET titulo = titulo WHERE id = id_tarefa AND id_usuario = id_do_usuario;
                END IF;
                IF (descricao IS NOT NULL) THEN
                    UPDATE TAREFA SET descricao = descricao WHERE id = id_tarefa AND id_usuario = id_do_usuario;
                END IF;
                IF (data_conclusao IS NOT NULL) THEN
                    UPDATE TAREFA SET data_conclusao = data_conclusao WHERE id = id_tarefa AND id_usuario = id_do_usuario;
                END IF;
                IF (prioridade IS NOT NULL) THEN
                    UPDATE TAREFA SET prioridade = prioridade WHERE id = id_tarefa AND id_usuario = id_do_usuario;
                END IF;
            ELSE
                RAISE EXCEPTION 'Tarefa nao cadastrada OU USUARIO NAO TEM PERMISSAO PARA EDITAR ESTA TAREFA';
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

            IF EXISTS (SELECT * FROM TAREFA WHERE id = id_tarefa AND id_usuario = id_do_usuario) THEN
                DELETE FROM TAREFA WHERE id = id_tarefa AND id_usuario = id_do_usuario;
            ELSE
                RAISE EXCEPTION 'Tarefa nao cadastrada OU USUARIO NAO TEM PERMISSAO PARA DELETAR ESTA TAREFA';
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

            IF EXISTS (SELECT * FROM TAREFA WHERE id = id_tarefa AND id_usuario = id_do_usuario) THEN
                UPDATE TAREFA SET status = 'C' WHERE id = id_tarefa and  id_usuario = id_do_usuario;
            ELSE
                RAISE EXCEPTION 'Tarefa nao cadastrada OU USUARIO NAO TEM PERMISSAO PARA CONCLUIR ESTA TAREFA';
            END IF;
        END;
        $$ LANGUAGE PLPGSQL;

        CREATE OR REPLACE FUNCTION GET_USUARIOS(ID_RESPONSAVEL INTEGER)
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

        CREATE OR REPLACE FUNCTION GET_TAREFAS_USUARIO(ID_RESPONSAVEL INTEGER, ID_DO_USUARIO INTEGER)
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
        `).catch((err) => {
            console.log(`Erro ao criar as funções referentes as tarefas: ${err}`);
        });
    }
    catch (error) {
        console.log(error);
    }
}))();
