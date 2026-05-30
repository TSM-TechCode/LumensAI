import * as tf from '@tensorflow/tfjs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

const { data, error } = await supabase
  .from('dataset')
  .select('title, content');

if (error) {
  throw error;
}

const corpus = data.map(
  row => `${row.title} ${row.content}`
    .toLowerCase()
    .replace(/[.,!?;:()"']/g, '')
);

const vocab = {};

function buildVocabulary(texts) {
  let index = 1;

  texts.forEach(text => {
    text.split(/\s+/).forEach(word => {
      if (word && !vocab[word]) {
        vocab[word] = index++;
      }
    });
  });
}

buildVocabulary(corpus);

const xs = [];
const ys = [];

corpus.forEach(sentence => {
  const words = sentence.split(/\s+/);

  for (let i = 0; i < words.length - 1; i++) {
    xs.push(vocab[words[i]]);
    ys.push(vocab[words[i + 1]]);
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
  optimizer: 'adam',
  loss: 'sparseCategoricalCrossentropy',
  metrics: ['accuracy']
});

const xsTensor = tf.tensor2d(xs, [xs.length, 1]);
const ysTensor = tf.tensor1d(ys, 'int32');

await model.fit(xsTensor, ysTensor, {
  epochs: 512,
  verbose: 1
});

function predictNext(word) {
  word = word.toLowerCase();

  const wordIndex = vocab[word];

  if (!wordIndex) {
    return null;
  }

  const input = tf.tensor2d([wordIndex], [1, 1]);

  const prediction = model.predict(input);

  const predictedIndex =
    prediction.argMax(1).dataSync()[0];

  return Object.keys(vocab).find(
    key => vocab[key] === predictedIndex
  ) || null;
}

export function Lumens01(startWord, maxWords = 10) {
  let word = startWord.toLowerCase();
  let result = word;

  for (let i = 0; i < maxWords; i++) {
    const nextWord = predictNext(word);

    if (!nextWord) {
      break;
    }

    result += ' ' + nextWord;
    word = nextWord;
  }

  return result;
	  }
