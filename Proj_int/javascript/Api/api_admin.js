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
exports.get_tarefas_atrasadas = exports.get_tarefas_concluidas = exports.get_tarefas_pendentes = exports.get_tarefas_usuario = exports.get_all_tarefas = exports.adicionar_admin = exports.get_usuarios = void 0;
const Acessa_bd_1 = require("./Acessa_bd");
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
function get_usuarios(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        if (!validastring(token)) {
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
        Acessa_bd_1.client.query(`SELECT GET_USUARIOS($1)`, [id_usuario], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
            }
            return res.status(200).json({ usuarios: result.rows[0].get_usuarios });
        });
    });
}
exports.get_usuarios = get_usuarios;
function adicionar_admin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { token, id_usuario } = req.body;
        if (!validastring(token, id_usuario)) {
            return res.status(400).json({ erro: "Dados inválidos" });
        }
        const email = yield get_email(token);
        if (email === "") {
            return res.status(400).json({ erro: "Token inválido" });
        }
        const id_admin = yield Acessa_bd_1.client.query(`SELECT GET_ID_USUARIO($1)`, [email]).then((result) => {
            return result.rows[0].get_id_usuario;
        }).catch((err) => {
            console.log(err);
            return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
        });
        Acessa_bd_1.client.query(`SELECT ADICIONAR_ADM($1, $2)`, [id_admin, id_usuario], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
            }
            return res.status(200);
        });
    });
}
exports.adicionar_admin = adicionar_admin;
function get_tarefas_usuario(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { token, id_usuario } = req.body;
        if (!validastring(token, id_usuario)) {
            return res.status(400).json({ erro: "Dados inválidos" });
        }
        const email = yield get_email(token);
        if (email === "") {
            return res.status(400).json({ erro: "Token inválido" });
        }
        const id_admin = yield Acessa_bd_1.client.query(`SELECT GET_ID_USUARIO($1)`, [email]).then((result) => {
            return result.rows[0].get_id_usuario;
        }).catch((err) => {
            console.log(err);
            return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
        });
        Acessa_bd_1.client.query(`SELECT GET_TAREFAS_USUARIO($1, $2)`, [id_admin, id_usuario], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
            }
            return res.status(200).json({ tarefas: result.rows[0].get_tarefas_usuario });
        });
    });
}
exports.get_tarefas_usuario = get_tarefas_usuario;
function get_all_tarefas(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        if (!validastring(token)) {
            return res.status(400).json({ erro: "Dados inválidos" });
        }
        const email = yield get_email(token);
        if (email === "") {
            return res.status(400).json({ erro: "Token inválido" });
        }
        const id_admin = yield Acessa_bd_1.client.query(`SELECT GET_ID_USUARIO($1)`, [email]).then((result) => {
            return result.rows[0].get_id_usuario;
        }).catch((err) => {
            console.log(err);
            return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
        });
        Acessa_bd_1.client.query(`SELECT GET_ALL_TAREFAS($1)`, [id_admin], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
            }
            return res.status(200).json({ tarefas: result.rows[0].get_all_tarefas });
        });
    });
}
exports.get_all_tarefas = get_all_tarefas;
function get_tarefas_pendentes(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        if (!validastring(token)) {
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
        Acessa_bd_1.client.query(`SELECT GET_TAREFAS_PENDENTES($1)`, [id_usuario], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
            }
            return res.status(200).json({ tarefas: result.rows[0].get_tarefas_pendentes });
        });
    });
}
exports.get_tarefas_pendentes = get_tarefas_pendentes;
function get_tarefas_concluidas(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        if (!validastring(token)) {
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
        Acessa_bd_1.client.query(`SELECT GET_TAREFAS_CONCLUIDAS($1)`, [id_usuario], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
            }
            return res.status(200).json({ tarefas: result.rows[0].get_tarefas_concluidas });
        });
    });
}
exports.get_tarefas_concluidas = get_tarefas_concluidas;
function get_tarefas_atrasadas(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        if (!validastring(token)) {
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
        Acessa_bd_1.client.query(`SELECT GET_TAREFAS_ATRASADAS($1)`, [id_usuario], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
            }
            return res.status(200).json({ tarefas: result.rows[0].get_tarefas_atrasadas });
        });
    });
}
exports.get_tarefas_atrasadas = get_tarefas_atrasadas;
