
const express = require("express");
const app = express()
const fs = require("fs")
const { v4: uuid } = require("uuid")
const util = require("util")

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

const PORT = process.env.PORT;
function getTodos() {
    return readFile("./data.json", "utf-8").then(JSON.parse)
}

function writeTodos(todos) {
    return writeFile("./data.json", todos, "utf-8")
}

app.use(express.json())

app.post("/todo", async (req, res) => {
    const { todos } = await getTodos()
    let id = uuid()
    let todo = {
        id,
        ...req.body
    };
    await writeTodos(JSON.stringify({
        todos: [...todos, todo]
    }))
    res.send(todo)
})

app.get("/todos", async (req, res) => {
    res.send(await getTodos())
})

app.delete("/todo/:id", async (req, res) => {
    const { todos } = await getTodos()
    let index = todos.findIndex(({ id }) => req.params.id)
    await writeTodos(JSON.stringify({ todos: [...todos.slice(0, index), ...todos.slice(index + 1)] }))
    res.sendStatus(200)
})

app.put("/todo/:id", async (req, res) => {
    const { todos } = await getTodos()
    let index = todos.findIndex(({ id }) => req.params.id)
    await writeTodos(JSON.stringify({ todos: [...todos.slice(0, index), { ...todos[index], ...req.body }, ...todos.slice(index + 1)] }))
    res.sendStatus(200)


})


app.listen(PORT, () => {
    console.log(`server is up and running on http://localhost:${PORT}`)
})