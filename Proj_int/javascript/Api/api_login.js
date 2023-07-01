"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Cadastro = exports.Login_via_Email = exports.Login_via_Google = void 0;
const conf_bd_pg_1 = require("../conf_bd_pg");
const crypto = __importStar(require("crypto"));
const validastring = (...id) => {
    for (let i = 0; i < id.length; i++) {
        if (id[i] === '' || id[i] === undefined || id[i] === null) {
            return false;
        }
        return true;
    }
};
const gerar_JWT = (email, senha) => {
    if (!validastring(email, senha)) {
        return null;
    }
    const header_token = JSON.stringify({
        "alg": "HS256",
        "typ": "JWT"
    });
    const payload_token = JSON.stringify({
        "email": email,
        "senha": senha
    });
    const base64Header = Buffer.from(header_token).toString('base64').replace(/=/g, '');
    const base64Payload = Buffer.from(payload_token).toString('base64').replace(/=/g, '');
    const data = base64Header + "." + base64Payload;
    const signature = crypto.createHmac('sha256', data)
        .update('segredo')
        .digest('base64').replace(/=/g, '');
    const token = data + "." + signature;
    return token;
};
function Get_Data_Google(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=";
        yield fetch(url + token, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }).then((response) => __awaiter(this, void 0, void 0, function* () {
            if (response.status == 200) {
                const { email, name } = yield response.json();
                return { email, name };
            }
            else {
                const { error } = yield response.json();
                return { erro: error };
            }
        })).catch((error) => {
            return { erro: error };
        });
        return { erro: "Erro ao acessar o Google", email: "", name: "" };
    });
}
function Login_via_Google(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { token } = req.body;
        const retorno = yield Get_Data_Google(token);
        const { email, name, erro } = retorno;
        if (erro) {
            return res.status(500).json({ error: erro });
        }
        if (email && name) {
            conf_bd_pg_1.client.query("SELECT * FROM usuario WHERE email = $1", [email], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
                }
                if (result.rows.length == 0) {
                    conf_bd_pg_1.client.query("INSERT INTO usuario (nome, email) VALUES ($1, $2)", [name, email], (err, result) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
                        }
                        return res.status(200).json({ token: token });
                    });
                }
                else {
                    return res.status(200).json({ token: token });
                }
            });
        }
        else {
            return res.status(500).json({ error: "Erro ao acessar o Google" });
        }
    });
}
exports.Login_via_Google = Login_via_Google;
function Login_via_Email(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, senha } = req.body;
        if (!validastring(email, senha)) {
            return res.status(500).json({ error: "Dados inválidos" });
        }
        conf_bd_pg_1.client.query("SELECT * FROM usuario WHERE email = $1 AND senha = $2", [email, senha], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
            }
            if (result.rows.length == 0) {
                return res.status(500).json({ error: "Email ou senha incorretos" });
            }
            else {
                const token = gerar_JWT(email, senha);
                if (!token) {
                    return res.status(500).json({ error: "Erro ao gerar o token" });
                }
                return res.status(200).json({ token: token });
            }
        });
    });
}
exports.Login_via_Email = Login_via_Email;
function Cadastro(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { nome, sobre_nome, email, senha } = req.body;
        if (!validastring(nome, sobre_nome, email, senha)) {
            return res.status(500).json({ error: "Dados inválidos" });
        }
        const token = gerar_JWT(email, senha);
        conf_bd_pg_1.client.query("SELECT * FROM usuario WHERE email = $1", [email], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
            }
            if (result.rows.length == 0) {
                conf_bd_pg_1.client.query("INSERT INTO usuario (nome, sobre_nome, email, senha) VALUES ($1, $2, $3, $4)", [nome, sobre_nome, email, senha], (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
                    }
                    return res.status(200).json({ token: token });
                });
            }
            else {
                return res.status(500).json({ error: "Email já cadastrado" });
            }
        });
    });
}
exports.Cadastro = Cadastro;
