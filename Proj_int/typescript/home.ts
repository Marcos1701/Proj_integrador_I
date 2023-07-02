
const token: string = localStorage.getItem("token") as string;
const ordenacao: string = localStorage.getItem("ordenacao") as string;
if (!token) {
    window.location.href = "login.html";
}
if (!ordenacao) {
    localStorage.setItem("ordenacao", "criacao");
}

async function editar_tarefa(id: string, titulo: string, descricao: string, prioridade: string, data_conclusao: string): Promise<any> {
    document.querySelector("#loading")?.removeAttribute("hidden");
    await fetch("http://localhost:3000/tarefas", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, id, titulo, descricao, data_conclusao, prioridade }),
    }).then(async (retorno) => {
        if (retorno.status === 200) {
            Carregar_Tarefas();
        }
        else {
            const { erro } = await retorno.json();
            return { error: erro };
        }
    }).finally(() => {
        document.querySelector("#loading")?.setAttribute("hidden", "");
    });
}

async function excluir_tarefa(id: string): Promise<any> {
    document.querySelector("#loading")?.removeAttribute("hidden");
    await fetch("http://localhost:3000/tarefas", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, id }),
    }).then(async (retorno) => {
        if (retorno.status === 204) {
            Carregar_Tarefas();
        }
        else {
            const { erro } = await retorno.json();
            return { error: erro };
        }
    }).finally(() => {
        document.querySelector("#loading")?.setAttribute("hidden", "");
    });
}

async function concluir_tarefa(id: string): Promise<any> {
    document.querySelector("#loading")?.removeAttribute("hidden");
    await fetch("http://localhost:3000/tarefas/concluir", {

        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, id }),
    }).then(async (retorno) => {
        if (retorno.status === 200) {
            Carregar_Tarefas();
        }
        else {
            const { erro } = await retorno.json();
            return { error: erro };
        }
    }).finally(() => {
        document.querySelector("#loading")?.setAttribute("hidden", "");
    });
}



