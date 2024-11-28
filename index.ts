import express from 'express'
const app = express()

//Get all feedback records
app.get('/feedback', (req, res) => {
    res.send('hello world')
    //200 OK: Successful receipt of all feedback records
    //404 Not Found: If the table is not found.
})
//Create a new feedback entry
app.post('/feedback', (req, res) => {
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
