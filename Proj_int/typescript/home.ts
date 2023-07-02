async function Carregar_Tarefas() {
    const token: string = localStorage.getItem("token") as string;
    const ordenacao: string = localStorage.getItem("ordenacao") as string;

    const retorno = await fetch("http://localhost:3000/tarefas/get/all", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, ordenacao }),
    });
    const result = await retorno.json();
    if (result.erro) {
        console.log(result.erro);
        return;
    }
    const tarefas: any[] = result.tarefas;
    const div_tarefas: HTMLDivElement = document.querySelector("#tarefas") as HTMLDivElement;
    if (!div_tarefas) {
        console.log("Elemento não encontrado");
        return;
    }
    if (tarefas.length === 0) {
        div_tarefas.innerHTML = "<h1>Nenhuma tarefa encontrada</h1>";
        return;
    }
    div_tarefas.innerHTML = "";
    const template_tarefas: HTMLTemplateElement = document.querySelector("#template-tarefa") as HTMLTemplateElement;
    if (!template_tarefas) {
        console.log("Elemento não encontrado");
        return;
    }
    for (let pagina of tarefas) {
        for (let i = 0; i < pagina.length; i++) {
            const tarefa = pagina[i];
            const clone = template_tarefas.content.cloneNode(true) as DocumentFragment;
            const div_tarefa: HTMLDivElement = clone.querySelector(".tarefa") as HTMLDivElement;
            div_tarefa.setAttribute("id", tarefa.id.toString());
            // const div_tarefa_conteudo: HTMLDivElement = clone.querySelector(".tarefa-content") as HTMLDivElement;
            const titulo: HTMLDivElement = clone.querySelector("#titulo_tarefa") as HTMLDivElement;
            const descricao: HTMLDivElement = clone.querySelector("#descricao_tarefa") as HTMLDivElement;
            titulo.innerText = tarefa.titulo;
            descricao.innerText = tarefa.descricao;
            // const div_tarefa_data: HTMLDivElement = clone.querySelector(".tarefa-data") as HTMLDivElement;
            // const data: HTMLDivElement = clone.querySelector("#data_tarefa") as HTMLDivElement;
        }
    }
}

async function adicionar_tarefa() {
    const token: string = localStorage.getItem("token") as string;
    const input_titulo: HTMLInputElement = document.querySelector("#add_tarefa #titulo_tarefa") as HTMLInputElement;
    const input_descricao: HTMLInputElement = document.querySelector("#add_tarefa #descricao_tarefa") as HTMLInputElement;
    const input_data: HTMLInputElement = document.querySelector("#add_tarefa #data_tarefa") as HTMLInputElement;
    const input_prioridade: HTMLInputElement = document.querySelector("#add_tarefa #prioridade_tarefa") as HTMLInputElement;

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
    Carregar_Tarefas();
}


window.onload = function () {
    const bnt_new_tarefa: HTMLButtonElement = document.querySelector("#nova_tarefa_bnt") as HTMLButtonElement;
    const bnt_add_tarefa: HTMLButtonElement = document.querySelector("#salvar_tarefa_bnt") as HTMLButtonElement;
    const bnt_cancelar_tarefa: HTMLButtonElement = document.querySelector("#cancelar_tarefa_bnt") as HTMLButtonElement;
    const add_date: HTMLInputElement = document.querySelector("#add_tarefa #switch") as HTMLInputElement;
    const menu_usuario: HTMLButtonElement = document.querySelector("#menu_usuario_bnt") as HTMLButtonElement;
    const bnt_visualizar_perfil: HTMLAnchorElement = document.querySelector("#perfil_bnt") as HTMLAnchorElement;
    const cancelar_alteracoes_usuario: HTMLButtonElement = document.getElementById("cancelar_perfil_bnt") as HTMLButtonElement;
    const salvar_alteracoes_usuario: HTMLButtonElement = document.getElementById("salvar_perfil_bnt") as HTMLButtonElement;
    if (!cancelar_alteracoes_usuario || !salvar_alteracoes_usuario) {
        console.log("Elemento não encontrado");
        return;
    }

    localStorage.setItem("ordenacao", "criacao");
    cancelar_alteracoes_usuario.addEventListener("click", function () {
        document.querySelector("#perfil_usuario")?.setAttribute("hidden", "");
    });
    salvar_alteracoes_usuario.addEventListener("click", function () {
        document.querySelector("#perfil_usuario")?.setAttribute("hidden", "");
    });


    if (!bnt_new_tarefa || !bnt_add_tarefa || !bnt_cancelar_tarefa
        || !add_date || !menu_usuario || !bnt_visualizar_perfil) {
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

    const log_out: HTMLAnchorElement = document.querySelector("#sair_bnt") as HTMLAnchorElement;
    if (!log_out) {
        console.log("Elemento não encontrado");
        return;
    }
    log_out.addEventListener("click", function () {
        window.location.href = "./login.html";
    })


}