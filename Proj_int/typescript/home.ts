const token = localStorage.getItem("token");
const ordenacao = localStorage.getItem("ordenacao");

if (!token) {
    window.location.href = "login.html";
}
if (!ordenacao) {
    localStorage.setItem("ordenacao", "criacao");
}

async function editar_tarefa(id: string, titulo_tr: string, descricao_tr: string, prioridade_tr: string, data_conclusao: string) {
    try {
        const tarefa: HTMLDivElement = document.getElementById(id) as HTMLDivElement;
        if (!tarefa) {
            console.log("Elemento não encontrado");
            return;
        }
        const titulo_tarefa: HTMLParagraphElement = tarefa.querySelector("#titulo_tarefa") as HTMLParagraphElement;
        const descricao_tarefa: HTMLParagraphElement = tarefa.querySelector("#descricao_tarefa") as HTMLParagraphElement;
        const data_tarefa: HTMLParagraphElement = tarefa.querySelector("#data_tarefa") as HTMLParagraphElement;
        const prioridade_tarefa: HTMLParagraphElement = tarefa.querySelector("#prioridade_tarefa") as HTMLParagraphElement;

        const msg_erro_edit: HTMLParagraphElement = document.querySelector("#msg-erro_edit") as HTMLParagraphElement;

        const apresentar_erro = (msg: string) => {
            msg_erro_edit.innerText = msg;
            msg_erro_edit.removeAttribute("hidden");
            setTimeout(() => {
                msg_erro_edit.setAttribute("hidden", "");
            }, 3000);
        }

        if (titulo_tr === titulo_tarefa.innerText && descricao_tr === descricao_tarefa.innerText && `Prioridade: ${prioridade_tr}` === prioridade_tarefa.innerText && `Data Conclusão: ${data_conclusao ? data_conclusao : "Sem data"}` === data_tarefa.innerText) {
            apresentar_erro("Nenhuma alteração foi feita");
            return;
        }

        const titulo = titulo_tr.length >= 1 ? titulo_tr : "Sem título";
        const descricao = descricao_tr.length >= 1 ? descricao_tr : "Sem descrição";
        const prioridade = prioridade_tr && parseInt(prioridade_tr) >= 0 && parseInt(prioridade_tr) <= 5 ? prioridade_tr : 0;


        document.querySelector("#loading")?.removeAttribute("hidden");
        const data = data_conclusao ? new Date(data_conclusao).toISOString() : null;

        const retorno = await fetch("http://localhost:3000/tarefas", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, id, titulo, descricao, data, prioridade }),
        })
        if (retorno.status === 200) {
            Carregar_Tarefas();
        }
        else {
            const { erro } = await retorno.json();
            console.log(erro);
        }
        document.querySelector("#loading")?.setAttribute("hidden", "");
    } catch (error) {
        console.log(error);
    }
}

async function excluir_tarefa(id: string): Promise<any> {
    try {
        document.querySelector("#loading")?.removeAttribute("hidden");
        const retorno = await fetch("http://localhost:3000/tarefas", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, id }),
        })
        if (retorno.status === 204) {
            console.log("Tarefa excluída");
            Carregar_Tarefas();
        }
        else {
            const { erro } = await retorno.json();
            console.log(erro);
        }
        document.querySelector("#loading")?.setAttribute("hidden", "");
    } catch (error) {
        console.log(error);
    }
}

async function concluir_tarefa(id: string): Promise<any> {
    document.querySelector("#loading")?.removeAttribute("hidden");
    const retorno = await fetch("http://localhost:3000/tarefas/concluir", {

        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, id }),
    })
    console.log(retorno);

    document.querySelector("#loading")?.setAttribute("hidden", "");
    if (retorno.status === 200) {
        console.log("Tarefa marcada como concluída")
        Carregar_Tarefas();
    }
    else {
        const { erro } = await retorno.json();
        return Promise.resolve({ error: erro });
    }
}

async function desmarcar_tarefa_como_concluida(id: string): Promise<void> {
    document.querySelector("#loading")?.removeAttribute("hidden");
    const retorno = await fetch("http://localhost:3000/tarefas/desconcluir", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, id }),
    })
    console.log(retorno);
    document.querySelector("#loading")?.setAttribute("hidden", "");
    if (retorno.status === 200) {
        console.log("Tarefa desmarcada como concluída")
        Carregar_Tarefas();
    }
    else {
        const { erro } = await retorno.json();
        console.log(erro);
    }
}

