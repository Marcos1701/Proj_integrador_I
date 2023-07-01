import express, { Router } from "express";

import {
    Login_via_Google, Login_via_Email, Cadastro
} from './api_login.js'

import {
    adicionar_tarefa, editar_tarefa, excluir_tarefa,
    concluir_tarefa, get_tarefa, get_tarefas
}
    from './api_tarefas.js'

import {
    adicionar_admin, get_usuarios, get_all_tarefas,
    get_tarefas_usuario, get_tarefas_pendentes,
    get_tarefas_concluidas, get_tarefas_atrasadas
} from './api_admin.js'


export const router: Router = express.Router();

router.post('/login/google', Login_via_Google);
router.post('/login', Login_via_Email);
router.post('/cadastro', Cadastro);
router.post('/tarefas', adicionar_tarefa);
router.put('/tarefas', editar_tarefa);
router.delete('/tarefas', excluir_tarefa);
router.post('/tarefas/concluir', concluir_tarefa);
router.post('/tarefas/get', get_tarefa);
router.post('/tarefas/get/all', get_tarefas);
router.post('/admin', adicionar_admin);
router.post('/admin/get', get_usuarios);
router.post('/admin/get/all', get_all_tarefas);
router.post('/admin/get/tarefas', get_tarefas_usuario);
router.post('/admin/get/tarefas/pendentes', get_tarefas_pendentes);
router.post('/admin/get/tarefas/concluidas', get_tarefas_concluidas);
router.post('/admin/get/tarefas/atrasadas', get_tarefas_atrasadas);