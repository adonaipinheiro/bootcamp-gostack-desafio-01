const express = require("express");

// Instanciando
const server = express();

// Reconhecer req tipo JSON
server.use(express.json());

let numReqs = 0;
const projects = [];

// Middleware Global
server.use((req, res, next) => {
  console.time("Request");

  numReqs++;
  console.log(`Número de requisições: ${numReqs}`);

  console.timeEnd("Request");
  next();
});

// MiddleWare local
function checkProjectExists(req, res, next) {
  const { id } = req.params;

  const project = projects.map(p => p.id == id);

  if (!project) {
    return res
      .status(400)
      .json({ message: `Não existe projeto com este ID: ${id}` });
  }

  return next();
}

server.post("/projects", (req, res) => {
  const { id, title, tasks } = req.body;

  projects.push({ id, title, tasks });

  return res
    .status(200)
    .json({ message: `Projeto "${title}" inserido com sucesso!` });
});

server.get("/projects", (req, res) => {
  return res.status(200).json(projects);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.map(project => {
    if (project.id === id) {
      project.title = title;
    }
  });

  return res
    .status(200)
    .json({ message: "Nome do projeto alterado com sucesso!" });
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  projects.map(project => {
    if (project.id === id) {
      projects.splice(project.index, 1);
    }
  });

  return res.status(200).json({ message: "Projeto removido com sucesso!" });
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.map(project => {
    if (project.id === id) {
      project.tasks.push(title);
    }
  });

  return res.status(200).json({ message: "Tarefa adicionada com sucesso!" });
});

server.listen(3000);
