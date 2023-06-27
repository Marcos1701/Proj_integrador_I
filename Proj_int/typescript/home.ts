
window.onload = function () {
    const bnt_new_tarefa: HTMLButtonElement = document.querySelector("#nova_tarefa_bnt") as HTMLButtonElement;
    const bnt_add_tarefa: HTMLButtonElement = document.querySelector("#salvar_tarefa_bnt") as HTMLButtonElement;
    const bnt_cancelar_tarefa: HTMLButtonElement = document.querySelector("#cancelar_tarefa_bnt") as HTMLButtonElement;
    const add_date: HTMLInputElement = document.querySelector("#add_tarefa #switch") as HTMLInputElement;
    const menu_usuario: HTMLButtonElement = document.querySelector("#menu_usuario_bnt") as HTMLButtonElement;

    if (!bnt_new_tarefa || !bnt_add_tarefa || !bnt_cancelar_tarefa
        || !add_date || !menu_usuario) {
        console.log("Elemento não encontrado");
        return;
    }
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


}