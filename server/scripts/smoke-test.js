#!/usr/bin/env node
import axios from 'axios';
import 'dotenv/config';

const BASE = process.env.MONGODB_URI ? (process.env.BASEURL || 'http://localhost:3000') : (process.env.BASEURL || 'http://localhost:3000');

const endpoints = [
  { method: 'get', path: '/' },
  { method: 'get', path: '/api/listing/public' },
];

async function run() {
  console.log('Running smoke tests against', BASE);
  for (const ep of endpoints) {
    try {
      const url = `${BASE}${ep.path}`;
      const res = await axios[ep.method](url, { timeout: 5000 });
      console.log(`${ep.method.toUpperCase()} ${ep.path} => ${res.status}`);
    } catch (err) {
      if (err.response) {
        console.error(`${ep.method.toUpperCase()} ${ep.path} => ${err.response.status}`);
      } else {
        console.error(`${ep.method.toUpperCase()} ${ep.path} => Error: ${err.message}`);
      }
    }
  }
}

run();
