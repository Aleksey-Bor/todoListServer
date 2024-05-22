const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { v1: uuidv1 } = require("uuid");

const app = express();

const allowedOrigins = [
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
);

app.use(bodyParser.json());

const todoLists = [];

app.get("/todo-lists", (req, res) => {
  res.json(todoLists);
});

app.post("/todo-lists", (req, res) => {
  const { title } = req.body;
  const newId = uuidv1();

  const newItem = { id: newId, title, filter: "all" };
  todoLists.unshift(newItem);

  res.json({
    data: { ...newItem },
  });
});

app.put("/todo-lists/:id", (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const foundItemIndex = todoLists.findIndex((item) => item.id === id);

  if (foundItemIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
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
      messages: ["Task not found"],
      data: {},
    });
  }

  const deletedItem = todoLists.splice(foundItemIndex, 1)[0];

  res.json({
    resultCode: 0,
    messages: ["TodoList successfully deleted"],
    data: { ...deletedItem },
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
