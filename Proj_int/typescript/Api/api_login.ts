import express, { Request, Response } from 'express';
import { client } from '../conf_bd_pg';
import * as crypto from 'crypto'

const validastring = (...id: string[]) => {
    for (let i = 0; i < id.length; i++) {
        if (id[i] === '' || id[i] === undefined || id[i] === null) {
            return false
        }
        return true
    }
}

const gerar_JWT = (email: string, senha: string) => {
    if (!validastring(email, senha)) {
        return null;
    }
    const header_token = JSON.stringify({
        "alg": "HS256",
        "typ": "JWT"
    })

    const payload_token = JSON.stringify({
        "email": email,
        "senha": senha
    })

    const base64Header = Buffer.from(header_token).toString('base64').replace(/=/g, '');
    const base64Payload = Buffer.from(payload_token).toString('base64').replace(/=/g, '');

    const data = base64Header + "." + base64Payload;
    const signature = crypto.createHmac('sha256', data)
        .update('segredo')
        .digest('base64').replace(/=/g, '');

    const token = data + "." + signature;
    return token;
}

async function Get_Data_Google(token: string): Promise<{ email: string, name: string, erro: string }> {
    const url: string = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token="

    await fetch(url + token, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    }).then(async (response) => {
        if (response.status == 200) {
            const { email, name } = await response.json();
            return { email, name };
        } else {
            const { error } = await response.json();
            return { erro: error }
        }
    }).catch((error) => {
        return { erro: error }
    })
    return { erro: "Erro ao acessar o Google", email: "", name: "" };
}

async function Login_via_Google(req: Request, res: Response) {
    const { token } = req.body;
    const retorno: { email: string, name: string, erro: string } = await Get_Data_Google(token);
    const { email, name, erro } = retorno;
    if (erro) {
        return res.status(500).json({ error: erro });
    }
    if (email && name) {
        client.query("SELECT * FROM usuario WHERE email = $1", [email], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
            }
            if (result.rows.length == 0) {
                client.query("INSERT INTO usuario (nome, email) VALUES ($1, $2)", [name, email], (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
                    }
                    return res.status(200).json({ token: token });
                });
            } else {
                return res.status(200).json({ token: token });
            }
        });
    } else {
        return res.status(500).json({ error: "Erro ao acessar o Google" });
    }
}

async function Login_via_Email(req: Request, res: Response) {
    const { email, senha } = req.body;
    if (!validastring(email, senha)) {
        return res.status(500).json({ error: "Dados inválidos" });
    }
    client.query("SELECT * FROM usuario WHERE email = $1 AND senha = $2", [email, senha], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
        }
        if (result.rows.length == 0) {
            return res.status(500).json({ error: "Email ou senha incorretos" });
        } else {
            const token = gerar_JWT(email, senha);
            if (!token) {
                return res.status(500).json({ error: "Erro ao gerar o token" })
            }
            return res.status(200).json({ token: token });
        }
    });
}

async function Cadastro(req: Request, res: Response) {
    const { nome, sobre_nome, email, senha } = req.body;
    if (!validastring(nome, sobre_nome, email, senha)) {
        return res.status(500).json({ error: "Dados inválidos" });
    }
    const token = gerar_JWT(email, senha);

    client.query("SELECT * FROM usuario WHERE email = $1", [email], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
        }
        if (result.rows.length == 0) {
            client.query("INSERT INTO usuario (nome, sobre_nome, email, senha) VALUES ($1, $2, $3, $4)", [nome, sobre_nome, email, senha], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
                }
                return res.status(200).json({ token: token });
            });
        } else {
            return res.status(500).json({ error: "Email já cadastrado" });
        }
    }
    );
}

export { Login_via_Google, Login_via_Email, Cadastro };