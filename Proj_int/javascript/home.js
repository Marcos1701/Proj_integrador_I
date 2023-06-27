"use strict";
window.onload = function () {
    const bnt_new_tarefa = document.querySelector("#nova_tarefa_bnt");
    const bnt_add_tarefa = document.querySelector("#salvar_tarefa_bnt");
    const bnt_cancelar_tarefa = document.querySelector("#cancelar_tarefa_bnt");
    const add_date = document.querySelector("#add_tarefa #switch");
    const menu_usuario = document.querySelector("#menu_usuario_bnt");
    if (!bnt_new_tarefa || !bnt_add_tarefa || !bnt_cancelar_tarefa
        || !add_date || !menu_usuario) {
        console.log("Elemento não encontrado");
        return;
    }
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
};
