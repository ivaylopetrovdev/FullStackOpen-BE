const mongoose = require('mongoose');

if (process.argv.length<3) {
    console.log('give password as argument');
    process.exit(1)
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@mongolearning-kkbd2.mongodb.net/phonebook?retryWrites=true`;

mongoose.connect(url, { useNewUrlParser: true });

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
    Person
        .find({})
        .then(persons=> {
            persons.forEach(personalData => {
                console.log(`${personalData.name} ${personalData.number}`);
            });
            mongoose.connection.close();
        });
} else {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    });

    person.save().then(response => {
        console.log(`added ${response.name} number ${response.number} to phonebook`);
        mongoose.connection.close();
    });
}
