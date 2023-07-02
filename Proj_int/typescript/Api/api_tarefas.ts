import express, { Request, Response } from 'express';
import { client } from './Acessa_bd';
import { v4 as uuid } from 'uuid';

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


async function adicionar_tarefa(req: Request, res: Response) {
    const { token, titulo, descricao, data_final, prioridade } = req.body;
    if (!validastring(token, titulo, descricao, data_final, prioridade)) {
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

    const id = uuid();
    client.query(`SELECT ADICIONAR_TAREFA($1, $2, $3, $4, $5, $6)`, [id, titulo, descricao, id_usuario, data_final, prioridade], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
        }
        return res.status(200).json({ id: id });
    });
}

async function editar_tarefa(req: Request, res: Response) {
    const { token, id, titulo, descricao, data_final, prioridade } = req.body;
    if (!validastring(token, id, titulo, descricao, data_final, prioridade)) {
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

    client.query(`SELECT EDITAR_TAREFA($1, $2, $3, $4, $5, $6)`, [id_usuario, id, titulo, descricao, data_final, prioridade], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
        }
        return res.status(200).json({ id: id });
    });
}

async function excluir_tarefa(req: Request, res: Response) {
    const { token, id } = req.body;
    if (!validastring(token, id)) {
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

    client.query(`SELECT DELETAR_TAREFA($1, $2)`, [id, id_usuario], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
        }
        return res.status(204);
    });
}

async function get_tarefas(req: Request, res: Response) {
    const { token, ordenacao } = req.body;
    if (!validastring(token, ordenacao)) {
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

    const tarefas: any = await client.query(`SELECT GET_TAREFAS($1)`, [id_usuario], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
            return null;
        }
        return result.rows[0].get_tarefas;
    });

    if (tarefas === undefined || tarefas === null) {
        return res.status(200).json({ tarefas: [] });
    }


    if (ordenacao === "conclusao") {
        tarefas.sort((a: { DATA_CONCLUSAO: Date; }, b: { DATA_CONCLUSAO: Date; }) => {
            if (a.DATA_CONCLUSAO > b.DATA_CONCLUSAO) {
                return 1;
            }
            if (a.DATA_CONCLUSAO < b.DATA_CONCLUSAO) {
                return -1;
            }
            return 0;
        });
    } else if (ordenacao === "prioridade") {
        tarefas.sort((a: { PRIORIDADE: number; }, b: { PRIORIDADE: number; }) => {
            if (a.PRIORIDADE > b.PRIORIDADE) {
                return 1;
            }
            if (a.PRIORIDADE < b.PRIORIDADE) {
                return -1;
            }
            return 0;
        });
    } else if (ordenacao === "criacao") {
        tarefas.sort((a: { DATA_CRIACAO: Date; }, b: { DATA_CRIACAO: Date; }) => {
            if (a.DATA_CRIACAO > b.DATA_CRIACAO) {
                return 1;
            }
            if (a.DATA_CRIACAO < b.DATA_CRIACAO) {
                return -1;
            }
            return 0;
        });
    }

    let retorno_tarefas = []; // organiza as tarefas de 3 em 3

    for (let i = 0; i < tarefas.length; i += 3) {
        let tarefa = tarefas.slice(i, i + 3);
        retorno_tarefas.push(tarefa);
    }

    return res.status(200).json({ tarefas: retorno_tarefas });
}

async function concluir_tarefa(req: Request, res: Response) {
    const { token, id } = req.body;
    if (!validastring(token, id)) {
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

    client.query(`SELECT CONCLUIR_TAREFA($1, $2)`, [id, id_usuario], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
        }
        return res.status(200);
    });
}

async function get_tarefa(req: Request, res: Response) {
    const { token, id } = req.body;
    if (!validastring(token, id)) {
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

    const tarefa: any = await client.query(`SELECT GET_TAREFA($1, $2)`, [id, id_usuario], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
        }
        return result.rows[0].get_tarefa;
    });

    if (tarefa === undefined || tarefa === null) {
        return res.status(200).json({ tarefa: [] });
    }

    return res.status(200).json({ tarefa: tarefa });
}

export {
    adicionar_tarefa, excluir_tarefa, get_tarefas,
    concluir_tarefa, get_tarefa, editar_tarefa
};