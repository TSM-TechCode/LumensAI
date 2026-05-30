import * as tf from '@tensorflow/tfjs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

// pega dados do banco
const { data, error } = await supabase
  .from('dataset')
  .select('title, data');

if (error) {
  throw error;
}

// junta title + qualquer coluna existente (evita erro de schema)
const corpus = data.map(row =>
  Object.values(row).join(' ')
    .toLowerCase()
    .replace(/[.,!?;:()"']/g, '')
);

// vocab
const vocab = {};
let index = 1;

corpus.forEach(text => {
  text.split(/\s+/).forEach(word => {
    if (word && !vocab[word]) {
      vocab[word] = index++;
    }
  });
});

// dataset
const xs = [];
const ys = [];

corpus.forEach(sentence => {
  const words = sentence.split(/\s+/);

  for (let i = 0; i < words.length - 1; i++) {
    xs.push(vocab[words[i]]);
    ys.push(vocab[words[i + 1]]);
  }
});

// modelo
const model = tf.sequential();

model.add(tf.layers.dense({
  units: 128,
  inputShape: [1],
  activation: 'relu'
}));

model.add(tf.layers.dense({
  units: Object.keys(vocab).length + 1,
  activation: 'softmax'
}));

model.compile({
  optimizer: 'adam',
  loss: 'sparseCategoricalCrossentropy'
});

// tensores
const xsTensor = tf.tensor2d(xs, [xs.length, 1]);
const ysTensor = tf.tensor1d(ys, 'int32');

// treino leve (Render não aguenta 500 epochs bem)
await model.fit(xsTensor, ysTensor, {
  epochs: 50,
  verbose: 1
});

// predição
function predictNext(word) {
  word = word.toLowerCase();

  const wordIndex = vocab[word];
  if (!wordIndex) return null;

  const input = tf.tensor2d([wordIndex], [1, 1]);
  const prediction = model.predict(input);

  const predictedIndex = prediction.argMax(1).dataSync()[0];

  return Object.keys(vocab).find(
    key => vocab[key] === predictedIndex
  );
}

// export principal
export function Lumens01(startWord, maxWords = 8) {
  let word = startWord.toLowerCase();
  let result = word;

  for (let i = 0; i < maxWords; i++) {
    const next = predictNext(word);
    if (!next) break;

    result += ' ' + next;
    word = next;
  }

  return result;
	}
