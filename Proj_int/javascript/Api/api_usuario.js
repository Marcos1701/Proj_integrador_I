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
exports.confere_token = exports.get_data = exports.excluir_usuario = exports.editar_usuario = void 0;
const Acessa_bd_1 = require("./Acessa_bd");
const api_login_js_1 = require("./api_login.js");
const api_tarefas_js_1 = require("./api_tarefas.js");
function confere_token(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        if (!token) {
            return res.status(500).json({ error: "Token inválido" });
        }
        const email = yield (0, api_tarefas_js_1.get_email)(token);
        if (!email) {
            return res.status(500).json({ error: "Token inválido" });
        }
        return res.status(200).json({ token: token });
    });
}
exports.confere_token = confere_token;
function get_name(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const name = yield Acessa_bd_1.client.query(`SELECT nome FROM usuario WHERE token = '${token}'`).then((result) => {
            return result.rows[0].nome;
        }).catch((err) => {
            console.log(err);
            return null;
        });
        return name;
    });
}
function get_senha(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const senha = yield Acessa_bd_1.client.query(`SELECT senha FROM usuario WHERE token = '${token}'`).then((result) => {
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
        let email = yield (0, api_tarefas_js_1.get_email)(token);
        if (!email) {
            return res.status(500).json({ error: "Token inválido" });
        }
        if (!novo_nome && !novo_email && !nova_senha ||
            novo_nome === "" && novo_email === "" && nova_senha === "") {
            return res.status(500).json({ error: "Dados inválidos" });
        }
        let senha = yield get_senha(token);
        if (!senha) {
            return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
        }
        let novo_token = email && email !== novo_email
            && senha && senha !== nova_senha ?
            (0, api_login_js_1.gerar_JWT)(novo_email, nova_senha) : token;
        email = novo_email ?
            novo_email !== email ? novo_email : null
            : email;
        senha = nova_senha ? nova_senha : senha;
        if (novo_email && !nova_senha && senha) {
            novo_token = (0, api_login_js_1.gerar_JWT)(novo_email, senha);
        }
        else if (!novo_email && nova_senha && email) {
            novo_token = (0, api_login_js_1.gerar_JWT)(email, nova_senha);
        }
        const nome = novo_nome ? novo_nome : yield get_name(token);
        if (!nome) {
            return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
        }
        Acessa_bd_1.client.query("SELECT EDITAR_USUARIO($1, $2, $3, $4, $5)", [token, novo_token ? novo_token : null, nome, novo_email ? email : null, nova_senha ? senha : null], (err, result) => {
            if (err) {
                console.log(err.message);
                return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
            }
            return res.status(200).json({ token: novo_token ? novo_token : token });
        });
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
        Acessa_bd_1.client.query("SELECT * FROM GET_DATA($1)", [token], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
            }
            return res.status(200).json({ data: result.rows[0] });
        });
    });
}
exports.get_data = get_data;
