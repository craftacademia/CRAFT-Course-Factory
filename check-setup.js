const axios = require('axios');
require('dotenv').config();

const API_URL = 'http://localhost:8080/api';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function verifySetup() {
  console.log('🔍 Starting Script Route Security Verification...\n');

  try {
    // 1. Attempt Login to get a valid JWT token
    const loginRes = await axios.post(`${API_URL}/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });

    const token = loginRes.data.token;
    console.log('✅ 1. POST /api/login -> SUCCESS (JWT Token Received)');

    // 2. Test Protected Route WITH Valid Token
    const scriptRes = await axios.get(`${API_URL}/scripts`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ 2. GET /api/scripts (Authorized) -> SUCCESS');

    // 3. Test Protected Route WITHOUT Token (Should be blocked)
    try {
      await axios.get(`${API_URL}/scripts`);
      console.log('❌ 3. GET /api/scripts (Unauthorized) -> FAILED (Should have been blocked)');
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        console.log('✅ 3. GET /api/scripts (Unauthorized Check) -> SUCCESS (Access correctly blocked)');
      } else {
        throw err;
      }
    }

    console.log('\n✨ Task 1 Verification Completed Successfully!');
  } catch (error) {
    console.error('❌ Verification failed:', error.response?.data || error.message);
  }
}

verifySetup();
