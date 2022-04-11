const express = require('express')
const registration = require("./registration")

const app = express()
const port = 3000

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.post('/register', async (req, res) => {
    let reg = await registration.save(req.body);
    res.send(reg);
})

app.get('/register/:id', async (req, res) => {
    let id = req.params.id;
    let reg = await registration.get(id);
    res.send(reg);
})

app.put('/register/:id/status/:status', async (req, res) => {
    let id = req.params.id;
    let status = req.params.status;
    let reg = await registration.update(id, status);
    res.send(reg);
})