// import { Chart } from "chart.js/dist";
// const { Chart } = require("chart.js/dist");

const token_adm = localStorage.getItem('token');
if (!token_adm) {
    window.location.href = './login.html';
}

async function conferir_admin() {
    const retorno = await fetch("http://localhost:3000/admin/confere", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token_adm }),
    });

    if (retorno.status === 200) {
        const result = await retorno.json();
        const { admin } = result;
        if (!admin) {
            window.location.href = './home.html';
        }

    } else {
        const { error } = await retorno.json();
        console.log(error);
    }
}

async function tornar_adm(id: string) {
    const retorno = await fetch("http://localhost:3000/admin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token_adm, id_usuario: id }),
    });

    if (retorno.status === 200) {
        const result = await retorno.json();
        const { mensagem } = result.data;
        console.log(mensagem);
        window.location.reload();
    } else {
        const { error } = await retorno.json();
        console.log(error);
    }
}

function append_usuario(usuario: any) {
    const template = document.getElementById('template-usuario') as HTMLTemplateElement;
    const clone = template.content.cloneNode(true) as DocumentFragment;
    const div: HTMLDivElement = clone.querySelector('div') as HTMLDivElement;
    const nome: HTMLParagraphElement = clone.querySelector('#nome') as HTMLParagraphElement;
    const email: HTMLParagraphElement = clone.querySelector('#email') as HTMLParagraphElement;
    const metodo_login: HTMLParagraphElement = clone.querySelector('#metodo_login') as HTMLParagraphElement;
    const tornar_admin: HTMLAnchorElement = clone.querySelector('#tornar-adm') as HTMLAnchorElement;

    nome.innerText = usuario.nome_user;
    email.innerText = usuario.email_user;
    div.id = usuario.id_user;
    metodo_login.innerText = usuario.metodo_login === 1 ? 'Google' : 'Email e senha';


    if (usuario.adm) {
        div.className = 'adm'
        tornar_admin.style.display = 'none';
    } else {
        tornar_admin.addEventListener('click', () => {
            tornar_adm(div.id);
        });
    }

    const lista: HTMLDivElement = document.getElementById('lista_usuarios') as HTMLDivElement;
    lista.appendChild(clone);
}


async function get_usuarios() {
    const retorno = await fetch("http://localhost:3000/admin/get", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token_adm }),
    });

    const result = await retorno.json();
    const { erro } = result;
    if (erro) {
        console.log(erro);
        return;
    }

    if (retorno.status === 200) {
        const { usuarios } = result;
        return usuarios;
    } else {
        const { error } = await retorno.json();
        console.log(error);
    }
}


function append_dados_gerais(tarefas: any) {

    const div_dados_gerais: HTMLDivElement = document.getElementById('dados_gerais') as HTMLDivElement;
    // const div_grafico: HTMLDivElement = div_dados_gerais.querySelector("#grafico") as HTMLDivElement;
    const div_dados: HTMLDivElement = div_dados_gerais.querySelector("#dados") as HTMLDivElement;

    let concluidas = 0;
    let pendentes = 0;
    let atrasadas = 0;

    tarefas.forEach((tarefa: any) => {
        if (tarefa.status_tr === 'C') {
            concluidas++;
        } else if (tarefa.status_tr === 'P') {
            pendentes++;
        } else {
            atrasadas++;
        }
    });

    const total = concluidas + pendentes + atrasadas;
    const dados_concluidas = div_dados.querySelector('#tarefas_concluidas') as HTMLParagraphElement;
    const dados_pendentes = div_dados.querySelector('#tarefas_pendentes') as HTMLParagraphElement;
    const dados_atrasadas = div_dados.querySelector('#tarefas_atrasadas') as HTMLParagraphElement;

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

async function get_dados_gerais() {
    const retorno = await fetch("http://localhost:3000/admin/get/all", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token_adm }),
    });

    const result = await retorno.json();
    const { erro } = result;
    if (erro) {
        console.log(erro);
        return;
    }

    if (retorno.status === 200) {
        const { tarefas } = result;
        console.log(tarefas);
        append_dados_gerais(tarefas);
    } else {
        const { error } = await retorno.json();
        console.log(error);
    }
}


window.onload = async () => {
    conferir_admin();
    const bnt_lista_usuario: HTMLAnchorElement = document.getElementById('lista_user-bnt') as HTMLAnchorElement;
    const bnt_dados_gerais: HTMLAnchorElement = document.getElementById('dados_gerais-bnt') as HTMLAnchorElement;

    bnt_lista_usuario.addEventListener('click', () => {
        if (bnt_lista_usuario.className === 'selecionado') return;
        const lista: HTMLDivElement = document.getElementById('lista_usuarios') as HTMLDivElement;
        lista.className = 'active';
        const dados_gerais: HTMLDivElement = document.getElementById('dados_gerais') as HTMLDivElement;
        dados_gerais.className = 'disabled';
        bnt_lista_usuario.className = 'selecionado'
    });

    bnt_dados_gerais.addEventListener('click', async () => {
        if (bnt_dados_gerais.className === 'selecionado') return;
        const lista: HTMLDivElement = document.getElementById('lista_usuarios') as HTMLDivElement;
        lista.className = 'disabled';
        const dados_gerais: HTMLDivElement = document.getElementById('dados_gerais') as HTMLDivElement;
        await get_dados_gerais();
        bnt_dados_gerais.className = 'selecionado'
    });
    const usuarios = await get_usuarios();
    usuarios.forEach((usuario: any) => {
        append_usuario(usuario);
    });
}