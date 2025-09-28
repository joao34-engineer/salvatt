// src/scripts/debugPassword.ts
// Debug password hashing

import 'dotenv/config';
import { hashPassword, comparePassword } from '../utils/password';

async function main() {
  const password = 'StrongP@ssw0rd!';
  
  console.log('[debug] Original password:', password);
  
  // Hash the password
  const hash1 = await hashPassword(password);
  console.log('[debug] Hash 1:', hash1);
  
  // Hash it again
  const hash2 = await hashPassword(password);
  console.log('[debug] Hash 2:', hash2);
  
  // Test comparison with hash1
  const match1 = await comparePassword(password, hash1);
  console.log('[debug] Password matches hash1:', match1);
  
  // Test comparison with hash2
  const match2 = await comparePassword(password, hash2);
  console.log('[debug] Password matches hash2:', match2);
  
  // Test with wrong password
  const wrongMatch = await comparePassword('wrongpassword', hash1);
  console.log('[debug] Wrong password matches hash1:', wrongMatch);
}

main()
  .catch((err) => {
    console.error('[debug] Failed:', err);
    process.exit(1);
  });
