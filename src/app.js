import express from 'express';
import cors from 'cors';
import * as tf from '@tensorflow/tfjs';
import { Lumens01 } from './Lumens-01/model.js';

const api = express();
api.use(express.json());
api.use(cors());

const middleware = (req, res, next) => {
	const REQ_API_KEY = req.headers['api_key'];
	
	if (REQ_API_KEY === process.env.API_KEY) {
		next();
	}
	else if (REQ_API_KEY !== process.env.API_KEY) {
		res.json({ 'status': 'API_KEY invalid' });
	} else {
		res.json({ 'Error': 'Unknown error'});
	}
};

api.post('/api/:model', middleware, (req, res) => {
  const model = req.params.model;
  const message = req.body.message;
  
  if (model === 'Lumens-01') {
    res.json({ output: Lumens01(message)});
  } else {
    res.status(400).json({ error: 'model or message error.'});
  }
});

const PORT = process.env.PORT || 3000;
api.listen(PORT);
