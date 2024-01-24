'use strict'

const openModal = () => document.getElementById('modal').classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}


const getLocalStorage = () => JSON.parse(localStorage.getItem('db_Product')) ?? []
const setLocalStorage = (dbProduct) => localStorage.setItem("db_Product", JSON.stringify(dbProduct))


const deleteProduct = (index) => {
    const dbProduct = getProduct()
    dbProduct.splice(index, 1)
    setLocalStorage(dbProduct)
}

const updateProduct = (index, produto) => {
    const dbProduct = getProduct()
    dbProduct[index] = produto
    setLocalStorage(dbProduct)
}

const getProduct = () => getLocalStorage()

const createProduto = (produto) => {
    const dbProduct = getLocalStorage()
    dbProduct.push (produto)
    setLocalStorage(dbProduct)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}


const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
    document.querySelector(".modal-header>h2").textContent  = 'Novo Produto'
}

const saveProduct = () => {
    if (isValidFields()) {
        const produto = {
            nome: document.getElementById('nome').value,
            codigo: document.getElementById('codigo').value,
            descricao: document.getElementById('descricao').value,
            preco: document.getElementById('preco').value
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createProduto(produto)
            updateTable()
            closeModal()
        } else {
            updateProduct(index, produto)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (produto, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${produto.nome}</td>
        <td>${produto.codigo}</td>
        <td>${produto.descricao}</td>
        <td>${produto.preco}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tbProduto>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tbProduto>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbProduct = getProduct()
    clearTable()
    dbProduct.forEach(createRow)
}

const fillFields = (produto) => {
    document.getElementById('nome').value = produto.nome
    document.getElementById('codigo').value = produto.codigo
    document.getElementById('descricao').value = produto.descricao
    document.getElementById('preco').value = produto.preco
    document.getElementById('nome').dataset.index = produto.index
}

const editProduct = (index) => {
    const produto = getProduct()[index]
    produto.index = index
    fillFields(produto)
    document.querySelector(".modal-header>h2").textContent  = `Editando ${produto.nome}`
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editProduct(index)
        } else {
            const produto = getProduct()[index]
            const response = confirm(`Deseja realmente excluir o Produto ${produto.nome}`)
            if (response) {
                deleteProduct(index)
                updateTable()
            }
        }
    }
}

updateTable()

document.getElementById('cadastrarProduto')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveProduct)

document.querySelector('#tbProduto>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)