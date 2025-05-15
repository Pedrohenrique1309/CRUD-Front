'use strict'

import { getContatos, getContatosPorNome, postContato, putContato, deleteContato } from "./contato.js"

import { uploadImageToAzure } from "./uploadImageToAzure.js"

function criarCard (contato) {
    const container = document.getElementById('container')
    const card = document.createElement('div')   
    card.classList.add('card-contato')
    card.innerHTML = `
            <img src="${contato.foto}" alt="">
            <h2>${contato.nome}</h2>
            <p>${contato.celular}</p>
    `
    container.appendChild(card)
}

async function exibirContatos () {
    const container = document.getElementById('container')
    const contatos = await getContatos()
    container.replaceChildren()
    contatos.forEach(criarCard)
}

async function exibirPesquisa (evento) {
    const container = document.getElementById('container')
    if (evento.key == 'Enter') {
        const contatos = await getContatosPorNome(evento.target.value)
        container.replaceChildren()
        contatos.forEach(criarCard)
    }
    
}

function cadastroContato () {
    document.querySelector('main').className = 'form-show'
}

function voltarHome () {
    document.querySelector('main').className = 'card-show'
}
async function salvarContato () {

    //faz o upload da imagem no container
    const uploadParams = {
        file: document.getElementById('foto').files[0],
        storageAccount: 'tutorialleonid',
        sasToken: 'sp=racwl&st=2025-05-15T12:17:37Z&se=2025-05-15T20:17:37Z&sv=2024-11-04&sr=c&sig=T7y68D4NU8YwCAjXF4cOoDyo5dBIHgY78l1I4NO6MyM%3D',
        containerName: 'fotos',
    };


    const contato = {
        "nome": document.getElementById('nome').value,
        "celular": document.getElementById('celular').value,
        //espera o upload da imagem e recebe ela 
        "foto": await uploadImageToAzure(uploadParams),
        "email": document.getElementById('email').value,
        "endereco": document.getElementById('endereco').value,
        "cidade": document.getElementById('cidade').value
    }
    
    

    if (await postContato(contato)){
        await exibirContatos()
        voltarHome()
        alert ('Cadastro realizado com sucesso!!!')
    }
        
}

exibirContatos()

document.getElementById('pesquisar')
        .addEventListener('keydown',exibirPesquisa)

document.getElementById('novo-contato')
        .addEventListener('click', cadastroContato)

document.getElementById('cancelar')
        .addEventListener('click', voltarHome)

document.getElementById('salvar')
        .addEventListener('click', salvarContato)