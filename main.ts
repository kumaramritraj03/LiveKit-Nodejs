// main.ts
import {
    type JobContext,
    type JobProcess,
    WorkerOptions,
    cli,
    defineAgent,
    voice,
  } from '@livekit/agents';
  import * as silero from '@livekit/agents-plugin-silero';
  import * as deepgram from '@livekit/agents-plugin-deepgram';
  import * as openai from '@livekit/agents-plugin-openai';
  import * as cartesia from '@livekit/agents-plugin-cartesia';
  import { BackgroundVoiceCancellation } from '@livekit/noise-cancellation-node';
  import { fileURLToPath } from 'node:url';
  import dotenv from 'dotenv';
  import { Agent } from './agent.js';
  
  dotenv.config({ path: '.env' });
  
  export default defineAgent({
    prewarm: async (proc: JobProcess) => {
      proc.userData.vad = await silero.VAD.load();
    },
    entry: async (ctx: JobContext) => {
      console.log(`Agent joining room: ${ctx.room.name}`);
      const vad = ctx.proc.userData.vad! as silero.VAD;
  
      const session = new voice.AgentSession({
        vad,
        stt: new deepgram.STT({ model: 'nova-3', language: 'en' }),
        llm: new openai.LLM({ model: 'gpt-4o-mini' }),
        tts: new cartesia.TTS({ model: 'sonic-3', voice: '9626c31c-bec5-4cca-baa8-f8ba9e84c8bc' })
      });
  
      await ctx.connect();
  
      await session.start({
        agent: new Agent(),
        room: ctx.room,
        inputOptions: {
          noiseCancellation: BackgroundVoiceCancellation(),
        },
      });
    },
  });
  
  cli.runApp(new WorkerOptions({ agent: fileURLToPath(import.meta.url) }));