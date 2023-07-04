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
let token = localStorage.getItem("token");
const ordenacao = localStorage.getItem("ordenacao");
if (!token) {
    window.location.href = "login.html";
}
if (!ordenacao) {
    localStorage.setItem("ordenacao", "criacao");
}
function editar_tarefa(id, titulo_tr, descricao_tr, prioridade_tr, data_conclusao) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tarefa = document.getElementById(id);
            if (!tarefa) {
                console.log("Elemento não encontrado");
                return;
            }
            const titulo_tarefa = tarefa.querySelector("#titulo_tarefa");
            const descricao_tarefa = tarefa.querySelector("#descricao_tarefa");
            const data_tarefa = tarefa.querySelector("#data_tarefa");
            const prioridade_tarefa = tarefa.querySelector("#prioridade_tarefa");
            const msg_erro_edit = document.querySelector("#msg-erro_edit");
            const apresentar_erro = (msg) => {
                msg_erro_edit.innerText = msg;
                msg_erro_edit.removeAttribute("hidden");
                setTimeout(() => {
                    msg_erro_edit.setAttribute("hidden", "");
                }, 3000);
            };
            if (titulo_tr === titulo_tarefa.innerText && descricao_tr === descricao_tarefa.innerText && `Prioridade: ${prioridade_tr}` === prioridade_tarefa.innerText && `Data Conclusão: ${data_conclusao ? data_conclusao : "Sem data"}` === data_tarefa.innerText) {
                apresentar_erro("Nenhuma alteração foi feita");
                return;
            }
            const titulo = titulo_tr.length >= 1 ? titulo_tr : "Sem título";
            const descricao = descricao_tr.length >= 1 ? descricao_tr : "Sem descrição";
            const prioridade = prioridade_tr && parseInt(prioridade_tr) >= 0 && parseInt(prioridade_tr) <= 5 ? prioridade_tr : 0;
            (_a = document.querySelector("#loading")) === null || _a === void 0 ? void 0 : _a.removeAttribute("hidden");
            const data = data_conclusao ? new Date(data_conclusao).toISOString() : null;
            const retorno = yield fetch("http://localhost:3000/tarefas", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, id, titulo, descricao, data, prioridade }),
            });
            if (retorno.status === 200) {
                Carregar_Tarefas();
            }
            else {
                const { erro } = yield retorno.json();
                console.log(erro);
            }
            (_b = document.querySelector("#loading")) === null || _b === void 0 ? void 0 : _b.setAttribute("hidden", "");
        }
        catch (error) {
            console.log(error);
        }
    });
}
function excluir_tarefa(id) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (_a = document.querySelector("#loading")) === null || _a === void 0 ? void 0 : _a.removeAttribute("hidden");
            const retorno = yield fetch("http://localhost:3000/tarefas", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, id }),
            });
            if (retorno.status === 204) {
                console.log("Tarefa excluída");
                Carregar_Tarefas();
            }
            else {
                const { erro } = yield retorno.json();
                console.log(erro);
            }
            (_b = document.querySelector("#loading")) === null || _b === void 0 ? void 0 : _b.setAttribute("hidden", "");
        }
        catch (error) {
            console.log(error);
        }
    });
}
function concluir_tarefa(id) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        (_a = document.querySelector("#loading")) === null || _a === void 0 ? void 0 : _a.removeAttribute("hidden");
        const retorno = yield fetch("http://localhost:3000/tarefas/concluir", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, id }),
        });
        console.log(retorno);
        (_b = document.querySelector("#loading")) === null || _b === void 0 ? void 0 : _b.setAttribute("hidden", "");
        if (retorno.status === 200) {
            console.log("Tarefa marcada como concluída");
            Carregar_Tarefas();
        }
        else {
            const { erro } = yield retorno.json();
            return Promise.resolve({ error: erro });
        }
    });
}
function desmarcar_tarefa_como_concluida(id) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        (_a = document.querySelector("#loading")) === null || _a === void 0 ? void 0 : _a.removeAttribute("hidden");
        const retorno = yield fetch("http://localhost:3000/tarefas/desconcluir", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, id }),
        });
        console.log(retorno);
        (_b = document.querySelector("#loading")) === null || _b === void 0 ? void 0 : _b.setAttribute("hidden", "");
        if (retorno.status === 200) {
            console.log("Tarefa desmarcada como concluída");
            Carregar_Tarefas();
        }
        else {
            const { erro } = yield retorno.json();
            console.log(erro);
        }
    });
}
function append_tarefa(tarefa) {
    const div_tarefas = document.querySelector("#tarefas-conteiner");
    if (!div_tarefas) {
        console.log("Elemento não encontrado");
        return;
    }
    const template_tarefas = document.querySelector("#template-tarefa");
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
    const concluir_tarefa_bnt = clone.querySelector("#concluir_tarefa_checkbox");
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
        concluir_tarefa_bnt.setAttribute("checked", "");
    }
    concluir_tarefa_bnt.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
        if (concluir_tarefa_bnt.checked) {
            console.log("Tarefa concluída");
            yield concluir_tarefa(tarefa.id);
        }
        else {
            console.log("Tarefa desmarcada como concluída");
            yield desmarcar_tarefa_como_concluida(tarefa.id);
        }
    }));
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
        const input_id = div_editar_tarefa.querySelector("#id_tarefa");
        input_id.value = tarefa.id;
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
            editar_tarefa(input_id.value, titulo_editar_tarefa.value, descricao_editar_tarefa.value, prioridade_editar_tarefa.value, data_editar_tarefa.value);
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
        return;
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
        data_visualizar_tarefa.innerText = tarefa.data_conclusao ? new Date(tarefa.data_conclusao).toLocaleDateString() : "Sem data";
        data_criacao_visualizar_tarefa.innerText = new Date(tarefa.data_criacao).toLocaleDateString();
        prioridade_visualizar_tarefa.innerText = tarefa.prioridade;
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
function Carregar_Tarefas(pesquisa = null) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (_a = document.querySelector("#loading")) === null || _a === void 0 ? void 0 : _a.removeAttribute("hidden");
            if (!ordenacao) {
                console.log("Ordenação não definida");
                return;
            }
            const pagina_atual = document.getElementById("pagina_atual");
            if (!pagina_atual) {
                console.log("Pagina atual não encontrada");
                return;
            }
            let pagina = parseInt(pagina_atual.innerText);
            if (!pagina || pagina < 1 || isNaN(pagina)) {
                pagina_atual.innerText = "1";
                pagina = 1;
            }
            let json;
            if (pesquisa && pesquisa.length > 0) {
                console.log("Pesquisa: " + pesquisa);
                json = { token, ordenacao, pagina, pesquisa: pesquisa };
            }
            else {
                json = { token, ordenacao, pagina };
            }
            const retorno = yield fetch("http://localhost:3000/tarefas/get/all", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(json),
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
                return;
            }
            const div_tarefas = document.querySelector("#tarefas-conteiner");
            if (!div_tarefas) {
                console.log("Div tarefas não encontrada");
                return;
            }
            if (tarefas === undefined || tarefas.length === 0) {
                div_tarefas.innerHTML = "<h3>Nenhuma tarefa encontrada</h3>";
                return;
            }
            div_tarefas.innerHTML = "";
            for (const tarefa of tarefas) {
                append_tarefa(tarefa);
            }
            const total_paginas = document.querySelector("#total_paginas");
            total_paginas.innerText = `${total}`;
        }
        catch (error) {
            console.log(error);
            return;
        }
        finally {
            (_b = document.querySelector("#loading")) === null || _b === void 0 ? void 0 : _b.setAttribute("hidden", "");
        }
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
function atualizar_paginas() {
    const pagina_atual = document.getElementById("pagina_atual");
    const pagina_seguinte = document.getElementById("pagina_seguinte");
    const total_paginas = document.getElementById("total_paginas");
    const separador = document.getElementById("separador");
    if (!pagina_atual || !pagina_seguinte || !total_paginas || !separador) {
        console.log("Paginas não encontradas");
        return;
    }
    const total = parseInt(total_paginas.innerText);
    if (total < 2) {
        pagina_atual.innerText = "1";
        pagina_seguinte.setAttribute("hidden", "");
        total_paginas.innerText = "1";
        return;
    }
    pagina_seguinte.removeAttribute("hidden");
    if (parseInt(pagina_atual.innerText) < total) {
        pagina_seguinte.innerText = `${parseInt(pagina_atual.innerText) + 1}`;
    }
    else {
        pagina_seguinte.setAttribute("hidden", "");
    }
    total_paginas.innerText = total.toString();
    pagina_seguinte.addEventListener("click", () => {
        if (total < 2)
            return;
        if (parseInt(pagina_atual.innerText) >= total)
            return;
        pagina_atual.innerText = `${parseInt(pagina_atual.innerText) + 1}`;
        if (parseInt(pagina_atual.innerText) < total) {
            pagina_seguinte.innerText = `${parseInt(pagina_seguinte.innerText) + 1}`;
        }
        else {
            pagina_seguinte.setAttribute("hidden", "");
        }
        atualizar_paginas();
        Carregar_Tarefas();
    });
    separador.addEventListener("click", () => {
        if (total < 3)
            return;
        const div_pags = pagina_atual.parentElement;
        const aux1 = document.createElement("a");
        const aux2 = document.createElement("a");
        if (!aux1 || !aux2)
            return;
        if (parseInt(pagina_atual.innerText) >= total)
            return;
        if (parseInt(pagina_atual.innerText) - (total / 2) > 1) {
            aux1.innerText = `${parseInt(pagina_seguinte.innerText) + 1}`;
        }
        if ((total / 2) - parseInt(pagina_atual.innerText) > 1) {
            aux2.innerText = `${parseInt(pagina_atual.innerText) + 1}`;
        }
        if (aux1.innerText) {
            div_pags.insertBefore(pagina_seguinte, aux1);
        }
        if (aux2.innerText) {
            div_pags.insertBefore(separador, aux2);
        }
    });
    total_paginas.addEventListener("click", () => {
        if (total < 2)
            return;
        pagina_atual.innerText = total.toString();
        pagina_seguinte.setAttribute("hidden", "");
        atualizar_paginas();
        Carregar_Tarefas();
    });
    const proxima_pagina = document.getElementById("proximo_bnt");
    const pagina_anterior = document.getElementById("anterior_bnt");
    if (!proxima_pagina || !pagina_anterior) {
        console.log("Paginas não encontradas");
        return;
    }
    proxima_pagina.addEventListener("click", () => {
        const pagina = parseInt(pagina_atual.innerText);
        if (pagina >= total) {
            return;
        }
        pagina_atual.innerText = `${pagina + 1}`;
        pagina + 2 > total ?
            pagina_seguinte.setAttribute("hidden", "") :
            pagina_seguinte.innerText = `${pagina + 2}`;
        Carregar_Tarefas();
        atualizar_paginas();
    });
    pagina_anterior.addEventListener("click", () => {
        const pagina = parseInt(pagina_atual.innerText);
        if (pagina <= 1) {
            return;
        }
        pagina_atual.innerText = `${pagina - 1}`;
        pagina_seguinte.innerText = `${pagina}`;
        Carregar_Tarefas();
        atualizar_paginas();
    });
}
function conferir_token() {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetch("http://localhost:3000/usuario/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
        }).then((retorno) => {
            if (retorno.status == 500) {
                console.log(token);
                localStorage.removeItem("token");
                window.location.href = "login.html";
            }
        });
    });
}
function editar_dados_usuario() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const div_dados_usuario = document.querySelector("#dados_perfil");
            const div_nome = div_dados_usuario.querySelector("#nome-perfil");
            const div_email = div_dados_usuario.querySelector("#email-perfil");
            const div_senha = div_dados_usuario.querySelector("#senha-perfil");
            const nome_ancora = div_nome.querySelector("#nome");
            const email_ancora = div_email.querySelector("#email");
            const senha_ancora = div_senha.querySelector("#senha");
            const input_nome = div_nome.querySelector("#nome_usuario");
            const input_email = div_email.querySelector("#email_perfil_input");
            const input_senha = div_senha.querySelector("#senha_perfil_input");
            if (!nome_ancora || !email_ancora || !senha_ancora || !input_nome || !input_email || !input_senha) {
                console.log("Elementos não encontrados");
                return;
            }
            console.log(nome_ancora.innerText, email_ancora.innerText, senha_ancora.innerText);
            console.log(input_nome.value, input_email.value, input_senha.value);
            if (input_email.value.length === 0 && input_nome.value.length === 0 && input_senha.value.length === 0) {
                return { status: false, msg: "Nenhum dado foi alterado" };
            }
            const retorno = yield fetch("http://localhost:3000/usuario", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: token,
                    novo_nome: input_nome.value.length === 0 || input_nome.value === nome_ancora.innerText ? null : input_nome.value,
                    novo_email: input_email.value.length === 0 || input_email.value === email_ancora.innerText ? null : input_email.value,
                    nova_senha: input_senha.value.length === 0 || input_senha.value === senha_ancora.innerText ? null : input_senha.value,
                }),
            });
            if (retorno.status === 200) {
                const result = yield retorno.json();
                // console.log(result)
                const novo_token = result.token;
                localStorage.setItem("token", novo_token);
                token = novo_token;
                return { status: true, msg: "Dados alterados com sucesso" };
            }
            else {
                const { error } = yield retorno.json();
                return { status: false, msg: error };
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
function append_dados(nome, email, senha, metodo_login) {
    const div_dados_usuario = document.querySelector("#dados_perfil");
    const div_nome = div_dados_usuario.querySelector("#nome-perfil");
    const div_email = div_dados_usuario.querySelector("#email-perfil");
    const div_senha = div_dados_usuario.querySelector("#senha-perfil");
    const cancelar_alteracoes_perfil = div_dados_usuario.querySelector("#cancelar_perfil_bnt");
    const salvar_alteracoes_perfil = div_dados_usuario.querySelector("#salvar_perfil_bnt");
    cancelar_alteracoes_perfil.addEventListener("click", function () {
        div_dados_usuario.setAttribute("hidden", "");
    });
    const nome_ancora = div_nome.querySelector("#nome");
    const email_ancora = div_email.querySelector("#email");
    const senha_ancora = div_senha.querySelector("#senha");
    nome_ancora.innerText = nome;
    email_ancora.innerText = email;
    if (metodo_login == "2") {
        senha_ancora.innerText = "*".repeat(senha.length);
        const input_nome = div_nome.querySelector("#nome_usuario");
        const input_email = div_email.querySelector("#email_perfil_input");
        const input_senha = div_senha.querySelector("#senha_perfil_input");
        nome_ancora.addEventListener("click", function () {
            input_nome.value = nome;
            input_nome.removeAttribute("hidden");
            nome_ancora.setAttribute("hidden", "");
        });
        email_ancora.addEventListener("click", function () {
            input_email.value = email;
            input_email.removeAttribute("hidden");
            email_ancora.setAttribute("hidden", "");
        });
        senha_ancora.addEventListener("click", function () {
            input_senha.value = senha;
            input_senha.removeAttribute("hidden");
            senha_ancora.setAttribute("hidden", "");
        });
        salvar_alteracoes_perfil.addEventListener("click", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const retorno = yield editar_dados_usuario();
                if (!retorno) {
                    console.log("Erro ao editar dados");
                    return;
                }
                if (retorno.status) {
                    input_email.setAttribute("hidden", "");
                    input_nome.setAttribute("hidden", "");
                    input_senha.setAttribute("hidden", "");
                    nome_ancora.innerText = input_nome.value;
                    email_ancora.innerText = input_email.value;
                    senha_ancora.innerText = input_senha.value;
                    nome_ancora.removeAttribute("hidden");
                    email_ancora.removeAttribute("hidden");
                    senha_ancora.removeAttribute("hidden");
                    div_dados_usuario.setAttribute("hidden", "");
                    conferir_token();
                    get_dados_usuario();
                }
                console.log(retorno.msg);
            });
        });
    }
    else {
        senha_ancora.innerText = "Não cadastrada";
        salvar_alteracoes_perfil.setAttribute("hidden", "");
    }
}
function get_dados_usuario() {
    return __awaiter(this, void 0, void 0, function* () {
        const retorno = yield fetch("http://localhost:3000/usuario/get", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: token }),
        });
        if (retorno.status === 200) {
            const result = yield retorno.json();
            const { nome_usuario, email_usuario, senha_usuario, id_metodo_login_usuario } = result.data;
            append_dados(nome_usuario, email_usuario, senha_usuario, id_metodo_login_usuario);
        }
        else {
            const { error } = yield retorno.json();
            console.log(error);
        }
    });
}
function conferir_adm() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const retorno = yield fetch("http://localhost:3000/admin/confere", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: token }),
            }).then((res) => res).catch((error) => {
                console.log(error.message);
            });
            if (retorno && retorno.status === 200) {
                const result = yield retorno.json();
                const { admin } = result;
                if (admin) {
                    const op_admin = document.querySelector("#admin_bnt");
                    const li_admin = op_admin.parentElement;
                    op_admin.href = "./admin.html";
                    li_admin.removeAttribute("hidden");
                }
            }
            else {
                if (retorno) {
                    const { erro } = yield retorno.json();
                    console.log(erro);
                }
                else {
                    console.log("algo de errado não está certo");
                }
            }
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            }
        }
    });
}
window.onload = function () {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
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
        // pesquisa
        const pesquisa = document.querySelector("#conf_usuario #search_input");
        const bnt_pesquisa = document.querySelector("#conf_usuario #search_bnt");
        yield conferir_adm();
        yield Carregar_Tarefas();
        yield get_dados_usuario();
        if (!cancelar_alteracoes_usuario || !salvar_alteracoes_usuario
            || !configuracoes || !select_ordenacao || !bnt_salvar_conf || !bnt_cancelar_conf
            || !menu_usuario || !bnt_visualizar_perfil || !bnt_new_tarefa || !bnt_add_tarefa
            || !bnt_cancelar_tarefa || !add_date || !visualizar_tarefa || !sair_visualizar_tarefa
            || !pesquisa || !bnt_pesquisa) {
            console.log("Elemento não encontrado");
            return;
        }
        atualizar_paginas();
        cancelar_alteracoes_usuario.addEventListener("click", function () {
            var _a;
            (_a = document.querySelector("#perfil_usuario")) === null || _a === void 0 ? void 0 : _a.setAttribute("hidden", "");
        });
        salvar_alteracoes_usuario.addEventListener("click", function () {
            var _a;
            (_a = document.querySelector("#perfil_usuario")) === null || _a === void 0 ? void 0 : _a.setAttribute("hidden", "");
        });
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
                yield Carregar_Tarefas();
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
        bnt_pesquisa.addEventListener("click", function () {
            const pesquisa_txt = pesquisa.value;
            if (pesquisa_txt === "") {
                Carregar_Tarefas();
                return;
            }
            Carregar_Tarefas(pesquisa_txt);
        });
        pesquisa.addEventListener("keyup", function (event) {
            console.log(event.key);
            if (event.key === "Enter") {
                const pesquisa_txt = pesquisa.value;
                if (pesquisa_txt === "") {
                    Carregar_Tarefas();
                    return;
                }
                Carregar_Tarefas(pesquisa_txt);
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
        (_a = document.querySelectorAll("background-blur")) === null || _a === void 0 ? void 0 : _a.forEach((element) => {
            element.addEventListener("click", function () {
                element.setAttribute("hidden", "");
            });
        });
    });
};
