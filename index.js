const express = require('express')

const server = express();

server.use(express.json());

server.listen(3000);

const projects = []

var i;
for (i = 1; i <= 10; i++) {
  const project = {
    'id' : i,
    'title': 'Projeto 0'+i,
    'tasks': []
  }
  projects.push(project)
} 
var countReq = 0
server.use((req,res,next) =>{  
  countReq += 1
  console.log(`Quantidade de requisições: ${countReq};`);
  return next();
});

function checkProjectIdExists(req,res,next){
  if(!req.body.id){
    return res.status(400).json({ error: 'Project id is required'});
  }
  return next();
}

function checkProjectTitleExists(req,res,next){
  if(!req.body.title){
    return res.status(400).json({ error: 'Project title is required'});
  }
  return next();
} 

function checkTaskTitleExists(req,res,next){
  if(!req.body.title){
    return res.status(400).json({ error: 'Task title is required'});
  }
  return next();
} 

function checkProjectInArray(req,res,next){
  const { id } = req.params;
  const project = projects.find(el=> el.id == id); 

  if(!project){
    return res.status(400).json({ error: 'Project not found'});
  }

  req.project = project;
  return next();
}

server.get('/projects',(req,res)=>{
  return res.json(projects);
});

server.get('/project/:id',checkProjectInArray,(req,res) =>{     
  return res.json(req.project);
});

server.post('/projects',checkProjectIdExists,checkProjectTitleExists,(req,res) =>{  
  const { id, title, tasks } = req.body; 
  const project = { 'id':  parseInt(id), 'title': title, 'tasks': tasks};
  projects.push(project);   
  return res.json(projects);
});

server.put('/projects/:id',checkProjectInArray,checkProjectTitleExists,(req,res) =>{    
  const { title } = req.body;  
  const project = req.project
  project.title = title
  return res.json(project);
});

server.delete('/projects/:id',checkProjectInArray,(req,res) =>{  
  const index = projects.findIndex(el=> el.id === req.project.id); 
  projects.splice(index,1);
  return res.send();
});

server.post('/projects/:id/tasks',checkProjectInArray,checkTaskTitleExists,(req,res) =>{    
  const { title } = req.body; 
  const project = req.project 
  project.tasks.push(title);   
  return res.json(project);
});