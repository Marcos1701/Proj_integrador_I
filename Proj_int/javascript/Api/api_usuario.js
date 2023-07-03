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
exports.get_data = exports.excluir_usuario = exports.editar_usuario = void 0;
const Acessa_bd_1 = require("./Acessa_bd");
const api_login_js_1 = require("./api_login.js");
const api_tarefas_js_1 = require("./api_tarefas.js");
function get_senha(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const senha = yield Acessa_bd_1.client.query(`SELECT senha FROM usuarios WHERE token = '${token}'`).then((result) => {
            return result.rows[0].senha;
        }).catch((err) => {
            console.log(err);
            return null;
        });
        return senha;
    });
}
function editar_usuario(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { token, novo_nome, novo_email, nova_senha } = req.body;
        if (!token) {
            return res.status(500).json({ error: "Token inválido" });
        }
        const email = (0, api_tarefas_js_1.get_email)(token);
        if (!email) {
            return res.status(500).json({ error: "Token inválido" });
        }
        if (!novo_nome && !novo_email && !nova_senha ||
            novo_nome === "" && novo_email === "" && nova_senha === "") {
            return res.status(500).json({ error: "Dados inválidos" });
        }
        if (novo_nome && novo_email && nova_senha) {
            const new_token = (0, api_login_js_1.gerar_JWT)(novo_email, nova_senha);
            if (!new_token) {
                return res.status(500).json({ error: "Erro ao gerar o token" });
            }
            Acessa_bd_1.client.query("SELECT EDITAR_USUARIO($1, $2, $3, $4, $5)", [token, new_token, novo_nome, novo_email, nova_senha], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
                }
                return res.status(200).json({ token: new_token });
            });
        }
        else if (novo_nome && novo_email) {
            const senha = yield get_senha(token);
            if (!senha) {
                return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
            }
            const new_token = (0, api_login_js_1.gerar_JWT)(novo_email, senha);
            Acessa_bd_1.client.query("SELECT EDITAR_USUARIO($1, $2, $3, $4, DEFAULT)", [token, new_token, novo_nome, novo_email], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
                }
                return res.status(200).json({ token: new_token });
            });
        }
        else if (novo_nome && nova_senha) {
            const email = yield (0, api_tarefas_js_1.get_email)(token);
            if (!email) {
                return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
            }
            const new_token = (0, api_login_js_1.gerar_JWT)(email, nova_senha);
            Acessa_bd_1.client.query("SELECT EDITAR_USUARIO($1, $2, $3,DEFAULT, $4)", [token, new_token, novo_nome, nova_senha], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
                }
                return res.status(200).json({ token: new_token });
            });
        }
        else if (novo_email && nova_senha) {
            const new_token = (0, api_login_js_1.gerar_JWT)(novo_email, nova_senha);
            if (!new_token) {
                return res.status(500).json({ error: "Erro ao gerar o token" });
            }
            Acessa_bd_1.client.query("SELECT EDITAR_USUARIO($1, $2, DEFAULT, $3, $4)", [token, new_token, novo_email, nova_senha], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
                }
                return res.status(200).json({ token: new_token });
            });
        }
        else if (novo_nome) {
            Acessa_bd_1.client.query("SELECT EDITAR_USUARIO($1, $2, $3, DEFAULT, DEFAULT)", [token, token, novo_nome], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
                }
                return res.status(200).json({ token: token });
            });
        }
        else if (novo_email) {
            const senha = yield get_senha(token);
            if (!senha) {
                return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
            }
            const new_token = (0, api_login_js_1.gerar_JWT)(novo_email, senha);
            Acessa_bd_1.client.query("SELECT EDITAR_USUARIO($1, $2, DEFAULT, $3, DEFAULT)", [token, new_token, novo_email], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
                }
                return res.status(200).json({ token: new_token });
            });
        }
        else {
            const email = yield (0, api_tarefas_js_1.get_email)(token);
            if (!email) {
                return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
            }
            const new_token = (0, api_login_js_1.gerar_JWT)(email, nova_senha);
            Acessa_bd_1.client.query("SELECT EDITAR_USUARIO($1, $2, DEFAULT, DEFAULT, $3)", [token, new_token, nova_senha], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
                }
                return res.status(200).json({ token: new_token });
            });
        }
    });
}
exports.editar_usuario = editar_usuario;
function excluir_usuario(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        if (!token) {
            return res.status(500).json({ error: "Token inválido" });
        }
        Acessa_bd_1.client.query("SELECT EXCLUIR_USUARIO($1)", [token], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
            }
            return res.sendStatus(204);
        });
    });
}
exports.excluir_usuario = excluir_usuario;
function get_data(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        if (!token) {
            return res.status(500).json({ error: "Token inválido" });
        }
        Acessa_bd_1.client.query("SELECT GET_DATA($1)", [token], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
            }
            return res.status(200).json({ data: result.rows[0].get_data });
        });
    });
}
exports.get_data = get_data;
