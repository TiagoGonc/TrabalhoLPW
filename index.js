const express = require('express');
const { response } = require('express');
const server = express()

server.use(express.json())

server.use((request, response, next) => {
  console.log('Controle de Estoque da Empresa ABC.')
  return next()
});

const produtos = [
  
]


function CHEKID(request, response, next) {
  const id = request.params.id
  const existe = produtos.filter( produto => produto.id == id)
  if(existe.length === 0) {
    return response.status(400).json({ mensagem: 'Não existe Produto com este id.' })
  }
  return next()
}

function CHEKCAMPO(request, response, next) {
  const { id, nome, quantidade, valor } = request.body;
  if(id === ''|| nome == '' || quantidade === '' || valor === '') {
    return response.status(400).json({ mensagem: 'O campo id do produto ou nome do produto ou quantidade ou valor unitario ou complemento não existe no corpo da requisição' })
  }
  return next()
}

function CALCULO(produto) {
  for (let i = 0; i < produto.length; i++) {
    produto[i].precoTotal = produto[i].quantidade * produto[i].valor
    produto[i].precoVenda = produto[i].valor * 1.2
    produto[i].lucro = produto[i].precoVenda - produto[i].valor
    if (produto[i].quantidade < 50) {
      produto[i].situacao = 'A situação do produto é estável'
    } else if (produto[i].quantidade >= 50 && produto[i].quantidade < 100
    ) {
      produto[i].situacao = 'A situação do produto é boa'
    } else if (produto[i].quantidade >= 100) {
      produto[i].situacao = 'A situação do produto é excelente'
    }
  }
}

server.get('/produtos', (request, response) => {
  CALCULO(produtos)
  return response.json(produtos)
})

server.get('/produtos/:id', CHEKID, (request, response) => {
  const id = request.params.id
  const FiltroProduto = produtos.find( produto => produto.id == id )
  return response.json(FiltroProduto)
});

server.post('/produtos', CHEKCAMPO, (request, response) => {
  produtos.push(request.body)
  const ultimoProduto = produtos[produtos.length - 1]
  CALCULO(produtos)
  return response.json(ultimoProduto)
})

server.put('/produtos', CHEKCAMPO, (request, response) => {
  const id = request.body.id
  let indice = 0
  let FiltroProduto = produtos.filter( (produto, index) => {
    if(produto.id === id) {
      indice = index
      return produto.id === id
    }
  })

  if(FiltroProduto.length === 0) {
    return response.status(400).json({ mensagem: 'Não existe produto com este id'})
  }
  produtos[indice] = request.body
  return response.json(produtos)
})


server.delete('/produtos',(request, response) => {
  const id = request.body.id
  const FiltroProduto = produtos.find( (produto, index) => {
    if(produto.id == id) {
      console.log(produto)
      produtos.splice(index, 1)
      return produto.id == id
    }
  })
  if(!FiltroProduto) {
    return response.status(400).json({ mensagem: 'Não existe produto com este id'})
  }

  return response.json(produtos)
})

server.post('/produtos/:id/complemento', CHEKID, (request, response) => {
  const complementos = request.body.complemento
  const id = request.params.id;
  for(let i = 0; i < produtos.length; i++) {
    if(produtos[i].id === Number(id)) {
      console.log(typeof produtos[i].complemento)
      produtos[i].complemento.push(complementos)
    }
  }
  return response.json(produtos)
})

server.listen(3333);
