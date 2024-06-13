const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { v1: uuidv1 } = require("uuid");

const app = express();

app.use(cors()); // Разрешить все источники

/* const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:6006",
  "http://192.168.100.4:6006",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
); */

app.use(bodyParser.json());

const todoLists = [];
const tasks = {};

//Обработка запросов для todoLists
app.get("/todo-lists", (req, res) => {
  res.json(todoLists);
});

app.post("/todo-lists", (req, res) => {
  const { title } = req.body;
  const newId = uuidv1();

  if (title.length > 100) {
    return res
      .status(400)
      .json({ message: "Title should not exceed 100 characters" });
  }

  const newItem = { id: newId, title, filter: "all" };
  todoLists.unshift(newItem);

  res.json({
    data: { ...newItem },
  });
});

app.put("/todo-lists/:id", (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  if (title.length > 100) {
    return res
      .status(400)
      .json({ message: "Title should not exceed 100 characters" });
  }

  const foundItemIndex = todoLists.findIndex((item) => item.id === id);

  if (foundItemIndex === -1) {
    return res.status(404).json({ message: "TodoList not found" });
  }

  const updatedItem = { ...todoLists[foundItemIndex], title };
  todoLists[foundItemIndex] = updatedItem;

  res.json({
    data: { ...updatedItem },
  });
});

app.delete("/todo-lists/:id", (req, res) => {
  const { id } = req.params;

  const foundItemIndex = todoLists.findIndex((item) => item.id === id);

  if (foundItemIndex === -1) {
    return res.status(404).json({
      resultCode: 1,
      messages: ["TodoList not found"],
      data: {},
    });
  }

  const deletedTodoList = todoLists.splice(foundItemIndex, 1)[0];
  delete tasks[id];

  res.json({
    resultCode: 0,
    messages: ["TodoList successfully deleted"],
    data: { ...deletedTodoList },
  });
});

// Обработка запросов для tasks
app.get("/todo-lists/:todolistId/tasks", (req, res) => {
  const { todolistId } = req.params;
  res.json({ data: tasks[todolistId] || [] });
});

app.post("/todo-lists/:todolistId/tasks", (req, res) => {
  const { todolistId } = req.params;
  const { title } = req.body;

  if (title.length > 500) {
    return res
      .status(400)
      .json({ message: "Title should not exceed 500 characters" });
  }

  const todoListExists = todoLists.some(
    (todoList) => todoList.id === todolistId
  );
  if (!todoListExists) {
    return res.status(404).json({ message: "TodoList not found" });
  }

  const newTask = { id: uuidv1(), title, isDone: false };

  if (!tasks[todolistId]) {
    tasks[todolistId] = [];
  }
  tasks[todolistId].unshift(newTask);

  res.json({ data: newTask });
});

app.put("/todo-lists/:todoListId/tasks/:taskId", (req, res) => {
  const { todoListId, taskId } = req.params;
  const { title, isDone } = req.body;

  if (title && title.length > 500) {
    return res
      .status(400)
      .json({ message: "Title should not exceed 500 characters" });
  }

  const foundTodoListIndex = todoLists.findIndex(
    (item) => item.id === todoListId
  );

  if (foundTodoListIndex === -1) {
    return res.status(404).json({ message: "TodoList not found" });
  }

  const foundTaskIndex = tasks[todoListId].findIndex(
    (item) => item.id === taskId
  );

  if (foundTaskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  const todoListTasks = tasks[todoListId];
  const updatedItem = { ...todoListTasks[foundTaskIndex] };

  if (title !== undefined) {
    updatedItem.title = title;
  }

  if (isDone !== undefined) {
    updatedItem.isDone = !updatedItem.isDone;
  }
  

  tasks[todoListId][foundTaskIndex] = updatedItem;

  res.json({
    data: { ...updatedItem },
  });
});

app.delete("/todo-lists/:todoListId/tasks/:taskId", (req, res) => {
  const { todoListId, taskId } = req.params;

  const foundTodoListIndex = todoLists.findIndex(
    (item) => item.id === todoListId
  );

  if (foundTodoListIndex === -1) {
    return res.status(404).json({
      resultCode: 1,
      messages: ["TodoList not found"],
      data: {},
    });
  }

  const foundTaskIndex = tasks[todoListId].findIndex(
    (item) => item.id === taskId
  );

  if (foundTaskIndex === -1) {
    return res.status(404).json({
      resultCode: 1,
      messages: ["Task not found"],
      data: {},
    });
  }

  const deletedTask = tasks[todoListId].splice(foundTaskIndex, 1)[0];

  res.json({
    resultCode: 0,
    messages: ["Task successfully deleted"],
    data: { ...deletedTask },
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
