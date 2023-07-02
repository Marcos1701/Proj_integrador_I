"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function Carregar_Tarefas() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = localStorage.getItem("token");
        const ordenacao = localStorage.getItem("ordenacao");
        const retorno = yield fetch("http://localhost:3000/tarefas/get/all", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, ordenacao }),
        });
        const result = yield retorno.json();
        if (result.erro) {
            console.log(result.erro);
            return;
        }
        const tarefas = result.tarefas;
        const div_tarefas = document.querySelector("#tarefas");
        if (!div_tarefas) {
            console.log("Elemento não encontrado");
            return;
        }
        if (tarefas.length === 0) {
            div_tarefas.innerHTML = "<h1>Nenhuma tarefa encontrada</h1>";
            return;
        }
        div_tarefas.innerHTML = "";
        const template_tarefas = document.querySelector("#template-tarefa");
        if (!template_tarefas) {
            console.log("Elemento não encontrado");
            return;
        }
        for (let pagina of tarefas) {
            for (let i = 0; i < pagina.length; i++) {
                const tarefa = pagina[i];
                const clone = template_tarefas.content.cloneNode(true);
                const div_tarefa = clone.querySelector(".tarefa");
                div_tarefa.setAttribute("id", tarefa.id.toString());
                // const div_tarefa_conteudo: HTMLDivElement = clone.querySelector(".tarefa-content") as HTMLDivElement;
                const titulo = clone.querySelector("#titulo_tarefa");
                const descricao = clone.querySelector("#descricao_tarefa");
                titulo.innerText = tarefa.titulo;
                descricao.innerText = tarefa.descricao;
                // const div_tarefa_data: HTMLDivElement = clone.querySelector(".tarefa-data") as HTMLDivElement;
                // const data: HTMLDivElement = clone.querySelector("#data_tarefa") as HTMLDivElement;
            }
        }
    });
}
function adicionar_tarefa() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = localStorage.getItem("token");
        const input_titulo = document.querySelector("#add_tarefa #titulo_tarefa");
        const input_descricao = document.querySelector("#add_tarefa #descricao_tarefa");
        const input_data = document.querySelector("#add_tarefa #data_tarefa");
        const input_prioridade = document.querySelector("#add_tarefa #prioridade_tarefa");
        const titulo = input_titulo.value ? input_titulo.value : "Sem título";
        const descricao = input_descricao.value ? input_descricao.value : "Sem descrição";
        const data = input_data.value ? new Date(input_data.value) : null;
        const prioridade = input_prioridade.value ? parseInt(input_prioridade.value) : 0;
        const retorno = yield fetch("http://localhost:3000/tarefas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, titulo, descricao, data, prioridade }),
        });
        const result = yield retorno.json();
        if (result.erro) {
            console.log(result.erro);
            return;
        }
        Carregar_Tarefas();
    });
}
window.onload = function () {
    const bnt_new_tarefa = document.querySelector("#nova_tarefa_bnt");
    const bnt_add_tarefa = document.querySelector("#salvar_tarefa_bnt");
    const bnt_cancelar_tarefa = document.querySelector("#cancelar_tarefa_bnt");
    const add_date = document.querySelector("#add_tarefa #switch");
    const menu_usuario = document.querySelector("#menu_usuario_bnt");
    const bnt_visualizar_perfil = document.querySelector("#perfil_bnt");
    const cancelar_alteracoes_usuario = document.getElementById("cancelar_perfil_bnt");
    const salvar_alteracoes_usuario = document.getElementById("salvar_perfil_bnt");
    if (!cancelar_alteracoes_usuario || !salvar_alteracoes_usuario) {
        console.log("Elemento não encontrado");
        return;
    }
    localStorage.setItem("ordenacao", "criacao");
    cancelar_alteracoes_usuario.addEventListener("click", function () {
        var _a;
        (_a = document.querySelector("#perfil_usuario")) === null || _a === void 0 ? void 0 : _a.setAttribute("hidden", "");
    });
    salvar_alteracoes_usuario.addEventListener("click", function () {
        var _a;
        (_a = document.querySelector("#perfil_usuario")) === null || _a === void 0 ? void 0 : _a.setAttribute("hidden", "");
    });
    if (!bnt_new_tarefa || !bnt_add_tarefa || !bnt_cancelar_tarefa
        || !add_date || !menu_usuario || !bnt_visualizar_perfil) {
        console.log("Elemento não encontrado");
        return;
    }
    bnt_visualizar_perfil.addEventListener("click", function () {
        var _a;
        (_a = document.querySelector("#perfil_usuario")) === null || _a === void 0 ? void 0 : _a.removeAttribute("hidden");
    });
    bnt_new_tarefa.addEventListener("click", function () {
        var _a;
        (_a = document.querySelector("#add_tarefa")) === null || _a === void 0 ? void 0 : _a.removeAttribute("hidden");
    });
    add_date.addEventListener("click", function () {
        const div_data = document.querySelector("#add_tarefa #data-tarefa");
        if (!div_data) {
            console.log("Elemento não encontrado");
            return;
        }
        if (add_date.checked) {
            div_data.removeAttribute("hidden");
        }
        else {
            div_data.setAttribute("hidden", "");
        }
    });
    bnt_cancelar_tarefa.addEventListener("click", function () {
        var _a;
        (_a = document.querySelector("#add_tarefa")) === null || _a === void 0 ? void 0 : _a.setAttribute("hidden", "");
    });
    menu_usuario.addEventListener("click", function () {
        const menu = document.querySelector("#menu");
        if (!menu) {
            console.log("Elemento não encontrado");
            return;
        }
        if (menu.getAttribute("hidden") === "") {
            menu.removeAttribute("hidden");
        }
        else {
            menu.setAttribute("hidden", "");
        }
    });
    const log_out = document.querySelector("#sair_bnt");
    if (!log_out) {
        console.log("Elemento não encontrado");
        return;
    }
    log_out.addEventListener("click", function () {
        window.location.href = "./login.html";
    });
};
