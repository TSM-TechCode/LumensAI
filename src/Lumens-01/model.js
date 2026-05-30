import * as tf from '@tensorflow/tfjs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

const { data, error } = await supabase
  .from('dataset')
  .select('title, data');

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
  const  palavras = frase.split ( / \s+ / ) ;

  para  ( let  i = 0 ; i < palavras.comprimento - 1 ; i ++ ) {​​ 
    xs.push ( vocab [ words [ i ] ] ) ;​​
    ys.push ( vocab [ words [ i + 1 ] ] ) ;​​
  }
} ) ;

const  model = tf.sequential ( ) ;​​

modelo.adicionar ( tf.layers.dense ( {​​​​​​
  unidades : 512 ,
  inputShape : [ 1 ] ,
  ativação : 'relu'
} ) ) ;

modelo.adicionar ( tf.layers.dense ( {​​​​​​
  unidades : Objeto.chaves ( vocabulário ) .comprimento + 1 ,​​​
  ativação : 'softmax'
} ) ) ;

modelo . compilar ( {
  otimizador : 'adam' ,
  perda : 'sparseCategoricalCrossentropy' ,
  métricas : [ 'precisão' ]
} ) ;

const  xsTensor = tf.tensor2d ( xs , [ xs.length , 1 ] ) ;​​​​
const  ysTensor = tf.tensor1d ( ys , ' int32 ' ) ;

aguardar  modelo . ajustar ( xsTensor , ysTensor , {
  épocas : 512 ,
  verboso : 1
} ) ;

função  preverPróximo ( palavra )  {
  palavra = palavra.paraLowerCase ( ) ;​​

  const  wordIndex = vocab [ palavra ] ;

  se  ( ! wordIndex )  {
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
