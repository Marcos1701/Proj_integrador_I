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
client.connect();
(() => __awaiter(void 0, void 0, void 0, function* () {
    client.query(`
    CREATE TABLE IF NOT EXISTS metodo_login(
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL
    );
    `);
    client.query(`
    CREATE TABLE IF NOT EXISTS usuario (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        senha VARCHAR(255),
        id_metodo_login INTEGER NOT NULL,
        FOREIGN KEY (id_metodo_login) REFERENCES metodo_login(id)
        );
     `);
    client.query(`
    CREATE TABLE IF NOT EXISTS ADM (
        id_usuario INTEGER PRIMARY KEY,
        id_responsavel INTEGER NOT NULL,
        FOREIGN KEY (id_usuario) REFERENCES usuario(id),
        FOREIGN KEY (id_responsavel) REFERENCES usuario(id)
    );
    `);
    client.query(`
        CREATE OR REPLACE FUNCTION ADICIONAR_USUARIO(nome VARCHAR(255), email VARCHAR(255), id_metodo_login INTEGER, senha VARCHAR(255) DEFAULT NULL)
        RETURNS VOID AS $$
        BEGIN   
            IF (NOME IS NULL OR EMAIL IS NULL OR id_metodo_login IS NULL) THEN
                RAISE EXCEPTION 'Nome, email ou metodo de login invalido';
            END IF;
            IF EXISTS (SELECT * FROM USUARIO WHERE email = email) THEN
                RAISE EXCEPTION 'Email ja cadastrado';
            END IF;

            IF (senha IS NULL) THEN
                IF NOT EXISTS (SELECT * FROM METODO_LOGIN WHERE id = id_metodo_login AND NOME ILIKE 'GOOGLE') THEN
                    RAISE EXCEPTION 'Metodo de login invalido';
                END IF;
                INSERT INTO usuario (nome, email, id_metodo_login) VALUES (nome, email, id_metodo_login);
            ELSE
                INSERT INTO usuario (nome, email, senha, id_metodo_login) VALUES (nome, email, senha, id_metodo_login);
            END IF;
        END;
        $$ LANGUAGE PLPGSQL;

        CREATE OR REPLACE FUNCTION VALIDA_LOGIN(email VARCHAR(255), senha VARCHAR(255))
        RETURNS BOOLEAN AS $$
        BEGIN
            IF (email IS NULL OR senha IS NULL) THEN
                RAISE EXCEPTION 'Email ou senha invalidos'; 
            END IF;
            IF EXISTS (SELECT * FROM USUARIO WHERE email = email AND senha = senha) THEN
                RETURN TRUE;
            ELSE
                RETURN FALSE;
            END IF;
        END;
        $$ LANGUAGE PLPGSQL;

        CREATE OR REPLACE FUNCTION GET_ID_USUARIO(email VARCHAR(255))
        RETURNS INTEGER AS $$
        BEGIN
            IF (email IS NULL) THEN
                RAISE EXCEPTION 'Email invalido';
            END IF;
            IF EXISTS (SELECT * FROM USUARIO WHERE email = email) THEN
                RETURN (SELECT id FROM USUARIO WHERE email = email);
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
    `);
    client.query(`
        CREATE IF NOT EXISTS TABLE TAREFA (
            id VARCHAR PRIMARY KEY,
            titulo VARCHAR(150) NOT NULL,
            descricao VARCHAR(300) NOT NULL,
            data_criacao DATE DEFAULT CURRENT_DATE NOT NULL,
            DATA_CONCLUSAO DATE,
            PRIORIDADE INTEGER DEFAULT 0 NOT NULL,
            id_usuario INTEGER NOT NULL,
            FOREIGN KEY (id_usuario) REFERENCES usuario(id)
        );
    `);
    client.query(`
        CREATE OR REPLACE FUNCTION ADICIONAR_TAREFA(titulo VARCHAR(150), descricao VARCHAR(300), id_usuario INTEGER, data_conclusao DATE DEFAULT NULL, prioridade INTEGER DEFAULT NULL)
        RETURNS VOID AS $$
        BEGIN
            IF (titulo IS NULL OR descricao IS NULL OR id_usuario IS NULL) THEN
                RAISE EXCEPTION 'Titulo, descricao ou id do usuario invalidos';
            END IF;
            IF (data_conclusao IS NULL) THEN
                IF (prioridade IS NULL) THEN
                    INSERT INTO TAREFA (titulo, descricao, id_usuario) VALUES (titulo, descricao, id_usuario);
                ELSE
                    INSERT INTO TAREFA (titulo, descricao, id_usuario, prioridade) VALUES (titulo, descricao, id_usuario, prioridade);
                END IF;
            ELSE
                IF (prioridade IS NULL) THEN
                    INSERT INTO TAREFA (titulo, descricao, id_usuario, data_conclusao) VALUES (titulo, descricao, id_usuario, data_conclusao);
                ELSE
                    INSERT INTO TAREFA (titulo, descricao, id_usuario, data_conclusao, prioridade) VALUES (titulo, descricao, id_usuario, data_conclusao, prioridade);
                END IF;
            END IF;
        END;
        $$ LANGUAGE PLPGSQL;
        `);
}))().catch(e => console.error(e.message, e.stack));
