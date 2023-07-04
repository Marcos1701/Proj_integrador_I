import express, { Router } from "express";

import {
    Login_via_Google, Login_via_Email, Cadastro
} from './api_login.js'

import {
    adicionar_tarefa, editar_tarefa, excluir_tarefa,
    concluir_tarefa, get_tarefa, get_tarefas, desconcluir_tarefa
}
    from './api_tarefas.js'

import {
    adicionar_admin, get_usuarios, get_all_tarefas,
    get_tarefas_usuario, get_tarefas_pendentes,
    get_tarefas_concluidas, get_tarefas_atrasadas,
    confere_admin
} from './api_admin.js'

import { editar_usuario, excluir_usuario, get_data, confere_token } from './api_usuario.js'

export const router: Router = express.Router();

router.post('/login/google', Login_via_Google);
router.post('/login', Login_via_Email);
router.post('/cadastro', Cadastro);
router.post('/tarefas', adicionar_tarefa);
router.put('/tarefas', editar_tarefa);
router.delete('/tarefas', excluir_tarefa);
router.post('/tarefas/concluir', concluir_tarefa);
router.post('/tarefas/desconcluir', desconcluir_tarefa);
router.post('/tarefas/get', get_tarefa);
router.post('/tarefas/get/all', get_tarefas);
router.post('/admin', adicionar_admin);
router.post('/admin/confere', confere_admin);
router.post('/admin/get', get_usuarios);
router.post('/admin/get/all', get_all_tarefas);
router.post('/admin/get/tarefas', get_tarefas_usuario);
router.post('/admin/get/tarefas/pendentes', get_tarefas_pendentes);
router.post('/admin/get/tarefas/concluidas', get_tarefas_concluidas);
router.post('/admin/get/tarefas/atrasadas', get_tarefas_atrasadas);
router.put('/usuario', editar_usuario);
router.delete('/usuario', excluir_usuario);
router.post('/usuario/get', get_data);
router.post('/usuario/token', confere_token);