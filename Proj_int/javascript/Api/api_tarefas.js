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
exports.desconcluir_tarefa = exports.editar_tarefa = exports.get_tarefa = exports.concluir_tarefa = exports.get_tarefas = exports.excluir_tarefa = exports.adicionar_tarefa = exports.get_email = void 0;
const Acessa_bd_1 = require("./Acessa_bd");
const uuid_1 = require("uuid");
const validastring = (...id) => {
    for (let i = 0; i < id.length; i++) {
        if (id[i] === '' || id[i] === undefined || id[i] === null) {
            return false;
        }
    }
    return true;
};
function get_email(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const retorno = yield Acessa_bd_1.client.query(`SELECT * FROM usuario WHERE token = $1`, [token]);
        if (retorno.rowCount === 0 || !retorno.rows[0].email) {
            console.log(retorno.rows[0]);
            return "";
        }
        const email = retorno.rows[0].email;
        return email;
    });
}
exports.get_email = get_email;
function adicionar_tarefa(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { token, titulo, descricao, data, prioridade } = req.body;
        if (!validastring(token, titulo, descricao, prioridade)) {
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
        if (data === undefined || data === null) {
            Acessa_bd_1.client.query(`SELECT ADICIONAR_TAREFA($1, $2, $3, $4, $5)`, [id, titulo, descricao, id_usuario, prioridade], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
                }
                return res.status(200).json({ id: id });
            });
        }
        else {
            Acessa_bd_1.client.query(`SELECT ADICIONAR_TAREFA($1, $2, $3, $4, $5, $6)`, [id, titulo, descricao, id_usuario, prioridade, new Date(data)], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
                }
                return res.status(200).json({ id: id });
            });
        }
    });
}
exports.adicionar_tarefa = adicionar_tarefa;
function editar_tarefa(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { token, id, titulo, descricao, data, prioridade } = req.body;
        if (!validastring(token, id, titulo, descricao, prioridade)) {
            return res.status(400).json({ erro: "Dados inválidos" });
        }
        const email = yield get_email(token);
        if (email === "") {
            return res.status(400).json({ erro: "Token inválido" });
        }
        const id_usuario = yield Acessa_bd_1.client.query(`SELECT GET_ID_USUARIO($1)`, [email]).then((result) => {
            return result.rows[0].get_id_usuario;
        }).catch((err) => {
            return res.status(500).json({ erro: err.message });
        });
        if (data === undefined || data === null) {
            Acessa_bd_1.client.query(`SELECT EDITAR_TAREFA($1, $2, $3, $4, $5, NULL)`, [id_usuario, id, titulo, descricao, prioridade], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
                }
                return res.status(200).json({ id: id });
            });
        }
        else {
            Acessa_bd_1.client.query(`SELECT EDITAR_TAREFA($1, $2, $3, $4, $5, $6)`, [id_usuario, id, titulo, descricao, prioridade, data], (err, result) => {
                if (err) {
                    return res.status(500).json({ erro: err.message });
                }
                return res.status(200).json({ id: id });
            });
        }
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
            return res.status(500).json({ erro: err.message });
        });
        Acessa_bd_1.client.query(`SELECT DELETAR_TAREFA($1, $2)`, [id, id_usuario], (err, result) => {
            if (err) {
                return res.status(500).json({ erro: err.message });
            }
            return res.sendStatus(204);
        });
    });
}
exports.excluir_tarefa = excluir_tarefa;
function get_tarefas(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { token, ordenacao, pagina, pesquisa } = req.body;
        if (!validastring(token, ordenacao, pagina)) {
            return res.status(400).json({ erro: "Dados inválidos" });
        }
        const email = yield get_email(token);
        if (email === "") {
            return res.status(400).json({ erro: "Token inválido" });
        }
        const id_usuario = yield Acessa_bd_1.client.query(`SELECT GET_ID_USUARIO($1)`, [email]).then((result) => {
            return result.rows[0].get_id_usuario;
        }).catch((err) => {
            return res.status(500).json({ erro: err.message });
        });
        const tarefas = yield Acessa_bd_1.client.query(`SELECT * FROM TAREFA WHERE ID_USUARIO = $1`, [id_usuario]).then((result) => {
            return result.rows;
        }).catch((err) => {
            return res.status(500).json({ erro: err.message });
        });
        if (tarefas === undefined || tarefas === null || tarefas.length === 0) {
            return res.status(200).json({ tarefas: [] });
        }
        if (ordenacao === "conclusao") {
            for (let i = 0; i < tarefas.length; i++) {
                for (let j = 0; j < tarefas.length; j++) {
                    if (tarefas[i].data_conclusao > tarefas[j].data_conclusao) {
                        let aux = tarefas[i];
                        tarefas[i] = tarefas[j];
                        tarefas[j] = aux;
                    }
                }
            }
        }
        else if (ordenacao === "prioridade") {
            for (let i = 0; i < tarefas.length; i++) {
                for (let j = 0; j < tarefas.length; j++) {
                    if (tarefas[i].prioridade > tarefas[j].prioridade) {
                        let aux = tarefas[i];
                        tarefas[i] = tarefas[j];
                        tarefas[j] = aux;
                    }
                }
            }
        }
        else if (ordenacao === "criacao") { // ordena por data de criação de forma decrescente (mais recente para mais antiga)
            for (let i = 0; i < tarefas.length; i++) {
                for (let j = 0; j < tarefas.length; j++) {
                    if (tarefas[i].data_criacao < tarefas[j].data_criacao) {
                        let aux = tarefas[i];
                        tarefas[i] = tarefas[j];
                        tarefas[j] = aux;
                    }
                }
            }
        }
        let retorno_tarefas = []; // organiza as tarefas de 3 em 3
        let count = 0;
        let total = 0;
        let tarefas_aux = [];
        for (let tarefa of tarefas) {
            let tarefa_aux = {
                id: tarefa.id,
                titulo: tarefa.titulo,
                descricao: tarefa.descricao,
                data_criacao: tarefa.data_criacao,
                prioridade: tarefa.prioridade,
                data_conclusao: tarefa.data_conclusao,
                status: tarefa.status
            };
            tarefas_aux.push(tarefa_aux);
            count++;
            total++;
            if (count === 3 || tarefas.length === 1 || (tarefas.length === 2 && count === 2) || total === tarefas.length) {
                retorno_tarefas.push(tarefas_aux);
                tarefas_aux = [];
                count = 0;
            }
        }
        let p = parseInt(pagina) - 1;
        if (p > retorno_tarefas.length || isNaN(p)) {
            return res.status(200).json({ tarefas: [] });
        }
        if (validastring(pesquisa)) {
            let tarefas_aux = [];
            let retorno_tarefas_aux = [];
            for (let tarefas of retorno_tarefas) {
                for (let tarefa of tarefas) {
                    if (tarefa.titulo.includes(pesquisa) || tarefa.descricao.includes(pesquisa)) {
                        tarefas_aux.push(tarefa);
                    }
                }
                if (tarefas_aux.length > 0) {
                    retorno_tarefas_aux.push(tarefas_aux);
                }
                tarefas_aux = [];
            }
            retorno_tarefas = retorno_tarefas_aux;
        }
        if (p > retorno_tarefas.length || isNaN(p)) {
            return res.status(200).json({ tarefas: [] });
        }
        // console.log(retorno_tarefas);
        return res.status(200).json({ tarefas: retorno_tarefas[p], total: retorno_tarefas.length });
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
            return res.status(500).json({ erro: err.message });
        });
        Acessa_bd_1.client.query(`SELECT CONCLUIR_TAREFA($1, $2)`, [id, id_usuario], (err, result) => {
            if (err) {
                return res.status(500).json({ erro: err.message });
            }
            return res.sendStatus(200);
        });
    });
}
exports.concluir_tarefa = concluir_tarefa;
function desconcluir_tarefa(req, res) {
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
            return res.status(500).json({ erro: err.message });
        });
        Acessa_bd_1.client.query(`SELECT DESCONCLUIR_TAREFA($1, $2)`, [id, id_usuario], (err, result) => {
            if (err) {
                return res.status(500).json({ erro: err.message });
            }
            return res.sendStatus(200);
        });
    });
}
exports.desconcluir_tarefa = desconcluir_tarefa;
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
            return res.status(500).json({ erro: err.message });
        });
        const tarefa = yield Acessa_bd_1.client.query(`SELECT GET_TAREFA($1, $2)`, [id, id_usuario], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ erro: err });
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
setInterval(() => {
    //atualizar tarefas a cada 24 horas
    Acessa_bd_1.client.query(`SELECT ATUALIZAR_TAREFAS()`, (err, result) => {
        if (err) {
            console.log(err);
        }
    });
}, 86400000 //24 horas
);
