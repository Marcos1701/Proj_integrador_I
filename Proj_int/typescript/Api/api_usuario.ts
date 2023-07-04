import express, { Request, Response } from 'express';
import { client } from './Acessa_bd';
import { gerar_JWT } from './api_login.js'
import { get_email } from './api_tarefas.js'

async function confere_token(req: Request, res: Response) {
    const { token } = req.body;
    if (!token) {
        return res.status(500).json({ error: "Token inválido" });
    }
    const email = await get_email(token);
    if (!email) {
        return res.status(500).json({ error: "Token inválido" });
    }
    return res.status(200).json({ token: token });
}

async function get_name(token: string): Promise<string | null> {
    const name = await client.query(`SELECT nome FROM usuario WHERE token = '${token}'`).then((result) => {
        return result.rows[0].nome;
    }).catch((err) => {
        console.log(err);
        return null;
    });
    return name;
}

async function get_senha(token: string): Promise<string | null> {
    const senha = await client.query(`SELECT senha FROM usuario WHERE token = '${token}'`).then((result) => {
        return result.rows[0].senha;
    }).catch((err) => {
        console.log(err);
        return null;
    });
    return senha;
}

async function editar_usuario(req: Request, res: Response) {
    const { token, novo_nome, novo_email, nova_senha } = req.body;
    if (!token) {
        return res.status(500).json({ error: "Token inválido" });
    }
    let email = await get_email(token);
    if (!email) {
        return res.status(500).json({ error: "Token inválido" });
    }
    if (!novo_nome && !novo_email && !nova_senha ||
        novo_nome === "" && novo_email === "" && nova_senha === ""
    ) {
        return res.status(500).json({ error: "Dados inválidos" });
    }

    let senha = await get_senha(token);
    if (!senha) {
        return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
    }

    let novo_token = email && email !== novo_email
        && senha && senha !== nova_senha ?
        gerar_JWT(novo_email, nova_senha) : token;
    email = novo_email ?
        novo_email !== email ? novo_email : null
        : email;
    senha = nova_senha ? nova_senha : senha;

    if (novo_email && !nova_senha && senha) {
        novo_token = gerar_JWT(novo_email, senha);
    } else if (!novo_email && nova_senha && email) {
        novo_token = gerar_JWT(email, nova_senha);
    }

    const nome = novo_nome ? novo_nome : await get_name(token);
    if (!nome) {
        return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
    }


    client.query("SELECT EDITAR_USUARIO($1, $2, $3, $4, $5)", [token, novo_token ? novo_token : null, nome, novo_email ? email : null, nova_senha ? senha : null], (err, result) => {
        if (err) {
            console.log(err.message);
            return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
        }
        return res.status(200).json({ token: novo_token ? novo_token : token });
    });
}

async function excluir_usuario(req: Request, res: Response) {
    const { token } = req.body;
    if (!token) {
        return res.status(500).json({ error: "Token inválido" });
    }
    client.query("SELECT EXCLUIR_USUARIO($1)", [token], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
        }
        return res.sendStatus(204);
    });
}

async function get_data(req: Request, res: Response) {
    const { token } = req.body;
    if (!token) {
        return res.status(500).json({ error: "Token inválido" });
    }

    client.query("SELECT * FROM GET_DATA($1)", [token], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
        }

        return res.status(200).json({ data: result.rows[0] });
    });
}

export { editar_usuario, excluir_usuario, get_data, confere_token }