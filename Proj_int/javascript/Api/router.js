"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const api_login_js_1 = require("./api_login.js");
const api_tarefas_js_1 = require("./api_tarefas.js");
const api_admin_js_1 = require("./api_admin.js");
const api_usuario_js_1 = require("./api_usuario.js");
exports.router = express_1.default.Router();
exports.router.post('/login/google', api_login_js_1.Login_via_Google);
exports.router.post('/login', api_login_js_1.Login_via_Email);
exports.router.post('/cadastro', api_login_js_1.Cadastro);
exports.router.post('/tarefas', api_tarefas_js_1.adicionar_tarefa);
exports.router.put('/tarefas', api_tarefas_js_1.editar_tarefa);
exports.router.delete('/tarefas', api_tarefas_js_1.excluir_tarefa);
exports.router.post('/tarefas/concluir', api_tarefas_js_1.concluir_tarefa);
exports.router.post('/tarefas/desconcluir', api_tarefas_js_1.desconcluir_tarefa);
exports.router.post('/tarefas/get', api_tarefas_js_1.get_tarefa);
exports.router.post('/tarefas/get/all', api_tarefas_js_1.get_tarefas);
exports.router.post('/admin', api_admin_js_1.adicionar_admin);
exports.router.post('/admin/get', api_admin_js_1.get_usuarios);
exports.router.post('/admin/get/all', api_admin_js_1.get_all_tarefas);
exports.router.post('/admin/get/tarefas', api_admin_js_1.get_tarefas_usuario);
exports.router.post('/admin/get/tarefas/pendentes', api_admin_js_1.get_tarefas_pendentes);
exports.router.post('/admin/get/tarefas/concluidas', api_admin_js_1.get_tarefas_concluidas);
exports.router.post('/admin/get/tarefas/atrasadas', api_admin_js_1.get_tarefas_atrasadas);
exports.router.put('/usuario', api_usuario_js_1.editar_usuario);
exports.router.delete('/usuario', api_usuario_js_1.excluir_usuario);
exports.router.post('/usuario/get', api_usuario_js_1.get_data);
