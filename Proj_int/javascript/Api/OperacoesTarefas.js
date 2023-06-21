"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTask = exports.getTasks = exports.updateTask = exports.removeTask = exports.addTask = void 0;
const uuid_1 = require("uuid");
const Acessa_bd_1 = __importDefault(require("./Acessa_bd"));
function addTask(resquest, response) {
    if (!resquest.body.idUser) {
        response.json({
            "StatusCode": "400",
            "msg": "O id do usuário deve ser informado!!"
        });
    }
    else if (!resquest.body.taskTitle) {
        response.json({
            "StatusCode": "400",
            "msg": "O titulo da tarefa deve ser informado!!"
        });
    }
    else {
        const descricao = resquest.body.descricaoTarefa;
        const DataPrevistaPFinalizar = resquest.body.dataPrevista;
        const idTarefa = (0, uuid_1.v4)();
        (0, Acessa_bd_1.default) `SELECT ADDTAREFA(${resquest.body.idUser},${idTarefa},${resquest.body.taskTitle}, ${descricao ? descricao : "Sem descrição"},
                               ${DataPrevistaPFinalizar ? DataPrevistaPFinalizar : "NULL"}))`;
        // sql`INSERT INTO TAREFAS values 
        //    (${idTarefa},${resquest.body.title}, ${descricao?descricao:"Sem descrição"}, ${DataPrevistaPFinalizar?DataPrevistaPFinalizar: "NULL"})`
        response.json({
            "StatusCode": "201",
            "msg": "Tarefa Adicionada com sucesso!!"
        });
    }
}
exports.addTask = addTask;
function removeTask(resquest, response) {
    if (!resquest.body.idUser) {
        response.json({
            "StatusCode": "400",
            "msg": "O id do usuário deve ser informado!!"
        });
    }
    else if (!resquest.body.taskid) {
        response.json({
            "StatusCode": "400",
            "msg": "O id da tarefa deve ser informado!!"
        });
    }
    else {
        (0, Acessa_bd_1.default) `SELECT REMOVETASK(${resquest.body.idUser},${resquest.body.taskid})`;
    }
}
exports.removeTask = removeTask;
function updateTask(resquest, response) {
    if (!resquest.body.idUser) {
        response.json({
            "StatusCode": "400",
            "msg": "O id do usuário deve ser informado!!"
        });
    }
    else if (!resquest.body.taskid) {
        response.json({
            "StatusCode": "400",
            "msg": "O id da tarefa deve ser informado!!"
        });
    }
    else {
        const descricao = resquest.body.descricaoTarefa;
        const DataPrevistaPFinalizar = resquest.body.dataPrevista;
        (0, Acessa_bd_1.default) `SELECT UPDATETASK(${resquest.body.idUser},${resquest.body.taskid},${resquest.body.taskTitle}, ${descricao ? descricao : "Sem descrição"},
                               ${DataPrevistaPFinalizar ? DataPrevistaPFinalizar : "NULL"}))`;
        response.json({
            "StatusCode": "201",
            "msg": "Tarefa Atualizada com sucesso!!"
        });
    }
}
exports.updateTask = updateTask;
function getTasks(resquest, response) {
    if (!resquest.body.idUser) {
        response.json({
            "StatusCode": "400",
            "msg": "O id do usuário deve ser informado!!"
        });
    }
    else {
        const retorno = (0, Acessa_bd_1.default) `SELECT GETTASKS(${resquest.body.idUser})`;
        response.json({ "Resultado": retorno,
            "StatusCode": "201",
            "msg": "Tarefa Atualizada com sucesso!!" });
    }
}
exports.getTasks = getTasks;
function getTask(resquest, response) {
    if (!resquest.body.idUser) {
        response.json({
            "StatusCode": "400",
            "msg": "O id do usuário deve ser informado!!"
        });
    }
    else if (!resquest.body.taskid) {
        response.json({
            "StatusCode": "400",
            "msg": "O id da tarefa deve ser informado!!"
        });
    }
    else {
        const retorno = (0, Acessa_bd_1.default) `SELECT GETTASK(${resquest.body.idUser},${resquest.body.taskid})`;
        if (retorno == null) {
            response.json({
                "StatusCode": "400",
                "msg": "Tarefa não encontrada!!"
            });
        }
        else {
            response.json({ "Resultado": retorno,
                "StatusCode": "201",
                "msg": "Tarefa encontrada com sucesso!!" });
        }
    }
}
exports.getTask = getTask;
