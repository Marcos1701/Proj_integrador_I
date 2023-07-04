import express, { Request, Response } from 'express';
import { client } from './Acessa_bd';

const validastring = (...id: string[]) => {
    for (let i = 0; i < id.length; i++) {
        if (id[i] === '' || id[i] === undefined || id[i] === null) {
            return false
        }
    }
    return true
}

async function get_email(token: string): Promise<string> {
    const retorno = await client.query(`SELECT email FROM usuario WHERE token = $1`, [token]).then((result) => {
        return result;
    });
    const { email } = retorno.rows[0];
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

    const usuarios: any[] = await client.query(`SELECT * FROM GET_USUARIOS($1)`, [id_usuario]).then((result) => {
        return result.rows
    }).catch((err) => {
        console.log(err);
        return res.status(500).json({ erro: "Erro ao acessar o banco de dados 1" });
    }) as any[];

    const admins: any[] = await client.query(`SELECT * FROM GET_ADMINS($1)`, [id_usuario]).then((result) => {
        return result.rows;
    }).catch((err) => {
        console.log(err);
        return res.status(500).json({ erro: "Erro ao acessar o banco de dados 2" });
    }) as any[];

    if (usuarios === undefined || usuarios === null || admins === undefined || admins === null) {
        return res.status(500).json({ erro: "Erro ao acessar o banco de dados 3" });
    }

    for (let i = 0; i < usuarios.length; i++) {
        usuarios[i].adm = false;
        for (let j = 0; j < admins.length; j++) {
            if (usuarios[i].id_user === admins[j].id_user) {
                usuarios[i].adm = true;
                break;
            }
        }
    }

    return res.status(200).json({ usuarios: usuarios });
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

async function confere_admin(req: Request, res: Response) {
    try {
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
        })

        const retorno = await client.query(`SELECT * FROM CONSULTAR_ADM($1)`, [id_admin]).then((result) => {
            return result.rows;
        })

        if (!retorno || retorno === undefined || retorno.length === undefined || retorno.length === null || retorno.length === 0) {
            return res.status(200).json({ admin: false });
        }

        return res.status(200).json({ admin: true, retorno: retorno[0] });
    } catch (err) {
        return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
    }
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
        return res.status(200).json({ erro: "Erro ao acessar o banco de dados" });
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

    client.query(`SELECT * FROM GET_STATUS_ALL_TAREFAS($1)`, [id_admin], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ erro: "Erro ao acessar o banco de dados" });
        }
        return res.status(200).json({ tarefas: result.rows });
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
    get_tarefas_concluidas, get_tarefas_atrasadas,
    confere_admin
};