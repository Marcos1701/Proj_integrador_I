import express, { Request, Response } from 'express';
import { client } from './Acessa_bd';
import { gerar_JWT } from './api_login.js'
import { get_email } from './api_tarefas.js'


async function get_senha(token: string): Promise<string | null> {
    const senha = await client.query(`SELECT senha FROM usuarios WHERE token = '${token}'`).then((result) => {
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
    const email = get_email(token);
    if (!email) {
        return res.status(500).json({ error: "Token inválido" });
    }
    if (!novo_nome && !novo_email && !nova_senha ||
        novo_nome === "" && novo_email === "" && nova_senha === ""
    ) {
        return res.status(500).json({ error: "Dados inválidos" });
    }

    if (novo_nome && novo_email && nova_senha) {
        const new_token = gerar_JWT(novo_email, nova_senha);
        if (!new_token) {
            return res.status(500).json({ error: "Erro ao gerar o token" });
        }
        client.query("SELECT EDITAR_USUARIO($1, $2, $3, $4, $5)", [token, new_token, novo_nome, novo_email, nova_senha], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
            }
            return res.status(200).json({ token: new_token });
        });
    } else if (novo_nome && novo_email) {
        const senha = await get_senha(token);
        if (!senha) {
            return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
        }
        const new_token = gerar_JWT(novo_email, senha);
        client.query("SELECT EDITAR_USUARIO($1, $2, $3, $4, DEFAULT)", [token, new_token, novo_nome, novo_email], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
            }
            return res.status(200).json({ token: new_token });
        });
    } else if (novo_nome && nova_senha) {
        const email = await get_email(token);
        if (!email) {
            return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
        }
        const new_token = gerar_JWT(email, nova_senha);
        client.query("SELECT EDITAR_USUARIO($1, $2, $3,DEFAULT, $4)", [token, new_token, novo_nome, nova_senha], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
            }
            return res.status(200).json({ token: new_token });
        });
    } else if (novo_email && nova_senha) {
        const new_token = gerar_JWT(novo_email, nova_senha);
        if (!new_token) {
            return res.status(500).json({ error: "Erro ao gerar o token" });
        }
        client.query("SELECT EDITAR_USUARIO($1, $2, DEFAULT, $3, $4)", [token, new_token, novo_email, nova_senha], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
            }
            return res.status(200).json({ token: new_token });
        });
    } else if (novo_nome) {
        client.query("SELECT EDITAR_USUARIO($1, $2, $3, DEFAULT, DEFAULT)", [token, token, novo_nome], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
            }
            return res.status(200).json({ token: token });
        });
    } else if (novo_email) {
        const senha = await get_senha(token);
        if (!senha) {
            return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
        }
        const new_token = gerar_JWT(novo_email, senha);
        client.query("SELECT EDITAR_USUARIO($1, $2, DEFAULT, $3, DEFAULT)", [token, new_token, novo_email], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
            }
            return res.status(200).json({ token: new_token });
        });
    } else {
        const email = await get_email(token);
        if (!email) {
            return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
        }
        const new_token = gerar_JWT(email, nova_senha);
        client.query("SELECT EDITAR_USUARIO($1, $2, DEFAULT, DEFAULT, $3)", [token, new_token, nova_senha], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
            }
            return res.status(200).json({ token: new_token });
        });
    }
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

export { editar_usuario, excluir_usuario, get_data }