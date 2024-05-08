const express = require('express');
const sequelize = require('sequelize');
const db = require('./models')
const { Todo } = require('./models')

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public")); // serves all static files as they are
app.use(express.urlencoded({ extended: true })); // middleware to parse form data
app.use(express.json()); // middleware to parse json data

app.get('/', (req, res) => {
    Todo.findAll()
    .then(result => {
        res.render('index', { data: result })
    })
    .catch(err => {
        res.send(`Error: ${err}`)
    })
})

app.post('/create', (req, res) => {
    var title = req.body['title'];
    var description = req.body['description'];

    if (!title || !description) {
        res.send("Invalid parameters")
        return
    }

    Todo.create({
        title: title,
        description: description,
        done: false
    })
    .then((result) => {
        res.send("Success")
        return
    })
    .catch(err => {
        res.send(err);
    })
})

app.get('/toggleDone/:id', async (req, res) => {
    var id = req.params.id
    if (!id) {
        res.send("ID not provided.")
        return
    }

    const targetTodo = await Todo.findByPk(id)
    targetTodo.done = !targetTodo.done
    targetTodo.save()
    res.redirect('/')
})

app.get('/delete/:id', async (req, res) => {
    var id = req.params.id;
    if (!id) {
        res.send("ID not provided.")
        return
    }

    const targetTodo = await Todo.findByPk(id)
    if (!targetTodo) {
        res.send("Todo not found.")
        return
    }

    await targetTodo.destroy()
    res.redirect('/')
})

db.sequelize.sync().then((req) => {
    app.listen(8000, () => {
        console.log("Server started running.")
    })
})