function append_tarefa(tarefa: any) {
    const div_tarefas: HTMLDivElement = document.querySelector("#tarefas-conteiner") as HTMLDivElement;
    if (!div_tarefas) {
        console.log("Elemento não encontrado");
        return;
    }
    const template_tarefas: HTMLTemplateElement = document.querySelector("#template-tarefa") as HTMLTemplateElement;

    const clone = template_tarefas.content.cloneNode(true) as DocumentFragment;
    const div_tarefa: HTMLDivElement = clone.querySelector(".tarefa") as HTMLDivElement;
    div_tarefa.setAttribute("id", tarefa.id);
    const titulo: HTMLDivElement = clone.querySelector("#titulo_tarefa") as HTMLDivElement;
    const descricao: HTMLDivElement = clone.querySelector("#descricao_tarefa") as HTMLDivElement;
    const data_tarefa: HTMLDivElement = clone.querySelector("#data_tarefa") as HTMLDivElement;
    const data_criacao_tarefa: HTMLDivElement = clone.querySelector("#data_criacao_tarefa") as HTMLDivElement;
    const prioridade_tarefa: HTMLDivElement = clone.querySelector("#prioridade_tarefa") as HTMLDivElement;
    const status_tarefa: HTMLDivElement = clone.querySelector("#status_tarefa") as HTMLDivElement;
    const btn_editar_tarefa: HTMLButtonElement = clone.querySelector("#botoes_tarefa #editar_tarefa_bnt") as HTMLButtonElement;
    const btn_excluir_tarefa: HTMLButtonElement = clone.querySelector("#botoes_tarefa #excluir_tarefa_bnt") as HTMLButtonElement;
    const concluir_tarefa_bnt: HTMLInputElement = clone.querySelector("#concluir_tarefa_checkbox") as HTMLInputElement;


    titulo.innerText = tarefa.titulo;
    descricao.innerText = tarefa.descricao;
    data_tarefa.innerText = `Data Conclusão: ${tarefa.data ? new Date(tarefa.data).toLocaleDateString() : "Sem data"}`;
    data_criacao_tarefa.innerText = `Data Criação: ${new Date(tarefa.data_criacao).toLocaleDateString()}`;
    prioridade_tarefa.innerText = `Prioridade: ${tarefa.prioridade}`;
    let status: string;
    if (tarefa.status === "P") {
        status = "Pendente";
    } else if (tarefa.status === "C") {
        status = "Concluida";
    } else {
        status = "Atrasada";
    }
    status_tarefa.innerText = `Status: ${status}`;

    if (tarefa.status === "C") {
        concluir_tarefa_bnt.setAttribute("checked", "");
    }

    concluir_tarefa_bnt.addEventListener("click", async () => {
        if (concluir_tarefa_bnt.checked) {
            console.log("Tarefa concluída");
            await concluir_tarefa(tarefa.id)
        } else {
            console.log("Tarefa desmarcada como concluída");
            await desmarcar_tarefa_como_concluida(tarefa.id);
        }
    });

    btn_editar_tarefa.addEventListener("click", () => {
        const div_editar_tarefa: HTMLDivElement = document.querySelector("#edit_tarefa") as HTMLDivElement;
        if (!div_editar_tarefa) {
            console.log("Elemento não encontrado");
            return;
        }
        const section_tarefa: HTMLDivElement = div_editar_tarefa.querySelector(".editar_tarefa") as HTMLDivElement;
        if (!section_tarefa) {
            console.log("Elemento não encontrado");
            return;
        }

        const input_id: HTMLInputElement = div_editar_tarefa.querySelector("#id_tarefa") as HTMLInputElement;
        input_id.value = tarefa.id;
        const titulo_editar_tarefa: HTMLInputElement = div_editar_tarefa.querySelector("#edit-titulo_tarefa") as HTMLInputElement;
        const descricao_editar_tarefa: HTMLInputElement = div_editar_tarefa.querySelector("#edit-descricao_tarefa") as HTMLInputElement;
        const data_editar_tarefa: HTMLInputElement = div_editar_tarefa.querySelector("#edit-data_tarefa") as HTMLInputElement;
        const prioridade_editar_tarefa: HTMLInputElement = div_editar_tarefa.querySelector("#edit-prioridade_tarefa") as HTMLInputElement;
        const cancelar_editar_tarefa: HTMLButtonElement = div_editar_tarefa.querySelector("#cancelar_edit-tarefa_bnt") as HTMLButtonElement;
        const salvar_editar_tarefa: HTMLButtonElement = div_editar_tarefa.querySelector("#salvar_edit-tarefa_bnt") as HTMLButtonElement;

        titulo_editar_tarefa.value = tarefa.titulo;
        descricao_editar_tarefa.value = tarefa.descricao;
        data_editar_tarefa.value = tarefa.data ? new Date(tarefa.data).toISOString().split("T")[0] : "";
        prioridade_editar_tarefa.value = tarefa.prioridade;

        div_editar_tarefa.removeAttribute("hidden");

        cancelar_editar_tarefa.addEventListener("click", () => {
            div_editar_tarefa.setAttribute("hidden", "");
        });

        salvar_editar_tarefa.addEventListener("click", async () => {
            editar_tarefa(input_id.value, titulo_editar_tarefa.value, descricao_editar_tarefa.value, prioridade_editar_tarefa.value, data_editar_tarefa.value);
        });
    });

    btn_excluir_tarefa.addEventListener("click", () => {
        const confirmacao_excluir_tarefa = confirm("Deseja excluir a tarefa?");
        if (confirmacao_excluir_tarefa) {
            excluir_tarefa(tarefa.id);
        }
    });

    const tarefa_content: HTMLDivElement = clone.querySelector(".tarefa-content") as HTMLDivElement;
    if (!tarefa_content) {
        console.log("Elemento não encontrado");
        return;
    }

    tarefa_content.addEventListener("click", () => {
        const div_visualizar_tarefa: HTMLDivElement = document.querySelector("#visualizar_tarefa") as HTMLDivElement;
        if (!div_visualizar_tarefa) {
            console.log("Elemento não encontrado");
            return;
        }
        const section_tarefa: HTMLDivElement = div_visualizar_tarefa.querySelector(".visualizar-tarefa") as HTMLDivElement;
        if (!section_tarefa) {
            console.log("Elemento não encontrado");
            return;
        }
        section_tarefa.setAttribute("id", tarefa.id);
        const titulo_visualizar_tarefa: HTMLParagraphElement = div_visualizar_tarefa.querySelector("#titulo_tarefa") as HTMLParagraphElement;
        const descricao_visualizar_tarefa: HTMLParagraphElement = div_visualizar_tarefa.querySelector("#descricao_tarefa") as HTMLParagraphElement;
        const data_visualizar_tarefa: HTMLParagraphElement = div_visualizar_tarefa.querySelector("#data_tarefa") as HTMLParagraphElement;
        const data_criacao_visualizar_tarefa: HTMLParagraphElement = div_visualizar_tarefa.querySelector("#data_criacao_tarefa") as HTMLParagraphElement;
        const prioridade_visualizar_tarefa: HTMLParagraphElement = div_visualizar_tarefa.querySelector("#prioridade_tarefa") as HTMLParagraphElement;
        const status_visualizar_tarefa: HTMLParagraphElement = div_visualizar_tarefa.querySelector("#status_tarefa") as HTMLParagraphElement;


        titulo_visualizar_tarefa.innerText = tarefa.titulo;
        descricao_visualizar_tarefa.innerText = tarefa.descricao;
        data_visualizar_tarefa.innerText = tarefa.data ? new Date(tarefa.data).toLocaleDateString() : "Sem data";
        data_criacao_visualizar_tarefa.innerText = new Date(tarefa.data_criacao).toLocaleDateString();
        prioridade_visualizar_tarefa.innerText = tarefa.prioridade;


        let status: string = "";
        if (tarefa.status === "P") {
            status = "Pendente";
        } else if (tarefa.status === "C") {
            status = "Concluida";
        } else {
            status = "Atrasada";
        }
        status_visualizar_tarefa.innerText = status;

        const sair_visualizar_tarefa: HTMLButtonElement = div_visualizar_tarefa.querySelector("#sair_visualizacao_tarefa") as HTMLButtonElement;
        const btn_editar_tarefa: HTMLButtonElement = div_visualizar_tarefa.querySelector("#editar_tarefa_bnt") as HTMLButtonElement;
        const btn_excluir_tarefa: HTMLButtonElement = div_visualizar_tarefa.querySelector("#excluir_tarefa_bnt") as HTMLButtonElement;

        sair_visualizar_tarefa.addEventListener("click", () => {
            div_visualizar_tarefa.setAttribute("hidden", "");
        });

        btn_editar_tarefa.addEventListener("click", () => {
            const div_editar_tarefa: HTMLDivElement = document.querySelector("#edit_tarefa") as HTMLDivElement;
            if (!div_editar_tarefa) {
                console.log("Elemento não encontrado");
                return;
            }
            const section_tarefa: HTMLDivElement = div_editar_tarefa.querySelector(".editar_tarefa") as HTMLDivElement;
            if (!section_tarefa) {
                console.log("Elemento não encontrado");
                return;
            }

            section_tarefa.setAttribute("id", tarefa.id);
            const titulo_editar_tarefa: HTMLInputElement = div_editar_tarefa.querySelector("#edit-titulo_tarefa") as HTMLInputElement;
            const descricao_editar_tarefa: HTMLInputElement = div_editar_tarefa.querySelector("#edit-descricao_tarefa") as HTMLInputElement;
            const data_editar_tarefa: HTMLInputElement = div_editar_tarefa.querySelector("#edit-data_tarefa") as HTMLInputElement;
            const prioridade_editar_tarefa: HTMLInputElement = div_editar_tarefa.querySelector("#edit-prioridade_tarefa") as HTMLInputElement;
            const cancelar_editar_tarefa: HTMLButtonElement = div_editar_tarefa.querySelector("#cancelar_edit-tarefa_bnt") as HTMLButtonElement;
            const salvar_editar_tarefa: HTMLButtonElement = div_editar_tarefa.querySelector("#salvar_edit-tarefa_bnt") as HTMLButtonElement;

            titulo_editar_tarefa.value = tarefa.titulo;
            descricao_editar_tarefa.value = tarefa.descricao;
            data_editar_tarefa.value = tarefa.data ? new Date(tarefa.data).toISOString().split("T")[0] : "";
            prioridade_editar_tarefa.value = tarefa.prioridade;

            div_editar_tarefa.removeAttribute("hidden");

            cancelar_editar_tarefa.addEventListener("click", () => {
                div_editar_tarefa.setAttribute("hidden", "");
            });

            salvar_editar_tarefa.addEventListener("click", async () => {
                editar_tarefa(section_tarefa.id, titulo_editar_tarefa.value, descricao_editar_tarefa.value, prioridade_editar_tarefa.value, data_editar_tarefa.value);
            });
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


async function Carregar_Tarefas(pesquisa: string | null = null): Promise<void> {
    try {
        document.querySelector("#loading")?.removeAttribute("hidden");
        if (!ordenacao) {
            console.log("Ordenação não definida");
            return;
        }
        const pagina_atual: HTMLAnchorElement = document.getElementById("pagina_atual") as HTMLAnchorElement;
        if (!pagina_atual) {
            console.log("Pagina atual não encontrada");
            return;
        }
        let pagina: number = parseInt(pagina_atual.innerText);
        if (!pagina || pagina < 1 || isNaN(pagina)) {
            pagina_atual.innerText = "1";
            pagina = 1;
        }


        let json;
        if (pesquisa && pesquisa.length > 0) {
            console.log("Pesquisa: " + pesquisa);
            json = { token, ordenacao, pagina, pesquisa: pesquisa };
        } else {
            json = { token, ordenacao, pagina };
        }

        const retorno = await fetch("http://localhost:3000/tarefas/get/all", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(json),
        })

        let total: number = 0;
        let tarefas: any[] = [];
        let erro: string = "";

        if (retorno.status === 200) {
            const result = await retorno.json();
            tarefas = result.tarefas;
            total = result.total;
        }
        else {
            const result = await retorno.json();
            erro = result.erro;
        }
        if (erro.length > 0) {
            console.log(erro);
            return;
        }

        const div_tarefas: HTMLDivElement = document.querySelector("#tarefas-conteiner") as HTMLDivElement;
        if (!div_tarefas) {
            console.log("Div tarefas não encontrada");
            return;
        }
        if (tarefas.length === 0) {
            div_tarefas.innerHTML = "<h3>Nenhuma tarefa encontrada</h3>";
            return;
        }
        div_tarefas.innerHTML = "";

        for (const tarefa of tarefas) {
            append_tarefa(tarefa);
        }
        const total_paginas: HTMLAnchorElement = document.querySelector("#total_paginas") as HTMLAnchorElement;
        total_paginas.innerText = `${total}`

    } catch (error) {
        console.log(error);
        return;
    } finally {
        document.querySelector("#loading")?.setAttribute("hidden", "");
    }
}

async function adicionar_tarefa() {
    const token: string = localStorage.getItem("token") as string;
    const input_titulo: HTMLInputElement = document.querySelector("#titulo_tarefa_input") as HTMLInputElement;
    const input_descricao: HTMLInputElement = document.querySelector("#descricao_tarefa_input") as HTMLInputElement;
    const input_data: HTMLInputElement = document.querySelector("#data_tarefa_input") as HTMLInputElement;
    const input_prioridade: HTMLInputElement = document.querySelector("#prioridade_tarefa_input") as HTMLInputElement;

    const titulo: string = input_titulo.value ? input_titulo.value : "Sem título";
    const descricao: string = input_descricao.value ? input_descricao.value : "Sem descrição";
    const data: Date | null = input_data.value ? new Date(input_data.value) : null;

    const prioridade: number = input_prioridade.value ? parseInt(input_prioridade.value) : 0;

    const retorno = await fetch("http://localhost:3000/tarefas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, titulo, descricao, data, prioridade }),
    });
    const result = await retorno.json();
    if (result.erro) {
        console.log(result.erro);
        return;
    }
}


function atualizar_paginas() {
    const pagina_atual: HTMLAnchorElement = document.getElementById("pagina_atual") as HTMLAnchorElement;
    const pagina_seguinte: HTMLAnchorElement = document.getElementById("pagina_seguinte") as HTMLAnchorElement;
    const total_paginas: HTMLAnchorElement = document.getElementById("total_paginas") as HTMLAnchorElement;
    const separador: HTMLAnchorElement = document.getElementById("separador") as HTMLAnchorElement;
    if (!pagina_atual || !pagina_seguinte || !total_paginas || !separador) {
        console.log("Paginas não encontradas");
        return;
    }
    const total: number = parseInt(total_paginas.innerText);

    if (total < 2) {
        pagina_atual.innerText = "1";
        pagina_seguinte.setAttribute("hidden", "");
        total_paginas.innerText = "1";
        return;
    }
    pagina_seguinte.removeAttribute("hidden");
    if (parseInt(pagina_atual.innerText) < total) {
        pagina_seguinte.innerText = `${parseInt(pagina_atual.innerText) + 1}`
    } else {
        pagina_seguinte.setAttribute("hidden", "");
    }
    total_paginas.innerText = total.toString();

    pagina_seguinte.addEventListener("click", () => {
        if (total < 2) return;
        if (parseInt(pagina_atual.innerText) >= total) return;
        pagina_atual.innerText = `${parseInt(pagina_atual.innerText) + 1}`
        if (parseInt(pagina_atual.innerText) < total) {
            pagina_seguinte.innerText = `${parseInt(pagina_seguinte.innerText) + 1}`
        } else {
            pagina_seguinte.setAttribute("hidden", "");
        }
        atualizar_paginas();
        Carregar_Tarefas();
    })

    separador.addEventListener("click", () => {
        if (total < 3) return;
        const div_pags = pagina_atual.parentElement as HTMLDivElement;
        const aux1: HTMLAnchorElement = document.createElement("a") as HTMLAnchorElement;
        const aux2: HTMLAnchorElement = document.createElement("a") as HTMLAnchorElement;
        if (!aux1 || !aux2) return;
        if (parseInt(pagina_atual.innerText) >= total) return;
        if (parseInt(pagina_atual.innerText) - (total / 2) > 1) {
            aux1.innerText = `${parseInt(pagina_seguinte.innerText) + 1}`;
        }
        if ((total / 2) - parseInt(pagina_atual.innerText) > 1) {
            aux2.innerText = `${parseInt(pagina_atual.innerText) + 1}`;
        }
        if (aux1.innerText) {
            div_pags.insertBefore(pagina_seguinte, aux1)
        }
        if (aux2.innerText) {
            div_pags.insertBefore(separador, aux2)
        }
    })

    total_paginas.addEventListener("click", () => {
        if (total < 2) return;
        pagina_atual.innerText = total.toString();
        pagina_seguinte.setAttribute("hidden", "");
        atualizar_paginas();
        Carregar_Tarefas();
    });

    const proxima_pagina: HTMLAnchorElement = document.getElementById("proximo_bnt") as HTMLAnchorElement;
    const pagina_anterior: HTMLAnchorElement = document.getElementById("anterior_bnt") as HTMLAnchorElement;
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
    })
    pagina_anterior.addEventListener("click", () => {
        const pagina = parseInt(pagina_atual.innerText);
        if (pagina <= 1) {
            return;
        }
        pagina_atual.innerText = `${pagina - 1}`;
        pagina_seguinte.innerText = `${pagina}`;
        Carregar_Tarefas();
        atualizar_paginas();
    })
}


async function editar_dados_usuario() {
    const div_dados_usuario: HTMLDivElement = document.querySelector("#dados_perfil") as HTMLDivElement;
    const div_nome: HTMLDivElement = div_dados_usuario.querySelector("#nome-perfil") as HTMLDivElement;
    const div_email: HTMLDivElement = div_dados_usuario.querySelector("#email-perfil") as HTMLDivElement;
    const div_senha: HTMLDivElement = div_dados_usuario.querySelector("#senha-perfil") as HTMLDivElement;

    const nome_ancora: HTMLAnchorElement = div_nome.querySelector("#nome-ancora") as HTMLAnchorElement;
    const email_ancora: HTMLAnchorElement = div_email.querySelector("#email-ancora") as HTMLAnchorElement;
    const senha_ancora: HTMLAnchorElement = div_senha.querySelector("#senha-ancora") as HTMLAnchorElement;

    const input_nome: HTMLInputElement = div_nome.querySelector("#nome_usuario") as HTMLInputElement;
    const input_email: HTMLInputElement = div_email.querySelector("#email_usuario") as HTMLInputElement;
    const input_senha: HTMLInputElement = div_senha.querySelector("#senha_usuario") as HTMLInputElement;

    const retorno = await fetch("http://localhost:3000/usuario", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            token: token,
            nome_usuario: input_nome.value == "" ? null : input_nome.value,
            email_usuario: input_email.value == "" ? null : input_email.value,
            senha_usuario: input_senha.value == "" ? null : input_senha.value,
        }),
    });

    if (retorno.status === 200) {
        get_dados_usuario();
    } else {
        const { error } = await retorno.json();
        console.log(error);
    }
}

