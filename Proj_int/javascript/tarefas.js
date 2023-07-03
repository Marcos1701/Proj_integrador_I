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
Object.defineProperty(exports, "__esModule", { value: true });
exports.concluir_tarefa = exports.adicionar_tarefa = exports.excluir_tarefa = exports.editar_tarefa = exports.Carregar_Tarefas = void 0;
function editar_tarefa(id, titulo, descricao, prioridade, data_conclusao) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (_a = document.querySelector("#loading")) === null || _a === void 0 ? void 0 : _a.removeAttribute("hidden");
            const data = data_conclusao ? new Date(data_conclusao) : null;
            const retorno = yield fetch("http://localhost:3000/tarefas", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, id, titulo, descricao, data, prioridade }),
            });
            (_b = document.querySelector("#loading")) === null || _b === void 0 ? void 0 : _b.setAttribute("hidden", "");
            if (retorno.status === 200) {
                Carregar_Tarefas();
            }
            else {
                const { erro } = yield retorno.json();
                return { error: erro };
            }
        }
        catch (error) {
            console.log(error);
        }
        return;
    });
}
exports.editar_tarefa = editar_tarefa;
function excluir_tarefa(id) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        (_a = document.querySelector("#loading")) === null || _a === void 0 ? void 0 : _a.removeAttribute("hidden");
        yield fetch("http://localhost:3000/tarefas", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, id }),
        }).then((retorno) => __awaiter(this, void 0, void 0, function* () {
            if (retorno.status === 204) {
                Carregar_Tarefas();
            }
            else {
                const { erro } = yield retorno.json();
                return { error: erro };
            }
        })).finally(() => {
            var _a;
            (_a = document.querySelector("#loading")) === null || _a === void 0 ? void 0 : _a.setAttribute("hidden", "");
        });
    });
}
exports.excluir_tarefa = excluir_tarefa;
function concluir_tarefa(id) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        (_a = document.querySelector("#loading")) === null || _a === void 0 ? void 0 : _a.removeAttribute("hidden");
        yield fetch("http://localhost:3000/tarefas/concluir", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, id }),
        }).then((retorno) => __awaiter(this, void 0, void 0, function* () {
            if (retorno.status === 200) {
                Carregar_Tarefas();
            }
            else {
                const { erro } = yield retorno.json();
                return { error: erro };
            }
        })).finally(() => {
            var _a;
            (_a = document.querySelector("#loading")) === null || _a === void 0 ? void 0 : _a.setAttribute("hidden", "");
        });
    });
}
exports.concluir_tarefa = concluir_tarefa;
function Carregar_Tarefas() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (_a = document.querySelector("#loading")) === null || _a === void 0 ? void 0 : _a.removeAttribute("hidden");
            if (!ordenacao) {
                console.log("Ordenação não definida");
                return [];
            }
            const pagina_atual = document.getElementById("pagina_atual");
            if (!pagina_atual) {
                console.log("Pagina atual não encontrada");
                return [];
            }
            let pagina = parseInt(pagina_atual.innerText);
            if (!pagina || pagina < 1 || isNaN(pagina)) {
                pagina_atual.innerText = "1";
                pagina = 1;
            }
            const retorno = yield fetch("http://localhost:3000/tarefas/get/all", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, ordenacao, pagina })
            });
            let total = 0;
            let tarefas = [];
            let erro = "";
            if (retorno.status === 200) {
                const result = yield retorno.json();
                tarefas = result.tarefas;
                total = result.total;
            }
            else {
                const result = yield retorno.json();
                erro = result.erro;
            }
            if (erro.length > 0) {
                console.log(erro);
                return [];
            }
            console.log(tarefas);
            const div_tarefas = document.querySelector("#tarefas-conteiner");
            if (!div_tarefas) {
                console.log("Elemento não encontrado");
                return [];
            }
            if (tarefas.length === 0) {
                div_tarefas.innerHTML = "<h3>Nenhuma tarefa encontrada</h3>";
                return [];
            }
            // console.log(tarefas);
            div_tarefas.innerHTML = "";
            const template_tarefas = document.querySelector("#template-tarefa");
            if (!template_tarefas) {
                console.log("Elemento não encontrado");
                return [];
            }
            for (let i = 0; i < tarefas.length; i++) {
                const tarefa = tarefas[i];
                const clone = template_tarefas.content.cloneNode(true);
                const div_tarefa = clone.querySelector(".tarefa");
                div_tarefa.setAttribute("id", tarefa.id);
                const titulo = clone.querySelector("#titulo_tarefa");
                const descricao = clone.querySelector("#descricao_tarefa");
                const data_tarefa = clone.querySelector("#data_tarefa");
                const data_criacao_tarefa = clone.querySelector("#data_criacao_tarefa");
                const prioridade_tarefa = clone.querySelector("#prioridade_tarefa");
                const status_tarefa = clone.querySelector("#status_tarefa");
                const btn_editar_tarefa = clone.querySelector("#botoes_tarefa #editar_tarefa_bnt");
                const btn_excluir_tarefa = clone.querySelector("#botoes_tarefa #excluir_tarefa_bnt");
                const concluir_tarefa = clone.querySelector("#concluir_tarefa_checkbox");
                titulo.innerText = tarefa.titulo;
                descricao.innerText = tarefa.descricao;
                data_tarefa.innerText = `Data Conclusão: ${tarefa.data ? new Date(tarefa.data).toLocaleDateString() : "Sem data"}`;
                data_criacao_tarefa.innerText = `Data Criação: ${new Date(tarefa.data_criacao).toLocaleDateString()}`;
                prioridade_tarefa.innerText = `Prioridade: ${tarefa.prioridade}`;
                let status;
                if (tarefa.status === "P") {
                    status = "Pendente";
                }
                else if (tarefa.status === "C") {
                    status = "Concluida";
                }
                else {
                    status = "Atrasada";
                }
                status_tarefa.innerText = `Status: ${status}`;
                if (tarefa.status === "C") {
                    concluir_tarefa.setAttribute("checked", "");
                }
                btn_editar_tarefa.addEventListener("click", () => {
                    const div_editar_tarefa = document.querySelector("#edit_tarefa");
                    if (!div_editar_tarefa) {
                        console.log("Elemento não encontrado");
                        return;
                    }
                    const section_tarefa = div_editar_tarefa.querySelector(".editar_tarefa");
                    if (!section_tarefa) {
                        console.log("Elemento não encontrado");
                        return;
                    }
                    section_tarefa.setAttribute("id", tarefa.id);
                    const titulo_editar_tarefa = div_editar_tarefa.querySelector("#edit-titulo_tarefa");
                    const descricao_editar_tarefa = div_editar_tarefa.querySelector("#edit-descricao_tarefa");
                    const data_editar_tarefa = div_editar_tarefa.querySelector("#edit-data_tarefa");
                    const prioridade_editar_tarefa = div_editar_tarefa.querySelector("#edit-prioridade_tarefa");
                    const cancelar_editar_tarefa = div_editar_tarefa.querySelector("#cancelar_edit-tarefa_bnt");
                    const salvar_editar_tarefa = div_editar_tarefa.querySelector("#salvar_edit-tarefa_bnt");
                    titulo_editar_tarefa.value = tarefa.titulo;
                    descricao_editar_tarefa.value = tarefa.descricao;
                    data_editar_tarefa.value = tarefa.data ? new Date(tarefa.data).toISOString().split("T")[0] : "";
                    prioridade_editar_tarefa.value = tarefa.prioridade;
                    div_editar_tarefa.removeAttribute("hidden");
                    cancelar_editar_tarefa.addEventListener("click", () => {
                        div_editar_tarefa.setAttribute("hidden", "");
                    });
                    salvar_editar_tarefa.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                        editar_tarefa(tarefa.id, titulo_editar_tarefa.value, descricao_editar_tarefa.value, prioridade_editar_tarefa.value, data_editar_tarefa.value);
                    }));
                });
                btn_excluir_tarefa.addEventListener("click", () => {
                    const confirmacao_excluir_tarefa = confirm("Deseja excluir a tarefa?");
                    if (confirmacao_excluir_tarefa) {
                        excluir_tarefa(tarefa.id);
                    }
                });
                const tarefa_content = clone.querySelector(".tarefa-content");
                if (!tarefa_content) {
                    console.log("Elemento não encontrado");
                    return [];
                }
                tarefa_content.addEventListener("click", () => {
                    const div_visualizar_tarefa = document.querySelector("#visualizar_tarefa");
                    if (!div_visualizar_tarefa) {
                        console.log("Elemento não encontrado");
                        return;
                    }
                    const section_tarefa = div_visualizar_tarefa.querySelector(".visualizar-tarefa");
                    if (!section_tarefa) {
                        console.log("Elemento não encontrado");
                        return;
                    }
                    section_tarefa.setAttribute("id", tarefa.id);
                    const titulo_visualizar_tarefa = div_visualizar_tarefa.querySelector("#titulo_tarefa");
                    const descricao_visualizar_tarefa = div_visualizar_tarefa.querySelector("#descricao_tarefa");
                    const data_visualizar_tarefa = div_visualizar_tarefa.querySelector("#data_tarefa");
                    const data_criacao_visualizar_tarefa = div_visualizar_tarefa.querySelector("#data_criacao_tarefa");
                    const prioridade_visualizar_tarefa = div_visualizar_tarefa.querySelector("#prioridade_tarefa");
                    const status_visualizar_tarefa = div_visualizar_tarefa.querySelector("#status_tarefa");
                    titulo_visualizar_tarefa.innerText = tarefa.titulo;
                    descricao_visualizar_tarefa.innerText = tarefa.descricao;
                    data_visualizar_tarefa.innerText = tarefa.data ? new Date(tarefa.data).toLocaleDateString() : "Sem data";
                    data_criacao_visualizar_tarefa.innerText = new Date(tarefa.data_criacao).toLocaleDateString();
                    prioridade_visualizar_tarefa.innerText = tarefa.prioridade;
                    // console.log(tarefa.status)
                    let status = "";
                    if (tarefa.status === "P") {
                        status = "Pendente";
                    }
                    else if (tarefa.status === "C") {
                        status = "Concluida";
                    }
                    else {
                        status = "Atrasada";
                    }
                    status_visualizar_tarefa.innerText = status;
                    const sair_visualizar_tarefa = div_visualizar_tarefa.querySelector("#sair_visualizacao_tarefa");
                    const btn_editar_tarefa = div_visualizar_tarefa.querySelector("#editar_tarefa_bnt");
                    const btn_excluir_tarefa = div_visualizar_tarefa.querySelector("#excluir_tarefa_bnt");
                    sair_visualizar_tarefa.addEventListener("click", () => {
                        div_visualizar_tarefa.setAttribute("hidden", "");
                    });
                    btn_editar_tarefa.addEventListener("click", () => {
                        const div_editar_tarefa = document.querySelector("#edit_tarefa");
                        if (!div_editar_tarefa) {
                            console.log("Elemento não encontrado");
                            return;
                        }
                        const section_tarefa = div_editar_tarefa.querySelector(".editar_tarefa");
                        if (!section_tarefa) {
                            console.log("Elemento não encontrado");
                            return;
                        }
                        section_tarefa.setAttribute("id", tarefa.id);
                        const titulo_editar_tarefa = div_editar_tarefa.querySelector("#edit-titulo_tarefa");
                        const descricao_editar_tarefa = div_editar_tarefa.querySelector("#edit-descricao_tarefa");
                        const data_editar_tarefa = div_editar_tarefa.querySelector("#edit-data_tarefa");
                        const prioridade_editar_tarefa = div_editar_tarefa.querySelector("#edit-prioridade_tarefa");
                        const cancelar_editar_tarefa = div_editar_tarefa.querySelector("#cancelar_edit-tarefa_bnt");
                        const salvar_editar_tarefa = div_editar_tarefa.querySelector("#salvar_edit-tarefa_bnt");
                        titulo_editar_tarefa.value = tarefa.titulo;
                        descricao_editar_tarefa.value = tarefa.descricao;
                        data_editar_tarefa.value = tarefa.data ? new Date(tarefa.data).toISOString().split("T")[0] : "";
                        prioridade_editar_tarefa.value = tarefa.prioridade;
                        div_editar_tarefa.removeAttribute("hidden");
                        cancelar_editar_tarefa.addEventListener("click", () => {
                            div_editar_tarefa.setAttribute("hidden", "");
                        });
                        salvar_editar_tarefa.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                            editar_tarefa(section_tarefa.id, titulo_editar_tarefa.value, descricao_editar_tarefa.value, prioridade_editar_tarefa.value, data_editar_tarefa.value);
                        }));
                    });
                    btn_excluir_tarefa.addEventListener("click", () => {
                        const confirmacao_excluir_tarefa = confirm("Deseja excluir a tarefa?");
                        if (confirmacao_excluir_tarefa) {
                            excluir_tarefa(tarefa.id);
                        }
                    });
                    div_visualizar_tarefa.removeAttribute("hidden");
                });
                div_tarefas.appendChild(clone);
            }
            const total_paginas = document.querySelector("#total_paginas");
            total_paginas.innerText = `${total}`;
            return tarefas;
        }
        catch (error) {
            console.log(error);
            return [];
        }
        finally {
            (_b = document.querySelector("#loading")) === null || _b === void 0 ? void 0 : _b.setAttribute("hidden", "");
        }
    });
}
exports.Carregar_Tarefas = Carregar_Tarefas;
function adicionar_tarefa() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = localStorage.getItem("token");
        const input_titulo = document.querySelector("#titulo_tarefa_input");
        const input_descricao = document.querySelector("#descricao_tarefa_input");
        const input_data = document.querySelector("#data_tarefa_input");
        const input_prioridade = document.querySelector("#prioridade_tarefa_input");
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
    });
}
exports.adicionar_tarefa = adicionar_tarefa;
