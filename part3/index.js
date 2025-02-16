const express = require("express");
const app = express();
app.use(express.json());
const morgan = require("morgan");

// Middleware para mostrar el body en las solicitudes POST
morgan.token("body", (req) => JSON.stringify(req.body));

// Formato personalizado con :body
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const genId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.get("/info", (req, res) => {
  const date = new Date();
  res.send(`Phonebook has info for ${persons.length} people <br> ${date}`);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id !== id);
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number missing",
    });
  }
  if (persons.find((p) => p.name === body.name)) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }
  const newPerson = {
    id: genId(),
    name: body.name,
    number: body.number,
  };
  persons = [...persons, newPerson];
  res.json(newPerson);
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
