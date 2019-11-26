const express = require('express');

const server = express();

server.use(express.json())

// variável que representa todos os projetos
const projects = [];
// variável que guarda a quantidade de requisições
let count = 0

// Middleware que regista a quantidade de requisições
function qtdRequest(req, res, next) {
  count++
  console.log(`Total de requisições: ${count}`)
  return next()
}

// Função que usará o Middleware
server.use(qtdRequest)

// Middleware que checa se o projeto existe
function checkUserExists(req, res, next) {
  const { id } = req.params;
  const index = projects.findIndex(item => item.id == id);

  if (index === -1) {
    return res.status(400).json({ error: "Project does not exists" });
  }

  return next();
}

// Retorna os projetos
server.get('/projects', (req, res) => {
  return res.json(projects);
})

// Retorna um projeto específico
server.get('/projects/:id', checkUserExists, (req, res) => {
  const { id } = req.params;
  const project = projects.filter(item => item.id == id);
  return res.json(project[0]);
})

// Adiciona um novo projeto
server.post('/projects', (req, res) => {
  const { id, title } = req.body;
  const project = { id, title, tasks: [] };

  projects.push(project);
  return res.json(projects);
})

// Edita um projeto
server.put('/projects/:id', checkUserExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const index = projects.findIndex(item => item.id == id);

  projects[index].title = title;
  return res.json(projects)
})

// Exclui um projeto
server.delete('/projects/:id', checkUserExists, (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex(item => item.id == id);

  projects.splice(index, 1);
  return res.send()
})

// Adiciona uma tarefa a um projeto
server.post('/projects/:id/tasks', checkUserExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const index = projects.findIndex(item => item.id == id);

  projects[index].tasks.push(title);

  return res.json(projects);

})

server.listen(3030)