import express, { Request, Response } from 'express';
import { client } from './Acessa_bd';

const validastring = (...id: string[]) => {
    for (let i = 0; i < id.length; i++) {
        if (id[i] === '' || id[i] === undefined || id[i] === null) {
            return false
        }
        return true
    }
}

async function get_email(token: string): Promise<string> {
    const retorno = await client.query(`SELECT email FROM usuarios WHERE token = $1`, [token]);
    const email = retorno.rows[0].email;
    if (email === undefined || email === null) {
        return "";
    }
    return email;
}

async function get_usuarios(req: Request, res: Response) {
    const { token } = req.body;
    if (!validastring(token)) {
        return res.status(400).json({ erro: "Dados inválidos" });
    }
    const email: string = await get_email(token)
    if (email === "") {
        return res.status(400).json({ erro: "Token inválido" });
    }
    const id_usuario = await client.query(`SELECT GET_ID_USUARIO($1)`, [email]).then((result) => {
        return result.rows[0].get_id_usuario;
    }).catch((err) => {
        console.log(err);
        return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
    });

    client.query(`SELECT GET_USUARIOS($1)`, [id_usuario], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
        }
        return res.status(200).json({ usuarios: result.rows[0].get_usuarios });
    });
}

async function adicionar_admin(req: Request, res: Response) {
    const { token, id_usuario } = req.body;
    if (!validastring(token, id_usuario)) {
        return res.status(400).json({ erro: "Dados inválidos" });
    }
    const email: string = await get_email(token)
    if (email === "") {
        return res.status(400).json({ erro: "Token inválido" });
    }
    const id_admin = await client.query(`SELECT GET_ID_USUARIO($1)`, [email]).then((result) => {
        return result.rows[0].get_id_usuario;
    }).catch((err) => {
        console.log(err);
        return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
    });

    client.query(`SELECT ADICIONAR_ADM($1, $2)`, [id_admin, id_usuario], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
        }
        return res.status(200);
    });
}

async function get_tarefas_usuario(req: Request, res: Response) {
    const { token, id_usuario } = req.body;
    if (!validastring(token, id_usuario)) {
        return res.status(400).json({ erro: "Dados inválidos" });
    }
    const email: string = await get_email(token)
    if (email === "") {
        return res.status(400).json({ erro: "Token inválido" });
    }
    const id_admin = await client.query(`SELECT GET_ID_USUARIO($1)`, [email]).then((result) => {
        return result.rows[0].get_id_usuario;
    }).catch((err) => {
        console.log(err);
        return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
    });

    client.query(`SELECT GET_TAREFAS_USUARIO($1, $2)`, [id_admin, id_usuario], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
        }
        return res.status(200).json({ tarefas: result.rows[0].get_tarefas_usuario });
    });
}

async function get_all_tarefas(req: Request, res: Response) {
    const { token } = req.body;
    if (!validastring(token)) {
        return res.status(400).json({ erro: "Dados inválidos" });
    }
    const email: string = await get_email(token)
    if (email === "") {
        return res.status(400).json({ erro: "Token inválido" });
    }
    const id_admin = await client.query(`SELECT GET_ID_USUARIO($1)`, [email]).then((result) => {
        return result.rows[0].get_id_usuario;
    }).catch((err) => {
        console.log(err);
        return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
    });

    client.query(`SELECT GET_ALL_TAREFAS($1)`, [id_admin], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
        }
        return res.status(200).json({ tarefas: result.rows[0].get_all_tarefas });
    });
}

async function get_tarefas_pendentes(req: Request, res: Response) {
    const { token } = req.body;
    if (!validastring(token)) {
        return res.status(400).json({ erro: "Dados inválidos" });
    }

    const email: string = await get_email(token)
    if (email === "") {
        return res.status(400).json({ erro: "Token inválido" });
    }

    const id_usuario = await client.query(`SELECT GET_ID_USUARIO($1)`, [email]).then((result) => {
        return result.rows[0].get_id_usuario;
    }).catch((err) => {
        console.log(err);
        return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
    });

    client.query(`SELECT GET_TAREFAS_PENDENTES($1)`, [id_usuario], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
        }
        return res.status(200).json({ tarefas: result.rows[0].get_tarefas_pendentes });
    });
}

async function get_tarefas_concluidas(req: Request, res: Response) {
    const { token } = req.body;
    if (!validastring(token)) {
        return res.status(400).json({ erro: "Dados inválidos" });
    }

    const email: string = await get_email(token)
    if (email === "") {
        return res.status(400).json({ erro: "Token inválido" });
    }

    const id_usuario = await client.query(`SELECT GET_ID_USUARIO($1)`, [email]).then((result) => {
        return result.rows[0].get_id_usuario;
    }).catch((err) => {
        console.log(err);
        return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
    });

    client.query(`SELECT GET_TAREFAS_CONCLUIDAS($1)`, [id_usuario], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
        }
        return res.status(200).json({ tarefas: result.rows[0].get_tarefas_concluidas });
    });
}

async function get_tarefas_atrasadas(req: Request, res: Response) {
    const { token } = req.body;
    if (!validastring(token)) {
        return res.status(400).json({ erro: "Dados inválidos" });
    }

    const email: string = await get_email(token)
    if (email === "") {
        return res.status(400).json({ erro: "Token inválido" });
    }

    const id_usuario = await client.query(`SELECT GET_ID_USUARIO($1)`, [email]).then((result) => {
        return result.rows[0].get_id_usuario;
    }).catch((err) => {
        console.log(err);
        return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
    });

    client.query(`SELECT GET_TAREFAS_ATRASADAS($1)`, [id_usuario], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
        }
        return res.status(200).json({ tarefas: result.rows[0].get_tarefas_atrasadas });
    });
}

export { 
    get_usuarios, adicionar_admin, get_all_tarefas,
    get_tarefas_usuario, get_tarefas_pendentes,
    get_tarefas_concluidas, get_tarefas_atrasadas
};