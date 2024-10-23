"use client";
import { useEffect, useState, useRef, createContext } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import Navbar from "./Navbar";
import Streaming from "./Streaming";
import Output from "./Output";
import LdrStream from "./LdrStream";
import { getCookie, setCookie } from "cookies-next";
import io from 'socket.io-client'
import { headers } from "next/headers";
import { useRouter } from "next/navigation";

interface MyContextType {
  theme: "vs-light" | "vs-dark";
  setTheme: React.Dispatch<React.SetStateAction<"vs-light" | "vs-dark">>;
  bot : 'iot'|'ros';
  stream : 'cam'|'lidar';
  nav : 'editor'|'output'
}
export interface MessageProps{
  print: string;
  bot:'iot'|'ros'
  type :'info'|'error';
}
interface CodeEditorProps{
  bot:'iot'|'ros'
}

export const Mycontext = createContext<MyContextType | undefined>(undefined);

export default function CodeEditor({bot}:CodeEditorProps) {
  const router = useRouter()
  const [theme, setTheme] = useState<"vs-light" | "vs-dark">("vs-dark");
  const monaco = useMonaco();
  const [nav,setNav] = useState<'output'|'editor'>('editor');
  const [stream,setStream] = useState<'cam'|'lidar'>('cam');
 
  const [editorContent,setEditorContent] = useState<string>(`def main():
    dump("Hello")
    `)


  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [logs,setLogs] = useState<MessageProps[]>([])
  //const editorInstanceRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  function handleEditorMount(editor: monaco.editor.IStandaloneCodeEditor) {
    editorRef.current = editor;
  }
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setEditorContent(value);
    }
  };
  useEffect(() => {
    if (monaco) {
      monaco.editor.setTheme(theme);
    }
  }, [monaco, theme]);

  // Clear the JWT Token and logout
  const handleLogout = async () => {
    
    const jwt = getCookie("JWTtoken")
    if(!jwt)
    {
      console.log('No token found')
    }
    else{
      const result = await fetch('/api/logout', {method: 'GET', headers: {"jwt": jwt.toString()}});
      setCookie("JWTtoken", "");
      router.push('/')
      
    }
    
  }

  // Effect to update the theme whenever it changes
  const handleRun = async () => {
    if (editorRef.current) {
      console.log("Running Code:", monaco);
      const code = editorRef.current.getValue();
      console.log(code);
      const j = { code: code };
      try {
        const res = await fetch("/api/file", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "bot":bot
          },
          body: JSON.stringify(j),
        });
        //const b = await res.blob()

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        //const data = await res.json();
        console.log("Response Cameeee:");
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  useEffect(()=>{
    // Get server ip from environment
    const serverIP = process.env.NEXT_PUBLIC_SERVER_IP;
    const cookie = getCookie('JWTtoken')
    console.log(cookie)
    const socket = io(serverIP,{
        extraHeaders :{
            'AUTHORIZATION':`${cookie}`
        }
    })
    socket.on('print',(msg:MessageProps)=>{
        console.log(msg)
        setLogs((prevlogs)=>{
          if(prevlogs.length>20){
            return []
          }
          else{
            return [...prevlogs,msg] 
          }
          })
    })
    socket.on('connect', () => {
      console.log("Connected to socket")
    })
    socket.on('disconnect', () => {
        console.log('Socket.IO disconnected');
      });
  
      // Cleanup when the component unmounts
      return () => {
        
        socket.disconnect();
      };
},[])
  const handleStop = async () => {
    const data = {'bot':bot}
    console.log("Stopping execution...");
    const res = await fetch("/api/stop", { method: "GET" ,headers:{
      'bot':bot
    }});
    console.log(res.body);
  };

  const handleOutput = ()=>{
    setNav('output')
  }
  const handleEditor = ()=>{
    setNav('editor')
  }
  const handleCam = ()=>{
    setStream('cam')
  }
  const handleLidar = ()=>{
    setStream('lidar')
  }
  //<div ref={editorRef}  className="w-full basis-[99%]"></div>
  return (
    <Mycontext.Provider value={{ theme, setTheme ,bot ,stream ,nav}}>
      <div className="flex flex-col">
        <Navbar onRun={handleRun} onStop={handleStop} onOutput={handleOutput} onEditor = {handleEditor} onCam={handleCam} onLidar={handleLidar} onLogout={handleLogout}/>
        <div className=" flex flex-col">
          <div className="h-screen flex flex-row-reverse">
            <div className="basis-1/2">
            {nav==='editor'?<Editor
                defaultLanguage="python"
                value={editorContent}
                theme={theme}
                onMount={handleEditorMount}
                onChange={handleEditorChange}
              ></Editor>:<Output msg={logs}></Output>}
              
            </div>
            {stream==='cam'?(<Streaming></Streaming>):(<LdrStream></LdrStream>)}
            
          </div>
        </div>
      </div>
    </Mycontext.Provider>
  );
}
