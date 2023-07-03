import express, { Request, Response } from 'express';
import { client } from './Acessa_bd';
import * as crypto from 'crypto'
import { v4 as uuid } from 'uuid';

const validastring = (...id: string[]) => {
    for (let i = 0; i < id.length; i++) {
        if (id[i] === '' || id[i] === undefined || id[i] === null) {
            return false
        }
    }
    return true
}

export const gerar_JWT = (email: string, senha: string) => {
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

async function Get_Data_Google(token: string): Promise<{ email: string, name: string, erro: string } | undefined> {
    try {
        let retorno = { erro: "erro ao acessar o Google", email: "", name: "" };
        const url: string = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token="

        const response = await fetch(url + token, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (response.status === 200) {
            const { email, name } = await response.json();
            console.log(email, name);
            retorno = { email: email, name: name, erro: "" };
        } else {
            const { error } = await response.json();
            retorno.erro = error;
        }

        return retorno;
    } catch (error) {
        if (error instanceof Error) {
            return { erro: error.message, email: "", name: "" };
        }
    }
}


async function Login_via_Google(req: Request, res: Response) {
    const { token } = req.body;
    const retorno: { email: string, name: string, erro: string } = await Get_Data_Google(token) as { email: string, name: string, erro: string };
    if (retorno === null || retorno === undefined) {
        return res.status(500).json({ error: "Erro ao acessar o Google" });
    }
    const { email, name, erro }: { email: string, name: string, erro: string } = retorno;
    if (erro || !email || !name) {
        return res.status(500).json({ error: erro });
    }
    if (email && name) {
        client.query("SELECT * FROM usuario WHERE email = $1", [email], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
            }

            const id = uuid();
            if (result.rows.length == 0) {
                // client.query("INSERT INTO usuario (id, nome, email, token, id_metodo_login) VALUES ($1, $2)", [id, name, email, token, 1], (err, result) => {
                client.query("SELECT ADICIONAR_USUARIO($1, $2, $3, $4, $5)", [id, name, email, 1, token], (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
                    }
                    return res.status(200).json({ token: token });
                });
            } else if (result.rows[0].id_metodo_login == 1) {
                return res.status(200).json({ token: token });
            } else {
                return res.status(500).json({ error: "Email já cadastrado via Email" });
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
    client.query("SELECT * FROM usuario WHERE email = $1", [email], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
        }
        if (result.rows.length == 0) {
            return res.status(500).json({ error: "Email não cadastrado!!" });
        } else if (result.rows[0].id_metodo_login == 1) {
            return res.status(500).json({ error: "Ops, email já cadastrado via Google.." });
        } else if (result.rows[0].senha != senha) {
            return res.status(500).json({ error: "Senha incorreta!!" });
        } else {
            const { token } = result.rows[0];
            return res.status(200).json({ token: token });
        }
    });
}

async function Cadastro(req: Request, res: Response) {
    const { nome, email, senha } = req.body;
    if (!validastring(nome, email, senha)) {
        return res.status(500).json({ error: "Dados inválidos" });
    }
    const token = gerar_JWT(email, senha);
    if (!token) {
        return res.status(500).json({ error: "Erro ao gerar o token" })
    }
    const id: string = uuid();

    client.query("SELECT * FROM usuario WHERE email = $1", [email], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
        }
        if (result.rows.length == 0) {
            // client.query("INSERT INTO usuario (id, nome, email, senha, token, id_metodo_login) VALUES ($1, $2, $3, $4, $5, $6)", [id, nome, email, senha, token, 2], (err, result) => {
            client.query("SELECT ADICIONAR_USUARIO($1, $2, $3, $4, $5, $6)", [id, nome, email, 2, token, senha], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
                }
                return res.status(201).json({ token: token });
            });
        } else {
            return res.status(500).json({ error: "Email já cadastrado" });
        }
    }
    );
}

export { Login_via_Google, Login_via_Email, Cadastro };