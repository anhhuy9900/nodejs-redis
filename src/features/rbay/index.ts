import express from 'express';

const app = express.Router();

app.get("/", async (req, res) => {
    try {
       
        return res.status(200).send({});	
    } catch(err: any) {
        res.status(500).send({message: err.message});
    }
});

export default app;