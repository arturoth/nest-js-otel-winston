// loadtest.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 10, // Virtual Users
  duration: '10000s', // Duration of the test
};

export default function () {
  let ep1 = http.get(`http://localhost:8080/`); // Update with your API endpoint
  check(ep1, {
    'status is 200': (r) => r.status === 200,
  });

  let ep2 = http.get(`http://localhost:8080/health`); // Update with your API endpoint
  check(ep2, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(2);
}
