import express = require('express')
import "reflect-metadata"
import { Entity, Column, PrimaryGeneratedColumn, Between, FindOptionsWhere } from "typeorm"
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
    let findOptions: FindOptionsWhere<Feedback> = {};

    if ((req.query.from !== undefined) || (req.query.to !== undefined)) {
        if (typeof req.query.from !== "string") {
            res.status(400).json({"error": "The request must contain exactly one 'from' parameter"});
            return;
        }
        if (typeof req.query.to !== "string") {
            res.status(400).json({"error": "The request must contain exactly one 'to' parameter"});
            return;
        }
        const dateFrom = Date.parse(req.query.from);
        const dateTo = Date.parse(req.query.to);
        const errors: string[] = [];
        if (isNaN(dateFrom)) {
            errors.push(`Error converting to date: ${req.query.from}`);
        }
        if (isNaN(dateTo)) {
            errors.push(`Error converting to date: ${req.query.to}`);
        }
        if (errors.length) {
            res.status(400).json({"errors": errors});
            return;
        }
        findOptions.date = Between(new Date(dateFrom), new Date(dateTo));
    };

    let result = await feedbackRepository.findBy(findOptions);
    res.status(200).json(result);
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
app.get('/feedback/:id', async (req, res) => {
    const id = +req.params.id;
    if (isNaN(id)) {
        res.status(400).json({"error": `Error converting to number: ${req.params.id}`});
        return;
    };
    let response = await feedbackRepository.findOneBy({
        id: id,
    });
    if (response === null) {
        res.status(404).json({"error": "Entry with this id is not found"}); 
        return;
    }
    res.status(200).json(response);
    //200 OK: Successful receipt of one feedback record by ID
    //404 Not Found: If an entry with this id is not found
})
//Update an existing feedback record by ID
app.put('/feedback/:id', async (req, res) => {
    const id = +req.params.id;
    if (isNaN(id)) {
        res.status(400).json({"error": `Error converting to number: ${req.params.id}`});
        return;
    };
    
    let partialFeedback = new Feedback();
    partialFeedback.id = id;
    partialFeedback.text = req.body.text;
    partialFeedback.date = new Date();
    partialFeedback.filename = req.body.filename;
    partialFeedback.pathOfFile = req.body.pathOfFile;
    
    let feedback = await feedbackRepository.preload(partialFeedback);
    if (feedback === undefined) {
        res.status(404).json({"error": "Entry with this id is not found"}); 
        return;
    }

    const errors = await validate(feedback);
    if (errors.length) {   
        let messageOfErrors = errors.map((error) => {
            return {
                "property": error.property,
                "error": error.constraints
            }  
        })
        res.status(400).json(messageOfErrors);
        return; 
    }

    await feedbackRepository.update(id, feedback);
    res.status(200).send();
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