function append_dados(nome: string, email: string, senha: string, metodo_login: string) {
    const div_dados_usuario: HTMLDivElement = document.querySelector("#dados_perfil") as HTMLDivElement;
    const div_nome: HTMLDivElement = div_dados_usuario.querySelector("#nome-perfil") as HTMLDivElement;
    const div_email: HTMLDivElement = div_dados_usuario.querySelector("#email-perfil") as HTMLDivElement;
    const div_senha: HTMLDivElement = div_dados_usuario.querySelector("#senha-perfil") as HTMLDivElement;
    const cancelar_alteracoes_perfil: HTMLButtonElement = div_dados_usuario.querySelector("#cancelar_perfil_bnt") as HTMLButtonElement;
    const salvar_alteracoes_perfil: HTMLButtonElement = div_dados_usuario.querySelector("#salvar_perfil_bnt") as HTMLButtonElement;

    cancelar_alteracoes_perfil.addEventListener("click", function () {
        div_dados_usuario.setAttribute("hidden", "");
    });

    const nome_ancora: HTMLAnchorElement = div_nome.querySelector("#nome") as HTMLAnchorElement;
    const email_ancora: HTMLAnchorElement = div_email.querySelector("#email") as HTMLAnchorElement;
    const senha_ancora: HTMLAnchorElement = div_senha.querySelector("#senha") as HTMLAnchorElement;

    nome_ancora.innerText = nome;
    email_ancora.innerText = email;
    console.log(nome, email, senha, metodo_login)
    if (metodo_login == "2") {
        senha_ancora.innerText = "*".repeat(senha.length);
    } else {
        senha_ancora.innerText = "Não cadastrada";
    }
    if (metodo_login == "2") {
        nome_ancora.addEventListener("click", function () {
            const input_nome: HTMLInputElement = div_nome.querySelector("#nome_usuario") as HTMLInputElement;
            input_nome.value = nome;
            input_nome.removeAttribute("hidden");
            nome_ancora.setAttribute("hidden", "");
        });
        email_ancora.addEventListener("click", function () {
            const input_email: HTMLInputElement = div_email.querySelector("#email_usuario") as HTMLInputElement;
            input_email.value = email;
            input_email.removeAttribute("hidden");
            email_ancora.setAttribute("hidden", "");
        });

        senha_ancora.addEventListener("click", function () {
            const input_senha: HTMLInputElement = div_senha.querySelector("#senha_usuario") as HTMLInputElement;
            input_senha.value = senha;
            input_senha.removeAttribute("hidden");
            senha_ancora.setAttribute("hidden", "");
        });

        salvar_alteracoes_perfil.addEventListener("click", async function () {
            editar_dados_usuario();
        });
    } else {
        salvar_alteracoes_perfil.setAttribute("hidden", "");
    }
}

