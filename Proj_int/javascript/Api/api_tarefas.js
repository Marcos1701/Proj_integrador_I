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
exports.editar_tarefa = exports.get_tarefa = exports.concluir_tarefa = exports.get_tarefas = exports.excluir_tarefa = exports.adicionar_tarefa = void 0;
const Acessa_bd_1 = require("./Acessa_bd");
const uuid_1 = require("uuid");
const validastring = (...id) => {
    for (let i = 0; i < id.length; i++) {
        if (id[i] === '' || id[i] === undefined || id[i] === null) {
            return false;
        }
        return true;
    }
};
function get_email(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const retorno = yield Acessa_bd_1.client.query(`SELECT email FROM usuarios WHERE token = $1`, [token]);
        const email = retorno.rows[0].email;
        if (email === undefined || email === null) {
            return "";
        }
        return email;
    });
}
function adicionar_tarefa(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { token, titulo, descricao, data_final, prioridade } = req.body;
        if (!validastring(token, titulo, descricao, data_final, prioridade)) {
            return res.status(400).json({ erro: "Dados inválidos" });
        }
        const email = yield get_email(token);
        if (email === "") {
            return res.status(400).json({ erro: "Token inválido" });
        }
        const id_usuario = yield Acessa_bd_1.client.query(`SELECT GET_ID_USUARIO($1)`, [email]).then((result) => {
            return result.rows[0].get_id_usuario;
        }).catch((err) => {
            console.log(err);
            return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
        });
        const id = (0, uuid_1.v4)();
        Acessa_bd_1.client.query(`SELECT ADICIONAR_TAREFA($1, $2, $3, $4, $5, $6)`, [id, titulo, descricao, id_usuario, data_final, prioridade], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
            }
            return res.status(200).json({ id: id });
        });
    });
}
exports.adicionar_tarefa = adicionar_tarefa;
function editar_tarefa(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { token, id, titulo, descricao, data_final, prioridade } = req.body;
        if (!validastring(token, id, titulo, descricao, data_final, prioridade)) {
            return res.status(400).json({ erro: "Dados inválidos" });
        }
        const email = yield get_email(token);
        if (email === "") {
            return res.status(400).json({ erro: "Token inválido" });
        }
        const id_usuario = yield Acessa_bd_1.client.query(`SELECT GET_ID_USUARIO($1)`, [email]).then((result) => {
            return result.rows[0].get_id_usuario;
        }).catch((err) => {
            console.log(err);
            return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
        });
        Acessa_bd_1.client.query(`SELECT EDITAR_TAREFA($1, $2, $3, $4, $5, $6)`, [id_usuario, id, titulo, descricao, data_final, prioridade], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
            }
            return res.status(200).json({ id: id });
        });
    });
}
exports.editar_tarefa = editar_tarefa;
function excluir_tarefa(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { token, id } = req.body;
        if (!validastring(token, id)) {
            return res.status(400).json({ erro: "Dados inválidos" });
        }
        const email = yield get_email(token);
        if (email === "") {
            return res.status(400).json({ erro: "Token inválido" });
        }
        const id_usuario = yield Acessa_bd_1.client.query(`SELECT GET_ID_USUARIO($1)`, [email]).then((result) => {
            return result.rows[0].get_id_usuario;
        }).catch((err) => {
            console.log(err);
            return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
        });
        Acessa_bd_1.client.query(`SELECT DELETAR_TAREFA($1, $2)`, [id, id_usuario], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
            }
            return res.status(204);
        });
    });
}
exports.excluir_tarefa = excluir_tarefa;
function get_tarefas(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { token, ordenacao } = req.body;
        if (!validastring(token, ordenacao)) {
            return res.status(400).json({ erro: "Dados inválidos" });
        }
        const email = yield get_email(token);
        if (email === "") {
            return res.status(400).json({ erro: "Token inválido" });
        }
        const id_usuario = yield Acessa_bd_1.client.query(`SELECT GET_ID_USUARIO($1)`, [email]).then((result) => {
            return result.rows[0].get_id_usuario;
        }).catch((err) => {
            console.log(err);
            return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
        });
        const tarefas = yield Acessa_bd_1.client.query(`SELECT GET_TAREFAS($1)`, [id_usuario], (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
                return null;
            }
            return result.rows[0].get_tarefas;
        });
        if (tarefas === undefined || tarefas === null) {
            return res.status(200).json({ tarefas: [] });
        }
        if (ordenacao === "conclusao") {
            tarefas.sort((a, b) => {
                if (a.DATA_CONCLUSAO > b.DATA_CONCLUSAO) {
                    return 1;
                }
                if (a.DATA_CONCLUSAO < b.DATA_CONCLUSAO) {
                    return -1;
                }
                return 0;
            });
        }
        else if (ordenacao === "prioridade") {
            tarefas.sort((a, b) => {
                if (a.PRIORIDADE > b.PRIORIDADE) {
                    return 1;
                }
                if (a.PRIORIDADE < b.PRIORIDADE) {
                    return -1;
                }
                return 0;
            });
        }
        else if (ordenacao === "criacao") {
            tarefas.sort((a, b) => {
                if (a.DATA_CRIACAO > b.DATA_CRIACAO) {
                    return 1;
                }
                if (a.DATA_CRIACAO < b.DATA_CRIACAO) {
                    return -1;
                }
                return 0;
            });
        }
        let retorno_tarefas = []; // organiza as tarefas de 3 em 3
        for (let i = 0; i < tarefas.length; i += 3) {
            let tarefa = tarefas.slice(i, i + 3);
            retorno_tarefas.push(tarefa);
        }
        return res.status(200).json({ tarefas: retorno_tarefas });
    });
}
exports.get_tarefas = get_tarefas;
function concluir_tarefa(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { token, id } = req.body;
        if (!validastring(token, id)) {
            return res.status(400).json({ erro: "Dados inválidos" });
        }
        const email = yield get_email(token);
        if (email === "") {
            return res.status(400).json({ erro: "Token inválido" });
        }
        const id_usuario = yield Acessa_bd_1.client.query(`SELECT GET_ID_USUARIO($1)`, [email]).then((result) => {
            return result.rows[0].get_id_usuario;
        }).catch((err) => {
            console.log(err);
            return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
        });
        Acessa_bd_1.client.query(`SELECT CONCLUIR_TAREFA($1, $2)`, [id, id_usuario], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
            }
            return res.status(200);
        });
    });
}
exports.concluir_tarefa = concluir_tarefa;
function get_tarefa(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { token, id } = req.body;
        if (!validastring(token, id)) {
            return res.status(400).json({ erro: "Dados inválidos" });
        }
        const email = yield get_email(token);
        if (email === "") {
            return res.status(400).json({ erro: "Token inválido" });
        }
        const id_usuario = yield Acessa_bd_1.client.query(`SELECT GET_ID_USUARIO($1)`, [email]).then((result) => {
            return result.rows[0].get_id_usuario;
        }).catch((err) => {
            console.log(err);
            return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
        });
        const tarefa = yield Acessa_bd_1.client.query(`SELECT GET_TAREFA($1, $2)`, [id, id_usuario], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
            }
            return result.rows[0].get_tarefa;
        });
        if (tarefa === undefined || tarefa === null) {
            return res.status(200).json({ tarefa: [] });
        }
        return res.status(200).json({ tarefa: tarefa });
    });
}
exports.get_tarefa = get_tarefa;
