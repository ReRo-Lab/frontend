'use client'
import React, { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';  // Import Socket.IO client

const Streaming = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const socket = io("http://localhost:8000");  // Update the URL with your server's address

    // When connected to the socket
    socket.on('connect', () => {
      console.log('Socket.IO connection established');
    });

    // Handle incoming video stream data
    socket.on('video_stream', (data: ArrayBuffer) => {
      // Convert ArrayBuffer to Blob (JPEG image)
      const blob = new Blob([data], { type: 'image/jpeg' });

      // Create an image object and set the Blob as its source
      const img = new Image();
      const url = URL.createObjectURL(blob);
      img.src = url;

      img.onload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear canvas before drawing new frame
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);  // Draw the image on the canvas
          }
        }

        // Release the object URL after it's used to free up memory
        URL.revokeObjectURL(url);
      };
    });

    // Handle connection errors
    socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
    });

    // Handle socket disconnection
    socket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
    });

    // Cleanup when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className='basis-1/2 w-full h-full'>
      <canvas className='w-full h-full' ref={canvasRef}></canvas>
    </div>
  );
};

export default Streaming;
