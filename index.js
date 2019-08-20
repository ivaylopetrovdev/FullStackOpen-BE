require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const Person = require('./models/person');

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
    const body = request.body;

    if (!body.name) {
        return response.status(400).json({
            error: 'Name is required'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'Number is required'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    });

    person.save().then(savedPerson => {
        response.json(savedPerson.toJSON())
    });
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
