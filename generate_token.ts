import { AccessToken } from 'livekit-server-sdk';
import dotenv from 'dotenv';

// Note: Ensure it loads from .env or .env.local depending on what you named your file!
dotenv.config({ path: '.env' });

const ROOM_NAME = 'my-test-room';
const PARTICIPANT_NAME = 'human-user';

async function createToken() {
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: PARTICIPANT_NAME,
      ttl: '1h', // Token expires in 1 hour
    }
  );

  at.addGrant({
    roomJoin: true,
    room: ROOM_NAME,
    canPublish: true,
    canSubscribe: true,
  });

  // FIX: Added 'await' because toJwt() is asynchronous in the latest SDK
  const token = await at.toJwt();
  
  console.log('\n✅ Your LiveKit Connection Token:\n');
  console.log(token);
  console.log(`\nRoom: ${ROOM_NAME} | Identity: ${PARTICIPANT_NAME}\n`);
}

createToken();