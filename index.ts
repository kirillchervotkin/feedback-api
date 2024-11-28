import express = require('express')
import "reflect-metadata"
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"
import { DataSource } from "typeorm"
import {
    validate,
    IsNotEmpty
} from 'class-validator';
import bodyParser = require('body-parser')

@Entity()
class Feedback {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @IsNotEmpty()
    text: string

    @Column({ type: 'timestamptz' })
    date: Date;

    @Column({ nullable: true })
    filename: string

    @Column({ nullable: true })
    pathOfFile: string
}

const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "username",
    password: "password",
    database: "database",
    entities: [Feedback],
    synchronize: true,
    logging: false,
})

AppDataSource.initialize()
    .then(() => {
    })
    .catch((error) => console.log(error))

const feedbackRepository = AppDataSource.getRepository(Feedback);
const app = express()

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
//Get all feedback records
app.get('/feedback',async (req, res) => {
    let response = await feedbackRepository.find();
    res.json(response).status(200);
})
//Create a new feedback entry
app.post('/feedback', async (req, res) => {
    let feedback = new Feedback();
    feedback.text = req.body.text;
    feedback.date = new Date();
    feedback.filename = req.body.filename;
    feedback.pathOfFile = req.body.pathOfFile;
    const errors = await validate(feedback);
    if (errors.length) {   
        let messageOfErrors = errors.map((error) => {
            return {
                "property": error.property,
                "error": error.constraints
            }  
        })
        res.status(400).json(messageOfErrors) 
    } else {
        feedbackRepository.save(feedback);
        res.status(201).send();
    }
    //201 Created: Successful creation of a new feedback record
    //400 Bad Request: If the data in the request is incorrect
    //409 Conflict: If a record with this id already exists.
})
//Get one feedback record by ID
app.get('/feedback/:id', (req, res) => {
    //200 OK: Successful receipt of one feedback record by ID
    //404 Not Found: If an entry with this id is not found
})
//Update an existing feedback record by ID
app.put('/feedback/:id', (req, res) => {
    //200 OK: Successfully updating an existing feedback record by ID.
    //404 Not Found: If a record with this id is not found.
})
//Delete a feedback record by ID
app.delete('/feedback/:id', (req, res) => {
    //204 No Content: Successful deletion of the feedback record by ID.
    //404 Not Found: If a record with this id is not found.
})

app.listen(3000, () => {
    console.log(`Example app listening`)
})

