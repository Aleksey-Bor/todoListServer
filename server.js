const express = require('express');
const cors = require('cors'); 

const app = express();

app.use(cors())

const todoListId1 = '1';
const todoListId2 = '2';
const todoListId3 = '3';

app.get('/todo-lists', (req, res) => {
  res.json([
    {id: todoListId1, title: "Что купить", filter: "all"},
    {id: todoListId2, title: "Что изучить", filter: "completed"},
    {id: todoListId3, title: "Что посмотреть", filter: "active"},
  ]);
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
