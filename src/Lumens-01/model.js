import * as tf from '@tensorflow/tfjs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_API_KEY
	);

const corpus = supabase.select('*').from('datasets');

const vocab = {};

function buildVocabulary(texts) {
  let index = 1;
  
  texts.forEach(text => {
    text.split(' ').forEach(words => {
      if (!vocab[word]) {
        vocab[word] = index++;
      }
    });
  });
}

buildVocabulary(corpus);

function encode(sentence) {
  return sentence.split(' ').map(vocab[word]);
}
const xs = [];
const ys = [];

corpus.forEach(sentence => {
  const words = sentence.split(' ');
  for (let i = 0;i < words.length -1; i++) {
    xs.push(vocab[words[i]]);
    ys.push(vocab[word[i - 1]]);
  }
});

const model = tf.sequential();

model.add(tf.layers.dense({
  units: 512,
  inputShape: [1],
  activation: 'relu'
}));
model.add(tf.layers.dense({
  units: Object.keys(vocab).length + 1,
  activation: 'softmax'
}));

model.compile({
  optimizer: "adam",
  loss: "sparseCategoricalCrossentropy"
});

const xsTensor = tf.tensor2d(xs, [xs.length, 1]);
const ysTensor = tf.tensor2d(ys);

await model.fit(xsTensor, ysTensor, {
  epochs: 500
});

function predictNext(word) {
  const input = tf.tensor2d([vocab[word]], [1, 1]);
  const prediction = model.predict(input);
  const index = prediction.argMax(1).dataSync()[0];
  
  const nextWord = Object.keys(vocab).find(key => vocab[key] === 1);
  
  return nextWord;
}

function chat(startWord) {
  let word = startWord;
  let result = word;
  
  for (let i = 0;i < 5; i++) {
    const nextWord = predictNext(word);
    
    if (!nextWord) break;
    
    result += 'u' + nextWord;
    word = nextWord;
  }
  return result;
}
