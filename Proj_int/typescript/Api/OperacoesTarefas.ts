import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid'

export function addTask(resquest: Request, response: Response){
    if(!resquest.body.idUser){
        response.json({
            "StatusCode": "400",
            "msg": "O id do usuário deve ser informado!!"
        });
    }else if(!resquest.body.taskTitle){
        response.json({
            "StatusCode": "400",
            "msg": "O titulo da tarefa deve ser informado!!"
        });
    }else{
        const descricao: string = resquest.body.descricaoTarefa;
        const DataPrevistaPFinalizar: string = resquest.body.dataPrevista;
        const idTarefa; string = uuidv4()

        sql`SELECT ADDTAREFA(${resquest.body.idUser},${idTarefa},${resquest.body.taskTitle}, ${descricao?descricao:"Sem descrição"},
                               ${DataPrevistaPFinalizar?DataPrevistaPFinalizar: "NULL"}))`

        // sql`INSERT INTO TAREFAS values 
        //    (${idTarefa},${resquest.body.title}, ${descricao?descricao:"Sem descrição"}, ${DataPrevistaPFinalizar?DataPrevistaPFinalizar: "NULL"})`

        response.json({
            "StatusCode": "201",
            "msg": "Tarefa Adicionada com sucesso!!"
        });
    }
}

export function removeTask(resquest: Request, response: Response){
    if(!resquest.body.idUser){
        response.json({
            "StatusCode": "400",
            "msg": "O id do usuário deve ser informado!!"
        });
    }else if(!resquest.body.taskTitle){
        response.json({
            "StatusCode": "400",
            "msg": "O titulo da tarefa deve ser informado!!"
        });
    }else{
        sql`SELECT REMOVETASK(${resquest.body.idUser},${resquest.body.taskTitle})`
    }
}