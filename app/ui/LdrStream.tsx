'use client'
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

export default function LdrStream() {
    const [imageData, setImageData] = useState<string>('');

    useEffect(() => {
        const socket = io('http://192.168.0.104:5000');

        // Emit a message to start the stream
        
        socket.on('connect',()=>{
            console.log('connected')
            socket.emit('start',{'command':'start'});
        })
        // Listen for the image stream
        socket.on('stream', (data: string) => {
            setImageData(data);
        });

        // Cleanup on component unmount
        return () => {
            console.log("hi")
            socket.emit('stop','hi')
            socket.disconnect();
        };
    }, []);

    return (
        <div>
            {imageData && <img src={`data:image/jpeg;base64,${imageData}`} alt="Streamed Image" />}
        </div>
    );
}