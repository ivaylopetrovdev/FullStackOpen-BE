require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const Person = require('./models/person');

// let persons = [
//     {
//         "name": "Arto Hellas",
//         "number": "040-123456",
//         "id": 1
//     },
//     {
//         "name": "Ada Lovelace",
//         "number": "39-44-5323523",
//         "id": 2
//     },
//     {
//         "name": "Dan Abramov",
//         "number": "12-43-234345",
//         "id": 3
//     },
//     {
//         "name": "Mary Poppendieck",
//         "number": "39-23-6423122",
//         "id": 4
//     },
// ];

morgan.token('dataSent', (req) => {
    return req.dataSent;
});

function fetchReqBody (req, res, next) {
    req.dataSent = JSON.stringify(req.body);
    next()
}

app.use(express.static('build'));

app.use(bodyParser.json());

app.use(fetchReqBody);
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :dataSent'));

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON()))
    });
});

app.post('/api/persons', (request, response) => {
    const person = request.body;

    if ((!person.name || !person.number) || persons.find(p => p.name === person.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    person.id = Number(Date.now() + Math.random().toString().slice(2));

    persons = persons.concat(person);

    response.json(person)
});

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);

    return (person) ? response.json(person) : response.status(404).end();
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);

    response.status(204).end()
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
