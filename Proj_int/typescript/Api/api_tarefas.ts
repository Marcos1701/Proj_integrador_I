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
    const retorno = await client.query(`SELECT email FROM usuario WHERE token = $1`, [token]);
    const email = retorno.rows[0].email;
    if (email === undefined || email === null) {
        return "";
    }
    return email;
}


async function adicionar_tarefa(req: Request, res: Response) {
    const { token, titulo, descricao, data, prioridade } = req.body;
    if (!validastring(token, titulo, descricao, data, prioridade)) {
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
    if (data === undefined || data === null) {

        client.query(`SELECT ADICIONAR_TAREFA($1, $2, $3, $4, $5)`, [id, titulo, descricao, id_usuario, prioridade], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
            }
            return res.status(200).json({ id: id });
        });
    } else {
        client.query(`SELECT ADICIONAR_TAREFA($1, $2, $3, $4, $5, $6)`, [id, titulo, descricao, id_usuario, data, prioridade], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
            }
            return res.status(200).json({ id: id });
        });
    }
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

    const tarefas = await client.query(`SELECT * FROM TAREFA WHERE ID_USUARIO = $1`, [id_usuario]).then((result) => {
        return result.rows;
    }).catch((err) => {
        console.log(err);
        return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
    }) as any[];

    if (tarefas === undefined || tarefas === null || tarefas.length === 0) {
        return res.status(200).json({ tarefas: [] });
    }

    if (ordenacao === "conclusao") {
        for (let i = 0; i < tarefas.length; i++) {
            for (let j = 0; j < tarefas.length; j++) {
                if (tarefas[i].data_conclusao > tarefas[j].data_conclusao) {
                    let aux = tarefas[i];
                    tarefas[i] = tarefas[j];
                    tarefas[j] = aux;
                }
            }
        }
    } else if (ordenacao === "prioridade") {
        for (let i = 0; i < tarefas.length; i++) {
            for (let j = 0; j < tarefas.length; j++) {
                if (tarefas[i].prioridade > tarefas[j].prioridade) {
                    let aux = tarefas[i];
                    tarefas[i] = tarefas[j];
                    tarefas[j] = aux;
                }
            }
        }
    } else if (ordenacao === "criacao") {
        for (let i = 0; i < tarefas.length; i++) {
            for (let j = 0; j < tarefas.length; j++) {
                if (tarefas[i].data_criacao > tarefas[j].data_criacao) {
                    let aux = tarefas[i];
                    tarefas[i] = tarefas[j];
                    tarefas[j] = aux;
                }
            }
        }
    }

    let retorno_tarefas = []; // organiza as tarefas de 3 em 3
    let count = 0;
    let tarefas_aux = [];

    for (let tarefa of tarefas) {
        let tarefa_aux = {
            id: tarefa.id,
            titulo: tarefa.titulo,
            descricao: tarefa.descricao,
            data_criacao: tarefa.data_criacao,
            prioridade: tarefa.prioridade,
            data_conclusao: tarefa.data_conclusao
        }
        tarefas_aux.push(tarefa_aux);
        count++;
        if (count === 3 || tarefas.length === 1) {
            retorno_tarefas.push(tarefas_aux);
            tarefas_aux = [];
            count = 0;
        }
        if (tarefas.length === 2 && count === 1) {
            retorno_tarefas.push(tarefas_aux);
            tarefas_aux = [];
            count = 0;
        }
    }
    // console.log(tarefas)
    // console.log(retorno_tarefas)
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