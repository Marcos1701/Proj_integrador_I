"use strict";
// import { Chart } from "chart.js/dist";
// const { Chart } = require("chart.js/dist");
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const token_adm = localStorage.getItem('token');
if (!token_adm) {
    window.location.href = './login.html';
}
function conferir_admin() {
    return __awaiter(this, void 0, void 0, function* () {
        const retorno = yield fetch("http://localhost:3000/admin/confere", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: token_adm }),
        });
        if (retorno.status === 200) {
            const result = yield retorno.json();
            const { admin } = result;
            if (!admin) {
                window.location.href = './home.html';
            }
        }
        else {
            const { error } = yield retorno.json();
            console.log(error);
        }
    });
}
function tornar_adm(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const retorno = yield fetch("http://localhost:3000/admin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: token_adm, id_usuario: id }),
        });
        if (retorno.status === 200) {
            const result = yield retorno.json();
            const { mensagem } = result.data;
            console.log(mensagem);
            window.location.reload();
        }
        else {
            const { error } = yield retorno.json();
            console.log(error);
        }
    });
}
function append_usuario(usuario) {
    const template = document.getElementById('template-usuario');
    const clone = template.content.cloneNode(true);
    const div = clone.querySelector('div');
    const nome = clone.querySelector('#nome');
    const email = clone.querySelector('#email');
    const metodo_login = clone.querySelector('#metodo_login');
    const tornar_admin = clone.querySelector('#tornar-adm');
    nome.innerText = usuario.nome_user;
    email.innerText = usuario.email_user;
    div.id = usuario.id_user;
    metodo_login.innerText = usuario.metodo_login === 1 ? 'Google' : 'Email e senha';
    if (usuario.adm) {
        div.className = 'adm';
        tornar_admin.style.display = 'none';
    }
    else {
        tornar_admin.addEventListener('click', () => {
            tornar_adm(div.id);
        });
    }
    const lista = document.getElementById('lista_usuarios');
    lista.appendChild(clone);
}
function get_usuarios() {
    return __awaiter(this, void 0, void 0, function* () {
        const retorno = yield fetch("http://localhost:3000/admin/get", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: token_adm }),
        });
        const result = yield retorno.json();
        const { erro } = result;
        if (erro) {
            console.log(erro);
            return;
        }
        if (retorno.status === 200) {
            const { usuarios } = result;
            return usuarios;
        }
        else {
            const { error } = yield retorno.json();
            console.log(error);
        }
    });
}
function append_dados_gerais(tarefas) {
    const div_dados_gerais = document.getElementById('dados_gerais');
    // const div_grafico: HTMLDivElement = div_dados_gerais.querySelector("#grafico") as HTMLDivElement;
    const div_dados = div_dados_gerais.querySelector("#dados");
    let concluidas = 0;
    let pendentes = 0;
    let atrasadas = 0;
    tarefas.forEach((tarefa) => {
        if (tarefa.status_tr === 'C') {
            concluidas++;
        }
        else if (tarefa.status_tr === 'P') {
            pendentes++;
        }
        else {
            atrasadas++;
        }
    });
    const total = concluidas + pendentes + atrasadas;
    const dados_concluidas = div_dados.querySelector('#tarefas_concluidas');
    const dados_pendentes = div_dados.querySelector('#tarefas_pendentes');
    const dados_atrasadas = div_dados.querySelector('#tarefas_atrasadas');
    dados_concluidas.innerText = `Total de Tarefas Concluidas: ${concluidas}, equivale a ${(concluidas / total) * 100}% do total de tarefas`;
    dados_pendentes.innerText = `Total de Tarefas Pendentes: ${pendentes}, equivale a ${(pendentes / total) * 100}% do total de tarefas`;
    dados_atrasadas.innerText = `Total de Tarefas Atrasadas: ${atrasadas}, equivale a ${(atrasadas / total) * 100}% do total de tarefas`;
    // const graph: HTMLCanvasElement = div_grafico.querySelector('#myChart') as HTMLCanvasElement;
    // new Chart(graph, {
    //     type: 'pie',
    //     data: {
    //         labels: ['Concluidas', 'Pendentes', 'Atrasadas'],
    //         datasets: [{
    //             label: 'Tarefas',
    //             data: [concluidas, pendentes, atrasadas],
    //             backgroundColor: [
    //                 'rgb(0, 255, 0)',
    //                 'rgb(255, 255, 0)',
    //                 'rgb(255, 0, 0)'
    //             ],
    //             hoverOffset: 4
    //         }]
    //     },
    //     options: {
    //         responsive: true,
    //         maintainAspectRatio: false,
    //     }
    // });
}
function get_dados_gerais() {
    return __awaiter(this, void 0, void 0, function* () {
        const retorno = yield fetch("http://localhost:3000/admin/get/all", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: token_adm }),
        });
        const result = yield retorno.json();
        const { erro } = result;
        if (erro) {
            console.log(erro);
            return;
        }
        if (retorno.status === 200) {
            const { tarefas } = result;
            console.log(tarefas);
            append_dados_gerais(tarefas);
        }
        else {
            const { error } = yield retorno.json();
            console.log(error);
        }
    });
}
window.onload = () => __awaiter(void 0, void 0, void 0, function* () {
    conferir_admin();
    const bnt_lista_usuario = document.getElementById('lista_user-bnt');
    const bnt_dados_gerais = document.getElementById('dados_gerais-bnt');
    bnt_lista_usuario.addEventListener('click', () => {
        if (bnt_lista_usuario.className === 'selecionado')
            return;
        const lista = document.getElementById('lista_usuarios');
        lista.className = 'active';
        const dados_gerais = document.getElementById('dados_gerais');
        dados_gerais.className = 'disabled';
        bnt_lista_usuario.className = 'selecionado';
    });
    bnt_dados_gerais.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
        if (bnt_dados_gerais.className === 'selecionado')
            return;
        const lista = document.getElementById('lista_usuarios');
        lista.className = 'disabled';
        const dados_gerais = document.getElementById('dados_gerais');
        yield get_dados_gerais();
        bnt_dados_gerais.className = 'selecionado';
    }));
    const usuarios = yield get_usuarios();
    usuarios.forEach((usuario) => {
        append_usuario(usuario);
    });
});