async function Carregar_Tarefas(): Promise<any[]> {
    document.querySelector("#loading")?.removeAttribute("hidden");

    const retorno = await fetch("http://localhost:3000/tarefas/get/all", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, ordenacao }),
    }).then(async (retorno) => {
        if (retorno.status === 200) {
            const { tarefas } = await retorno.json();
            console.log(tarefas);
            return tarefas;
        }
        else {
            const { erro } = await retorno.json();
            return { error: erro };
        }
    }).finally(() => {
        document.querySelector("#loading")?.setAttribute("hidden", "");
    });

    const tarefas: any[] = retorno
    const div_tarefas: HTMLDivElement = document.querySelector("#tarefas-conteiner") as HTMLDivElement;
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
    const template_tarefas: HTMLTemplateElement = document.querySelector("#template-tarefa") as HTMLTemplateElement;
    if (!template_tarefas) {
        console.log("Elemento não encontrado");
        return [];
    }
    const pagina_atual: string = document.getElementById("pagina_atual")?.innerText as string;
    if (!pagina_atual) {
        console.log("Pagina atual não encontrada");
        return [];
    }
    const pagina: number = parseInt(pagina_atual);

    for (let i = 0; i < tarefas[pagina].length; i++) {
        const tarefa = tarefas[pagina][i];
        const clone = template_tarefas.content.cloneNode(true) as DocumentFragment;
        const div_tarefa: HTMLDivElement = clone.querySelector(".tarefa") as HTMLDivElement;
        div_tarefa.setAttribute("id", tarefa.id);
        const titulo: HTMLDivElement = clone.querySelector("#titulo_tarefa") as HTMLDivElement;
        const descricao: HTMLDivElement = clone.querySelector("#descricao_tarefa") as HTMLDivElement;
        const data_tarefa: HTMLDivElement = clone.querySelector("#data_tarefa") as HTMLDivElement;
        const data_criacao_tarefa: HTMLDivElement = clone.querySelector("#data_criacao_tarefa") as HTMLDivElement;
        const prioridade_tarefa: HTMLDivElement = clone.querySelector("#prioridade_tarefa") as HTMLDivElement;
        const status_tarefa: HTMLDivElement = clone.querySelector("#status_tarefa") as HTMLDivElement;
        const btn_editar_tarefa: HTMLButtonElement = clone.querySelector("#editar_tarefa") as HTMLButtonElement;
        const btn_excluir_tarefa: HTMLButtonElement = clone.querySelector("#excluir_tarefa") as HTMLButtonElement;
        const concluir_tarefa: HTMLInputElement = clone.querySelector("#concluir_tarefa_checkbox") as HTMLInputElement;


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
            const div_editar_tarefa: HTMLDivElement = document.querySelector("#edit_tarefa") as HTMLDivElement;
            if (!div_editar_tarefa) {
                console.log("Elemento não encontrado");
                return;
            }
            const section_tarefa: HTMLDivElement = div_editar_tarefa.querySelector("#editar_tarefa") as HTMLDivElement;
            if (!section_tarefa) {
                console.log("Elemento não encontrado");
                return;
            }

            section_tarefa.setAttribute("id", tarefa.id);
            const titulo_editar_tarefa: HTMLInputElement = div_editar_tarefa.querySelector("#edit-titulo_tarefa") as HTMLInputElement;
            const descricao_editar_tarefa: HTMLInputElement = div_editar_tarefa.querySelector("#edit-descricao_tarefa") as HTMLInputElement;
            const data_editar_tarefa: HTMLInputElement = div_editar_tarefa.querySelector("#edit-data_tarefa") as HTMLInputElement;
            const prioridade_editar_tarefa: HTMLInputElement = div_editar_tarefa.querySelector("#edit-prioridade_tarefa") as HTMLInputElement;
            const cancelar_editar_tarefa: HTMLButtonElement = div_editar_tarefa.querySelector("#cancelar_tarefa_bnt") as HTMLButtonElement;
            const salvar_editar_tarefa: HTMLButtonElement = div_editar_tarefa.querySelector("#salvar_tarefa_bnt") as HTMLButtonElement;

            titulo_editar_tarefa.value = tarefa.titulo;
            descricao_editar_tarefa.value = tarefa.descricao;
            data_editar_tarefa.value = tarefa.data ? new Date(tarefa.data).toISOString().split("T")[0] : "";
            prioridade_editar_tarefa.value = tarefa.prioridade;

            div_editar_tarefa.removeAttribute("hidden");

            cancelar_editar_tarefa.addEventListener("click", () => {
                div_editar_tarefa.setAttribute("hidden", "");
            });

            salvar_editar_tarefa.addEventListener("click", async () => {
                editar_tarefa(tarefa.id, titulo_editar_tarefa.value, descricao_editar_tarefa.value, data_editar_tarefa.value, prioridade_editar_tarefa.value);
            });
        });

        btn_excluir_tarefa.addEventListener("click", () => {
            const confirmacao_excluir_tarefa = confirm("Deseja excluir a tarefa?");
            if (confirmacao_excluir_tarefa) {
                excluir_tarefa(tarefa.id);
            }
        });


        clone.addEventListener("click", () => {
            const div_visualizar_tarefa: HTMLDivElement = document.querySelector("#visualizar_tarefa") as HTMLDivElement;
            if (!div_visualizar_tarefa) {
                console.log("Elemento não encontrado");
                return;
            }
            const section_tarefa: HTMLDivElement = div_visualizar_tarefa.querySelector("#tarefa") as HTMLDivElement;
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
            data_visualizar_tarefa.innerText = `Data Conclusão: ${tarefa.data ? new Date(tarefa.data).toLocaleDateString() : "Sem data"}`;
            data_criacao_visualizar_tarefa.innerText = `Data Criação: ${new Date(tarefa.data_criacao).toLocaleDateString()}`;
            prioridade_visualizar_tarefa.innerText = `Prioridade: ${tarefa.prioridade}`;
            status_visualizar_tarefa.innerText = `Status: ${tarefa.status === "P" ? "Pendente" : tarefa.status === "C" ? "Concluida" : "Atrasada"}`;

            const btn_editar_tarefa: HTMLButtonElement = div_visualizar_tarefa.querySelector("#editar_tarefa") as HTMLButtonElement;
            const btn_excluir_tarefa: HTMLButtonElement = div_visualizar_tarefa.querySelector("#excluir_tarefa") as HTMLButtonElement;

            btn_editar_tarefa.addEventListener("click", () => {
                const div_editar_tarefa: HTMLDivElement = document.querySelector("#edit_tarefa") as HTMLDivElement;
                if (!div_editar_tarefa) {
                    console.log("Elemento não encontrado");
                    return;
                }
                const section_tarefa: HTMLDivElement = div_editar_tarefa.querySelector("#editar_tarefa") as HTMLDivElement;
                if (!section_tarefa) {
                    console.log("Elemento não encontrado");
                    return;
                }

                section_tarefa.setAttribute("id", tarefa.id);
                const titulo_editar_tarefa: HTMLInputElement = div_editar_tarefa.querySelector("#edit-titulo_tarefa") as HTMLInputElement;
                const descricao_editar_tarefa: HTMLInputElement = div_editar_tarefa.querySelector("#edit-descricao_tarefa") as HTMLInputElement;
                const data_editar_tarefa: HTMLInputElement = div_editar_tarefa.querySelector("#edit-data_tarefa") as HTMLInputElement;
                const prioridade_editar_tarefa: HTMLInputElement = div_editar_tarefa.querySelector("#edit-prioridade_tarefa") as HTMLInputElement;
                const cancelar_editar_tarefa: HTMLButtonElement = div_editar_tarefa.querySelector("#cancelar_tarefa_bnt") as HTMLButtonElement;
                const salvar_editar_tarefa: HTMLButtonElement = div_editar_tarefa.querySelector("#salvar_tarefa_bnt") as HTMLButtonElement;

                titulo_editar_tarefa.value = tarefa.titulo;
                descricao_editar_tarefa.value = tarefa.descricao;
                data_editar_tarefa.value = tarefa.data ? new Date(tarefa.data).toISOString().split("T")[0] : "";
                prioridade_editar_tarefa.value = tarefa.prioridade;

                div_editar_tarefa.removeAttribute("hidden");

                cancelar_editar_tarefa.addEventListener("click", () => {
                    div_editar_tarefa.setAttribute("hidden", "");
                });

                salvar_editar_tarefa.addEventListener("click", async () => {
                    editar_tarefa(tarefa.id, titulo_editar_tarefa.value, descricao_editar_tarefa.value, data_editar_tarefa.value, prioridade_editar_tarefa.value);
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
    return tarefas;
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



function atualizar_paginas(tarefas: any[]) {
    const pagina_atual: HTMLAnchorElement = document.getElementById("pagina_atual") as HTMLAnchorElement;
    const pagina_seguinte: HTMLAnchorElement = document.getElementById("pagina_seguinte") as HTMLAnchorElement;
    const total_paginas: HTMLAnchorElement = document.getElementById("total_paginas") as HTMLAnchorElement;
    const separador: HTMLAnchorElement = document.getElementById("separador") as HTMLAnchorElement;
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
        pagina_seguinte.innerText = `${parseInt(pagina_atual.innerText) + 1}`
    } else {
        pagina_seguinte.setAttribute("hidden", "");
    }
    total_paginas.innerText = tarefas.length.toString();

    separador.addEventListener("click", () => {
        if (tarefas.length < 3) return;
        const div_pags = pagina_atual.parentElement as HTMLDivElement;
        const aux1: HTMLAnchorElement = document.createElement("a") as HTMLAnchorElement;
        const aux2: HTMLAnchorElement = document.createElement("a") as HTMLAnchorElement;
        aux1.innerText = `${parseInt(pagina_seguinte.innerText) + 1}`;
        aux2.innerText = `${parseInt(total_paginas.innerText) - 1}`;
        div_pags.insertBefore(pagina_seguinte, aux1)
        div_pags.insertBefore(separador, aux2)
    })

    const proxima_pagina: HTMLAnchorElement = document.getElementById("proximo_bnt") as HTMLAnchorElement;
    const pagina_anterior: HTMLAnchorElement = document.getElementById("anterior_bnt") as HTMLAnchorElement;
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
    })
    pagina_anterior.addEventListener("click", () => {
        const pagina = parseInt(pagina_atual.innerText);
        if (pagina <= 1) {
            return;
        }
        pagina_atual.innerText = `${pagina - 1}`;
        pagina_seguinte.innerText = `${pagina}`;
    })
}

function atualizar_tarefas(tarefas: any[]) {
    const div_tarefas: HTMLDivElement = document.querySelector("#tarefas") as HTMLDivElement;
    if (!div_tarefas) {
        console.log("Div de tarefas não encontrada");
        return;
    }
    div_tarefas.innerHTML = "";
    const pagina_atual: HTMLAnchorElement = document.getElementById("pagina_atual") as HTMLAnchorElement;
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
    tarefas_pagina.forEach((tarefa: any) => {
        const template = document.querySelector("#template-tarefa") as HTMLTemplateElement;
        const clone = template.content.cloneNode(true) as DocumentFragment;
        const div_tarefa = clone.querySelector(".tarefa") as HTMLDivElement;
        const tarefa_content: HTMLDivElement = clone.querySelector(".tarefa-content") as HTMLDivElement;
        const titulo_tarefa: HTMLDivElement = clone.querySelector("#titulo_tarefa") as HTMLDivElement;
        const descricao_tarefa: HTMLDivElement = clone.querySelector("#descricao_tarefa") as HTMLDivElement;
        const data_tarefa: HTMLDivElement = clone.querySelector("#data_tarefa") as HTMLDivElement;
        const data_criacao_tarefa: HTMLDivElement = clone.querySelector("#data_criacao_tarefa") as HTMLDivElement;
        const prioridade_tarefa: HTMLDivElement = clone.querySelector("#prioridade_tarefa") as HTMLDivElement;
        const status_tarefa: HTMLDivElement = clone.querySelector("#status_tarefa") as HTMLDivElement;

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
    })
}


window.onload = async function () {
    let tarefas: any[] = await Carregar_Tarefas();
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

    const div_pags: HTMLDivElement = document.querySelector("#paginas") as HTMLDivElement;
    if (!cancelar_alteracoes_usuario || !salvar_alteracoes_usuario
        || !configuracoes || !select_ordenacao || !bnt_salvar_conf || !bnt_cancelar_conf
        || !menu_usuario || !bnt_visualizar_perfil || !bnt_new_tarefa || !bnt_add_tarefa) {
        console.log("Elemento não encontrado");
        return;
    }
    atualizar_paginas(tarefas);

    div_pags.childNodes.forEach((child: any) => {
        if (child.if != undefined && child.id != "separador" && child.id != "pagina_atual") {
            child.addEventListener("click", () => {
                const pagina = parseInt(child.innerText);
                const pagina_atual: HTMLAnchorElement = document.getElementById("pagina_atual") as HTMLAnchorElement;
                pagina_atual.innerText = `${pagina}`;
                atualizar_paginas(tarefas);
                atualizar_tarefas(tarefas);
            })
        }
    })

    cancelar_alteracoes_usuario.addEventListener("click", function () {
        document.querySelector("#perfil_usuario")?.setAttribute("hidden", "");
    });
    salvar_alteracoes_usuario.addEventListener("click", function () {
        document.querySelector("#perfil_usuario")?.setAttribute("hidden", "");
    });


    if (!bnt_new_tarefa || !bnt_add_tarefa || !bnt_cancelar_tarefa
        || !add_date || !menu_usuario || !bnt_visualizar_perfil ||
        !configuracoes || !select_ordenacao || !bnt_salvar_conf || !bnt_cancelar_conf
        || !visualizar_tarefa || !sair_visualizar_tarefa || !div_pags) {
        console.log("Elemento não encontrado");
        return;
    }

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
        tarefas = await Carregar_Tarefas();
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