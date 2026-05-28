import axios from 'axios';
import { create Client } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
  );
  
  async function fetchWiki(topic) {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${topic}`;
    const res = await axios.get(url);
    
    return {
      input: res.data.title,
      output: res.data.extract
    };
  }
  
  const topic = [
  'Artificial_intelligence',
  'Machine_learning',
  'Deep_learning',
  'Neural_network',
  'Node.js',
  'JavaScript',
  'TypeScript',
  'PostgreSQL',
  'Database',
  'Computer_science',
  'Internet',
  'Cloud_computing',
  'Operating_system',
  'Linux',
  'Android_(operating_system)',
  'Cybersecurity',
  'Blockchain',
  'Cryptography',
  'Physics',
  'Mathematics',
  'Space',
  'Astronomy',
  'Robotics',
  'Software_engineering',
  'Programming_language',
  'Pop',
  'Kpop',
  'Music',
  'Portugueses',
  'Dorama',
  'School',
  'Emotionation',
  'Formula_1',
];

async function saveToDB(input, output, category) {
  const { error } = await supabase.from('datasets').insert([{
    input,
    output,
    category
  }]);
  
  if (error) {
    console.log('Error:',error.message);
  }
}

async function run() {
	for (const topic of topics) {
		try {
			const data = await fetchWiki(topic);
			
			await saveToDB(data.input, data.output, 'wiki');
			console.log('inserted: ', topic);
			
			await new Promisse(r => setTimeout(r, 503);
				
			});
		} catch (err) {
		console.error('Error: ', topic);
	}
	
	console.log('DONE - dataset populated');
}

run();