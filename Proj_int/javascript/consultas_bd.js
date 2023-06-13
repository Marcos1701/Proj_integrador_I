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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComentario = exports.updateComentario = exports.retrieveAllComentariostoPostagem = exports.retrieveComentario = exports.insertComentario = exports.curtirPostagem = exports.deletePostagem = exports.updatePostagem = exports.retrieveAllPostagens = exports.retrievePostagem = exports.insertPostagem = void 0;
const conf_bd_pg_js_1 = require("./conf_bd_pg.js");
const uuid_1 = require("uuid");
const validastring = (id) => {
    if (id === '' || id === undefined || id === null) {
        return false;
    }
    return true;
};
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield conf_bd_pg_js_1.client.connect();
        yield conf_bd_pg_js_1.client.query(`
        CREATE TABLE IF NOT EXISTS postagens (
         id varchar not null PRIMARY KEY,
         title varchar NOT NULL,
         text varchar NOT NULL,
         likes INT,
         data_criacao DATE DEFAULT CURRENT_DATE
        )
    `);
        yield conf_bd_pg_js_1.client.query(`
    CREATE TABLE IF NOT EXISTS comentarios (
        id varchar PRIMARY KEY,
        text varchar NOT NULL,
        postagem_id varchar NOT NULL,
        data_criacao DATE DEFAULT CURRENT_DATE,
        FOREIGN KEY (postagem_id) REFERENCES postagens(id)
    );
    `);
        console.log("Banco de dados conectado com sucesso!!");
        // console.log("Tabelas criadas com sucesso!")
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(`Erro ao criar tabelas: ${err.message}`);
        }
    }
}))();
function insertPostagem(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title, text, like } = req.body;
        const likes = Number(like);
        try {
            yield conf_bd_pg_js_1.client.query(`
        INSERT INTO postagens VALUES ('${(0, uuid_1.v4)()}','${title}', '${text}',${(!isNaN(likes)) ? likes : 0} , DEFAULT)`);
            res.sendStatus(201);
        }
        catch (err) {
            if (err instanceof Error) {
                console.log(`Erro ao inserir postagem: ${err.message}`);
                res.sendStatus(400);
            }
        }
    });
}
exports.insertPostagem = insertPostagem;
function retrievePostagem(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        if (!validastring(id)) {
            res.sendStatus(400);
        }
        try {
            const postagem = yield conf_bd_pg_js_1.client.query(`
        SELECT * FROM postagens WHERE id = '${id}'`);
            res.json({ "postagem": postagem.rows });
        }
        catch (err) {
            if (err instanceof Error) {
                console.log(`Erro ao buscar postagem: ${err.message}`);
                res.sendStatus(400);
            }
        }
    });
}
exports.retrievePostagem = retrievePostagem;
function retrieveAllPostagens(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const postagens = yield conf_bd_pg_js_1.client.query(`
        SELECT * FROM postagens`);
            res.json({ "postagens": postagens.rows });
        }
        catch (err) {
            if (err instanceof Error) {
                console.log(`Erro ao buscar postagens: ${err.message}`);
                res.sendStatus(400);
            }
        }
    });
}
exports.retrieveAllPostagens = retrieveAllPostagens;
function updatePostagem(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        let { title, text, likes } = req.body;
        likes = parseInt(likes);
        if (!validastring(text) && validastring(likes) && validastring(likes) || !validastring(id)) {
            res.sendStatus(400);
        }
        try {
            if (likes && title && text && !isNaN(likes)) {
                yield conf_bd_pg_js_1.client.query(`
            UPDATE postagens SET title = '${title}', text = '${text}', likes = ${likes} WHERE id = '${id}'`);
            }
            else if (!isNaN(likes)) {
                yield conf_bd_pg_js_1.client.query(`
            UPDATE postagens SET text = '${text}', likes = ${likes} WHERE id = '${id}'`);
            }
            else {
                yield conf_bd_pg_js_1.client.query(`
            UPDATE postagens SET text = '${text}' WHERE id = '${id}'`);
            }
            res.sendStatus(200);
        }
        catch (err) {
            if (err instanceof Error) {
                console.log(`Erro ao atualizar postagem: ${err.message}`);
                res.sendStatus(400);
            }
        }
    });
}
exports.updatePostagem = updatePostagem;
function deletePostagem(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        if (!validastring(id)) {
            res.sendStatus(400);
        }
        try {
            yield conf_bd_pg_js_1.client.query(`
        DELETE FROM postagens WHERE id = '${id}'`);
            res.sendStatus(204);
        }
        catch (err) {
            if (err instanceof Error) {
                console.log(`Erro ao deletar postagem: ${err.message}`);
                res.sendStatus(400);
            }
        }
    });
}
exports.deletePostagem = deletePostagem;
function curtirPostagem(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        if (!validastring(id)) {
            res.sendStatus(400);
        }
        try {
            yield conf_bd_pg_js_1.client.query(`
        UPDATE postagens SET likes = likes + 1 WHERE id = '${id}'`);
            const likes = yield conf_bd_pg_js_1.client.query(`
        SELECT likes FROM postagens WHERE id = '${id}'`);
            res.sendStatus(200).json({ "likes": likes.rows });
        }
        catch (err) {
            if (err instanceof Error) {
                console.log(`Erro ao curtir postagem: ${err.message}`);
                res.sendStatus(400);
            }
        }
    });
}
exports.curtirPostagem = curtirPostagem;
function insertComentario(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const { text } = req.body;
        if (!validastring(id) || !text || text === '') {
            res.sendStatus(400);
        }
        try {
            yield conf_bd_pg_js_1.client.query(`
        INSERT INTO comentarios VALUES ('${(0, uuid_1.v4)()}', '${text}', '${id}', DEFAULT)`);
            res.sendStatus(201);
        }
        catch (err) {
            if (err instanceof Error) {
                console.log(`Erro ao inserir comentario: ${err.message}`);
                res.sendStatus(400);
            }
        }
    });
}
exports.insertComentario = insertComentario;
function retrieveComentario(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, id_comentario } = req.params;
        if (!validastring(id) || !validastring(id_comentario)) {
            res.sendStatus(400);
        }
        try {
            yield conf_bd_pg_js_1.client.query(`
        SELECT * FROM comentarios WHERE id = '${id_comentario}' and postagem_id = '${id}'`)
                .then((comentario) => {
                res.json({ "comentario": comentario.rows });
            });
        }
        catch (err) {
            if (err instanceof Error) {
                console.log(`Erro ao buscar comentario: ${err.message}`);
                res.sendStatus(400);
            }
        }
    });
}
exports.retrieveComentario = retrieveComentario;
function retrieveAllComentariostoPostagem(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        if (!validastring(id)) {
            res.sendStatus(400);
        }
        try {
            const comentarios = yield conf_bd_pg_js_1.client.query(`
        SELECT * FROM comentarios WHERE postagem_id = '${id}'`);
            res.json({ "comentarios": comentarios.rows });
        }
        catch (err) {
            if (err instanceof Error) {
                console.log(`Erro ao buscar comentarios: ${err.message}`);
                res.sendStatus(400);
            }
        }
    });
}
exports.retrieveAllComentariostoPostagem = retrieveAllComentariostoPostagem;
function updateComentario(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, id_comentario } = req.params;
        const { text } = req.body;
        if (!text || !validastring(id_comentario) || !validastring(id)) {
            res.sendStatus(400);
        }
        try {
            yield conf_bd_pg_js_1.client.query(`
        UPDATE comentarios SET text = '${text}' WHERE id = '${id_comentario}' and postagem_id = '${id}'`);
            res.sendStatus(200);
        }
        catch (err) {
            if (err instanceof Error) {
                console.log(`Erro ao atualizar comentario: ${err.message}`);
                res.sendStatus(400);
            }
        }
    });
}
exports.updateComentario = updateComentario;
function deleteComentario(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, id_comentario } = req.params;
        if (!validastring(id_comentario) || !validastring(id)) {
            res.sendStatus(400);
        }
        try {
            yield conf_bd_pg_js_1.client.query(`
        DELETE FROM comentarios WHERE id = '${id_comentario}' and postagem_id = '${id}'`);
            res.sendStatus(204);
        }
        catch (err) {
            if (err instanceof Error) {
                console.log(`Erro ao deletar comentario: ${err.message}`);
                res.sendStatus(400);
            }
        }
    });
}
exports.deleteComentario = deleteComentario;
