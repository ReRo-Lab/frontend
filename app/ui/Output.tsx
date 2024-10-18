import { useState,useEffect } from 'react'
import io from 'socket.io-client'
interface messageFormat{
    message: string
    newLine: boolean
}
export default function Output()
{
    const [logs,setlogs] = useState<string[]>([])
    const [newLine , setNewLine] = useState<boolean>(false)
    useEffect(()=>{
        const socket = io('http://localhost:6969')
        socket.on('print',(msg:messageFormat)=>{
            setlogs((prevlogs)=>[...prevlogs,msg.message])
            if(msg.newLine)
            {
                setNewLine(true)
            }
            else{
                setNewLine(false)
            }
        })
    },[])
    const msgs = logs.map((log,index)=>{
        if(newLine)
        {
        return <span key={index}>{log}</span>
        }
        else
        {
        return <div key={index}>{log}</div>
        }
    })
    return (
        <div className="basis-1/2">
            {msgs}
        </div>
    )
}