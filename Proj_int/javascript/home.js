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
const token = localStorage.getItem("token");
const ordenacao = localStorage.getItem("ordenacao");
if (!token) {
    window.location.href = "login.html";
}
if (!ordenacao) {
    localStorage.setItem("ordenacao", "criacao");
}
function editar_tarefa(id, titulo, descricao, prioridade, data_conclusao) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        (_a = document.querySelector("#loading")) === null || _a === void 0 ? void 0 : _a.removeAttribute("hidden");
        yield fetch("http://localhost:3000/tarefas", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, id, titulo, descricao, data_conclusao, prioridade }),
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
function Carregar_Tarefas() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        (_a = document.querySelector("#loading")) === null || _a === void 0 ? void 0 : _a.removeAttribute("hidden");
        const retorno = yield fetch("http://localhost:3000/tarefas/get/all", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, ordenacao }),
        }).then((retorno) => __awaiter(this, void 0, void 0, function* () {
            if (retorno.status === 200) {
                const { tarefas } = yield retorno.json();
                console.log(tarefas);
                return tarefas;
            }
            else {
                const { erro } = yield retorno.json();
                return { error: erro };
            }
        })).finally(() => {
            var _a;
            (_a = document.querySelector("#loading")) === null || _a === void 0 ? void 0 : _a.setAttribute("hidden", "");
        });
        const tarefas = retorno;
        const div_tarefas = document.querySelector("#tarefas-conteiner");
        if (!div_tarefas) {
            console.log("Elemento não encontrado");
            return [];
        }
        // console.log(tarefas);
        if (tarefas.length === 0) {
            div_tarefas.innerHTML = "<h3>Nenhuma tarefa encontrada</h3>";
            return [];
        }
        console.log(tarefas);
        div_tarefas.innerHTML = "";
        const template_tarefas = document.querySelector("#template-tarefa");
        if (!template_tarefas) {
            console.log("Elemento não encontrado");
            return [];
        }
        const pagina_atual = (_b = document.getElementById("pagina_atual")) === null || _b === void 0 ? void 0 : _b.innerText;
        if (!pagina_atual) {
            console.log("Pagina atual não encontrada");
            return [];
        }
        const pagina = parseInt(pagina_atual);
        for (let i = 0; i < tarefas[pagina].length; i++) {
            const tarefa = tarefas[pagina][i];
            const clone = template_tarefas.content.cloneNode(true);
            const div_tarefa = clone.querySelector(".tarefa");
            div_tarefa.setAttribute("id", tarefa.id);
            const titulo = clone.querySelector("#titulo_tarefa");
            const descricao = clone.querySelector("#descricao_tarefa");
            const data_tarefa = clone.querySelector("#data_tarefa");
            const data_criacao_tarefa = clone.querySelector("#data_criacao_tarefa");
            const prioridade_tarefa = clone.querySelector("#prioridade_tarefa");
            const status_tarefa = clone.querySelector("#status_tarefa");
            const btn_editar_tarefa = clone.querySelector("#editar_tarefa");
            const btn_excluir_tarefa = clone.querySelector("#excluir_tarefa");
            const concluir_tarefa = clone.querySelector("#concluir_tarefa_checkbox");
            titulo.innerText = tarefa.titulo;
            descricao.innerText = tarefa.descricao;
            data_tarefa.innerText = `Data Conclusão: ${tarefa.data ? new Date(tarefa.data).toLocaleDateString() : "Sem data"}`;
            data_criacao_tarefa.innerText = `Data Criação: ${new Date(tarefa.data_criacao).toLocaleDateString()}`;
            prioridade_tarefa.innerText = `Prioridade: ${tarefa.prioridade}`;
            status_tarefa.innerText = `Status: ${tarefa.status === "P" ? "Pendente" : tarefa.status === "C" ? "Concluida" : "Atrasada"}`;
            if (tarefa.status === "C") {
                concluir_tarefa.setAttribute("checked", "");
            }
            btn_editar_tarefa.addEventListener("click", () => {
                const div_editar_tarefa = document.querySelector("#edit_tarefa");
                if (!div_editar_tarefa) {
                    console.log("Elemento não encontrado");
                    return;
                }
                const section_tarefa = div_editar_tarefa.querySelector("#editar_tarefa");
                if (!section_tarefa) {
                    console.log("Elemento não encontrado");
                    return;
                }
                section_tarefa.setAttribute("id", tarefa.id);
                const titulo_editar_tarefa = div_editar_tarefa.querySelector("#edit-titulo_tarefa");
                const descricao_editar_tarefa = div_editar_tarefa.querySelector("#edit-descricao_tarefa");
                const data_editar_tarefa = div_editar_tarefa.querySelector("#edit-data_tarefa");
                const prioridade_editar_tarefa = div_editar_tarefa.querySelector("#edit-prioridade_tarefa");
                const cancelar_editar_tarefa = div_editar_tarefa.querySelector("#cancelar_tarefa_bnt");
                const salvar_editar_tarefa = div_editar_tarefa.querySelector("#salvar_tarefa_bnt");
                titulo_editar_tarefa.value = tarefa.titulo;
                descricao_editar_tarefa.value = tarefa.descricao;
                data_editar_tarefa.value = tarefa.data ? new Date(tarefa.data).toISOString().split("T")[0] : "";
                prioridade_editar_tarefa.value = tarefa.prioridade;
                div_editar_tarefa.removeAttribute("hidden");
                cancelar_editar_tarefa.addEventListener("click", () => {
                    div_editar_tarefa.setAttribute("hidden", "");
                });
                salvar_editar_tarefa.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                    editar_tarefa(tarefa.id, titulo_editar_tarefa.value, descricao_editar_tarefa.value, data_editar_tarefa.value, prioridade_editar_tarefa.value);
                }));
            });
            btn_excluir_tarefa.addEventListener("click", () => {
                const confirmacao_excluir_tarefa = confirm("Deseja excluir a tarefa?");
                if (confirmacao_excluir_tarefa) {
                    excluir_tarefa(tarefa.id);
                }
            });
            clone.addEventListener("click", () => {
                const div_visualizar_tarefa = document.querySelector("#visualizar_tarefa");
                if (!div_visualizar_tarefa) {
                    console.log("Elemento não encontrado");
                    return;
                }
                const section_tarefa = div_visualizar_tarefa.querySelector("#tarefa");
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
                data_visualizar_tarefa.innerText = `Data Conclusão: ${tarefa.data ? new Date(tarefa.data).toLocaleDateString() : "Sem data"}`;
                data_criacao_visualizar_tarefa.innerText = `Data Criação: ${new Date(tarefa.data_criacao).toLocaleDateString()}`;
                prioridade_visualizar_tarefa.innerText = `Prioridade: ${tarefa.prioridade}`;
                status_visualizar_tarefa.innerText = `Status: ${tarefa.status === "P" ? "Pendente" : tarefa.status === "C" ? "Concluida" : "Atrasada"}`;
                const btn_editar_tarefa = div_visualizar_tarefa.querySelector("#editar_tarefa");
                const btn_excluir_tarefa = div_visualizar_tarefa.querySelector("#excluir_tarefa");
                btn_editar_tarefa.addEventListener("click", () => {
                    const div_editar_tarefa = document.querySelector("#edit_tarefa");
                    if (!div_editar_tarefa) {
                        console.log("Elemento não encontrado");
                        return;
                    }
                    const section_tarefa = div_editar_tarefa.querySelector("#editar_tarefa");
                    if (!section_tarefa) {
                        console.log("Elemento não encontrado");
                        return;
                    }
                    section_tarefa.setAttribute("id", tarefa.id);
                    const titulo_editar_tarefa = div_editar_tarefa.querySelector("#edit-titulo_tarefa");
                    const descricao_editar_tarefa = div_editar_tarefa.querySelector("#edit-descricao_tarefa");
                    const data_editar_tarefa = div_editar_tarefa.querySelector("#edit-data_tarefa");
                    const prioridade_editar_tarefa = div_editar_tarefa.querySelector("#edit-prioridade_tarefa");
                    const cancelar_editar_tarefa = div_editar_tarefa.querySelector("#cancelar_tarefa_bnt");
                    const salvar_editar_tarefa = div_editar_tarefa.querySelector("#salvar_tarefa_bnt");
                    titulo_editar_tarefa.value = tarefa.titulo;
                    descricao_editar_tarefa.value = tarefa.descricao;
                    data_editar_tarefa.value = tarefa.data ? new Date(tarefa.data).toISOString().split("T")[0] : "";
                    prioridade_editar_tarefa.value = tarefa.prioridade;
                    div_editar_tarefa.removeAttribute("hidden");
                    cancelar_editar_tarefa.addEventListener("click", () => {
                        div_editar_tarefa.setAttribute("hidden", "");
                    });
                    salvar_editar_tarefa.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                        editar_tarefa(tarefa.id, titulo_editar_tarefa.value, descricao_editar_tarefa.value, data_editar_tarefa.value, prioridade_editar_tarefa.value);
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
        return tarefas;
    });
}
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
function atualizar_paginas(tarefas) {
    const pagina_atual = document.getElementById("pagina_atual");
    const pagina_seguinte = document.getElementById("pagina_seguinte");
    const total_paginas = document.getElementById("total_paginas");
    const separador = document.getElementById("separador");
    if (!pagina_atual || !pagina_seguinte || !total_paginas || !separador) {
        console.log("Paginas não encontradas");
        return;
    }
    if (tarefas.length < 2) {
        pagina_atual.innerText = "1";
        pagina_seguinte.setAttribute("hidden", "");
        total_paginas.innerText = "1";
        return;
    }
    pagina_seguinte.removeAttribute("hidden");
    if (parseInt(pagina_atual.innerText) < tarefas.length) {
        pagina_seguinte.innerText = `${parseInt(pagina_atual.innerText) + 1}`;
    }
    else {
        pagina_seguinte.setAttribute("hidden", "");
    }
    total_paginas.innerText = tarefas.length.toString();
    separador.addEventListener("click", () => {
        if (tarefas.length < 3)
            return;
        const div_pags = pagina_atual.parentElement;
        const aux1 = document.createElement("a");
        const aux2 = document.createElement("a");
        aux1.innerText = `${parseInt(pagina_seguinte.innerText) + 1}`;
        aux2.innerText = `${parseInt(total_paginas.innerText) - 1}`;
        div_pags.insertBefore(pagina_seguinte, aux1);
        div_pags.insertBefore(separador, aux2);
    });
    const proxima_pagina = document.getElementById("proximo_bnt");
    const pagina_anterior = document.getElementById("anterior_bnt");
    if (!proxima_pagina || !pagina_anterior) {
        console.log("Paginas não encontradas");
        return;
    }
    proxima_pagina.addEventListener("click", () => {
        const pagina = parseInt(pagina_atual.innerText);
        if (pagina >= tarefas.length) {
            return;
        }
        pagina_atual.innerText = `${pagina + 1}`;
        pagina_seguinte.innerText = `${pagina + 2}`;
    });
    pagina_anterior.addEventListener("click", () => {
        const pagina = parseInt(pagina_atual.innerText);
        if (pagina <= 1) {
            return;
        }
        pagina_atual.innerText = `${pagina - 1}`;
        pagina_seguinte.innerText = `${pagina}`;
    });
}
function atualizar_tarefas(tarefas) {
    const div_tarefas = document.querySelector("#tarefas");
    if (!div_tarefas) {
        console.log("Div de tarefas não encontrada");
        return;
    }
    div_tarefas.innerHTML = "";
    const pagina_atual = document.getElementById("pagina_atual");
    if (!pagina_atual) {
        console.log("Pagina atual não encontrada");
        return;
    }
    const pagina = parseInt(pagina_atual.innerText);
    const tarefas_pagina = tarefas[pagina - 1];
    if (!tarefas_pagina) {
        console.log("Tarefas da pagina não encontradas");
        return;
    }
    tarefas_pagina.forEach((tarefa) => {
        const template = document.querySelector("#template-tarefa");
        const clone = template.content.cloneNode(true);
        const div_tarefa = clone.querySelector(".tarefa");
        const tarefa_content = clone.querySelector(".tarefa-content");
        const titulo_tarefa = clone.querySelector("#titulo_tarefa");
        const descricao_tarefa = clone.querySelector("#descricao_tarefa");
        const data_tarefa = clone.querySelector("#data_tarefa");
        const data_criacao_tarefa = clone.querySelector("#data_criacao_tarefa");
        const prioridade_tarefa = clone.querySelector("#prioridade_tarefa");
        const status_tarefa = clone.querySelector("#status_tarefa");
        if (!div_tarefa || !tarefa_content || !titulo_tarefa || !descricao_tarefa
            || !data_tarefa || !data_criacao_tarefa || !prioridade_tarefa || !status_tarefa) {
            console.log("Elementos da tarefa não encontrados");
            return;
        }
        titulo_tarefa.innerText = tarefa.titulo;
        descricao_tarefa.innerText = tarefa.descricao;
        data_tarefa.innerText = `Data Conclusão: ${tarefa.data_conclusao ? tarefa.data_conclusao : "Não definida"}`;
        data_criacao_tarefa.innerText = `Criada em: ${tarefa.data_criacao}`;
        prioridade_tarefa.innerText = `Prioridade: ${tarefa.prioridade}`;
        status_tarefa.innerText = `Status: ${tarefa.status}`;
        div_tarefas.appendChild(div_tarefa);
    });
}
window.onload = function () {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let tarefas = yield Carregar_Tarefas();
        // referentes a tarefas
        const bnt_new_tarefa = document.querySelector("#nova_tarefa_bnt");
        const bnt_add_tarefa = document.querySelector("#salvar_tarefa_bnt");
        const bnt_cancelar_tarefa = document.querySelector("#cancelar_tarefa_bnt");
        const add_date = document.querySelector("#add_tarefa #switch");
        const visualizar_tarefa = document.querySelector("#visualizar_tarefa");
        const sair_visualizar_tarefa = document.querySelector("#sair_visualizacao_tarefa");
        // referentes ao menu
        const menu_usuario = document.querySelector("#menu_usuario_bnt");
        const bnt_visualizar_perfil = document.querySelector("#perfil_bnt");
        const cancelar_alteracoes_usuario = document.getElementById("cancelar_perfil_bnt");
        const salvar_alteracoes_usuario = document.getElementById("salvar_perfil_bnt");
        // referentes a configurações
        const configuracoes = document.querySelector("#config_bnt");
        const select_ordenacao = document.querySelector("#select-filtros");
        const bnt_salvar_conf = document.querySelector("#salvar_conf_bnt");
        const bnt_cancelar_conf = document.querySelector("#cancelar_conf_bnt");
        const div_pags = document.querySelector("#paginas");
        if (!cancelar_alteracoes_usuario || !salvar_alteracoes_usuario
            || !configuracoes || !select_ordenacao || !bnt_salvar_conf || !bnt_cancelar_conf
            || !menu_usuario || !bnt_visualizar_perfil || !bnt_new_tarefa || !bnt_add_tarefa) {
            console.log("Elemento não encontrado");
            return;
        }
        atualizar_paginas(tarefas);
        div_pags.childNodes.forEach((child) => {
            if (child.if != undefined && child.id != "separador" && child.id != "pagina_atual") {
                child.addEventListener("click", () => {
                    const pagina = parseInt(child.innerText);
                    const pagina_atual = document.getElementById("pagina_atual");
                    pagina_atual.innerText = `${pagina}`;
                    atualizar_paginas(tarefas);
                    atualizar_tarefas(tarefas);
                });
            }
        });
        cancelar_alteracoes_usuario.addEventListener("click", function () {
            var _a;
            (_a = document.querySelector("#perfil_usuario")) === null || _a === void 0 ? void 0 : _a.setAttribute("hidden", "");
        });
        salvar_alteracoes_usuario.addEventListener("click", function () {
            var _a;
            (_a = document.querySelector("#perfil_usuario")) === null || _a === void 0 ? void 0 : _a.setAttribute("hidden", "");
        });
        if (!bnt_new_tarefa || !bnt_add_tarefa || !bnt_cancelar_tarefa
            || !add_date || !menu_usuario || !bnt_visualizar_perfil ||
            !configuracoes || !select_ordenacao || !bnt_salvar_conf || !bnt_cancelar_conf
            || !visualizar_tarefa || !sair_visualizar_tarefa || !div_pags) {
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
        bnt_add_tarefa.addEventListener("click", function () {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                adicionar_tarefa();
                tarefas = yield Carregar_Tarefas();
                (_a = document.querySelector("#add_tarefa")) === null || _a === void 0 ? void 0 : _a.setAttribute("hidden", "");
            });
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
        configuracoes.addEventListener("click", function () {
            const div_configuracoes = document.querySelector("#configuracoes");
            if (!div_configuracoes) {
                console.log("Elemento não encontrado");
                return;
            }
            if (div_configuracoes.getAttribute("hidden") === "") {
                div_configuracoes.removeAttribute("hidden");
            }
            else {
                div_configuracoes.setAttribute("hidden", "");
            }
        });
        bnt_salvar_conf.addEventListener("click", function () {
            var _a;
            const ordenacao = select_ordenacao.value;
            console.log(ordenacao);
            if (ordenacao !== "criacao" && ordenacao !== "prioridade" && ordenacao !== "conclusao") {
                console.log("Ordenação inválida");
                return;
            }
            window.localStorage.setItem("ordenacao", ordenacao);
            (_a = document.querySelector("#configuracoes")) === null || _a === void 0 ? void 0 : _a.setAttribute("hidden", "");
            Carregar_Tarefas();
        });
        bnt_cancelar_conf.addEventListener("click", function () {
            var _a;
            (_a = document.querySelector("#configuracoes")) === null || _a === void 0 ? void 0 : _a.setAttribute("hidden", "");
        });
        visualizar_tarefa.addEventListener("click", function () {
            visualizar_tarefa.setAttribute("hidden", "");
        });
        sair_visualizar_tarefa.addEventListener("click", function () {
            visualizar_tarefa.setAttribute("hidden", "");
        });
        const log_out = document.querySelector("#sair_bnt");
        if (!log_out) {
            console.log("Elemento não encontrado");
            return;
        }
        log_out.addEventListener("click", function () {
            window.location.href = "./login.html";
        });
        (_a = document.querySelectorAll("background-blur")) === null || _a === void 0 ? void 0 : _a.forEach((element) => {
            element.addEventListener("click", function () {
                element.setAttribute("hidden", "");
            });
        });
    });
};