async function get_dados_usuario() {

    const retorno = await fetch("http://localhost:3000/usuario/get", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token }),
    });

    if (retorno.status === 200) {
        const result = await retorno.json();
        const { nome_usuario, email_usuario, senha_usuario, id_metodo_login_usuario } = result.data;
        append_dados(nome_usuario, email_usuario, senha_usuario, id_metodo_login_usuario);
    } else {
        const { error } = await retorno.json();
        console.log(error);
    }
}



window.onload = async function () {
    // referentes a tarefas
    const bnt_new_tarefa: HTMLButtonElement = document.querySelector("#nova_tarefa_bnt") as HTMLButtonElement;
    const bnt_add_tarefa: HTMLButtonElement = document.querySelector("#salvar_tarefa_bnt") as HTMLButtonElement;
    const bnt_cancelar_tarefa: HTMLButtonElement = document.querySelector("#cancelar_tarefa_bnt") as HTMLButtonElement;
    const add_date: HTMLInputElement = document.querySelector("#add_tarefa #switch") as HTMLInputElement;
    const visualizar_tarefa: HTMLDivElement = document.querySelector("#visualizar_tarefa") as HTMLDivElement;
    const sair_visualizar_tarefa: HTMLButtonElement = document.querySelector("#sair_visualizacao_tarefa") as HTMLButtonElement;
    // referentes ao menu
    const menu_usuario: HTMLButtonElement = document.querySelector("#menu_usuario_bnt") as HTMLButtonElement;
    const bnt_visualizar_perfil: HTMLAnchorElement = document.querySelector("#perfil_bnt") as HTMLAnchorElement;
    const cancelar_alteracoes_usuario: HTMLButtonElement = document.getElementById("cancelar_perfil_bnt") as HTMLButtonElement;
    const salvar_alteracoes_usuario: HTMLButtonElement = document.getElementById("salvar_perfil_bnt") as HTMLButtonElement;
    // referentes a configurações
    const configuracoes: HTMLButtonElement = document.querySelector("#config_bnt") as HTMLButtonElement;
    const select_ordenacao: HTMLSelectElement = document.querySelector("#select-filtros") as HTMLSelectElement;
    const bnt_salvar_conf: HTMLButtonElement = document.querySelector("#salvar_conf_bnt") as HTMLButtonElement;
    const bnt_cancelar_conf: HTMLButtonElement = document.querySelector("#cancelar_conf_bnt") as HTMLButtonElement;
    // pesquisa
    const pesquisa: HTMLInputElement = document.querySelector("#conf_usuario #search_input") as HTMLInputElement;
    const bnt_pesquisa: HTMLAnchorElement = document.querySelector("#conf_usuario #search_bnt") as HTMLAnchorElement;
    await Carregar_Tarefas();
    await get_dados_usuario();

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
        document.querySelector("#perfil_usuario")?.setAttribute("hidden", "");
    });
    salvar_alteracoes_usuario.addEventListener("click", function () {
        document.querySelector("#perfil_usuario")?.setAttribute("hidden", "");
    });

    bnt_visualizar_perfil.addEventListener("click", function () {
        document.querySelector("#perfil_usuario")?.removeAttribute("hidden");
    });
    bnt_new_tarefa.addEventListener("click", function () {
        document.querySelector("#add_tarefa")?.removeAttribute("hidden");
    });

    add_date.addEventListener("click", function () {
        const div_data: HTMLDivElement = document.querySelector("#add_tarefa #data-tarefa") as HTMLDivElement;
        if (!div_data) {
            console.log("Elemento não encontrado");
            return;
        }
        if (add_date.checked) {
            div_data.removeAttribute("hidden");
        } else {
            div_data.setAttribute("hidden", "");
        }
    });

    bnt_cancelar_tarefa.addEventListener("click", function () {
        document.querySelector("#add_tarefa")?.setAttribute("hidden", "");
    });

    bnt_add_tarefa.addEventListener("click", async function () {
        adicionar_tarefa();
        await Carregar_Tarefas();
        document.querySelector("#add_tarefa")?.setAttribute("hidden", "");
    });

    menu_usuario.addEventListener("click", function () {
        const menu: HTMLDivElement = document.querySelector("#menu") as HTMLDivElement;

        if (!menu) {
            console.log("Elemento não encontrado");
            return;
        }

        if (menu.getAttribute("hidden") === "") {
            menu.removeAttribute("hidden");
        } else {
            menu.setAttribute("hidden", "");
        }
    });

    configuracoes.addEventListener("click", function () {
        const div_configuracoes: HTMLDivElement = document.querySelector("#configuracoes") as HTMLDivElement;
        if (!div_configuracoes) {
            console.log("Elemento não encontrado");
            return;
        }
        if (div_configuracoes.getAttribute("hidden") === "") {
            div_configuracoes.removeAttribute("hidden");
        } else {
            div_configuracoes.setAttribute("hidden", "");
        }
    });

    bnt_salvar_conf.addEventListener("click", function () {
        const ordenacao: string = select_ordenacao.value;
        console.log(ordenacao);
        if (ordenacao !== "criacao" && ordenacao !== "prioridade" && ordenacao !== "conclusao") {
            console.log("Ordenação inválida");
            return;
        }
        window.localStorage.setItem("ordenacao", ordenacao);
        document.querySelector("#configuracoes")?.setAttribute("hidden", "");
        Carregar_Tarefas();
    });

    bnt_cancelar_conf.addEventListener("click", function () {
        document.querySelector("#configuracoes")?.setAttribute("hidden", "");
    });

    visualizar_tarefa.addEventListener("click", function () {
        visualizar_tarefa.setAttribute("hidden", "");
    });

    sair_visualizar_tarefa.addEventListener("click", function () {
        visualizar_tarefa.setAttribute("hidden", "");
    });

    bnt_pesquisa.addEventListener("click", function () {
        const pesquisa_txt: string = pesquisa.value;
        if (pesquisa_txt === "") {
            Carregar_Tarefas();
            return;
        }
        Carregar_Tarefas(pesquisa_txt);
    });

    pesquisa.addEventListener("keyup", function (event) {
        console.log(event.key);
        if (event.key === "Enter") {
            const pesquisa_txt: string = pesquisa.value;
            if (pesquisa_txt === "") {
                Carregar_Tarefas();
                return;
            }
            Carregar_Tarefas(pesquisa_txt);
        }
    });


    const log_out: HTMLAnchorElement = document.querySelector("#sair_bnt") as HTMLAnchorElement;
    if (!log_out) {
        console.log("Elemento não encontrado");
        return;
    }
    log_out.addEventListener("click", function () {
        window.location.href = "./login.html";
    })

    document.querySelectorAll("background-blur")?.forEach((element) => {
        element.addEventListener("click", function () {
            element.setAttribute("hidden", "");
        });
    });
}