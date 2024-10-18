import { WebSocket } from 'ws';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  // Create WebSocket connection to the FastAPI server (hidden from users)
  const ws = new WebSocket('ws://172.26.144.1:8000/ws/video_feed');

  ws.on('open', () => {
    console.log('WebSocket connection established');
  });

  ws.on('error', (error: Error) => {
    console.error('WebSocket error: ', error);
  });

  // Create a readable stream to forward data (frame) to the client
  const readableStream = new ReadableStream({
    start(controller: ReadableStreamDefaultController) {
      ws.on('message', (data: Buffer) => {
        controller.enqueue(data);
      });

      ws.on('close', () => {
        controller.close();
      });
    }
  });

  return new NextResponse(readableStream, {
    headers: { 'Content-Type': 'application/octet-stream' }, // Binary data
  });
}