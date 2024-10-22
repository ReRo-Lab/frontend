"use client";
import { useEffect, useState, useRef, createContext } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import Navbar from "./Navbar";
import Streaming from "./Streaming";
import Output from "./Output";
import LdrStream from "./LdrStream";
interface MyContextType {
  theme: "vs-light" | "vs-dark";
  setTheme: React.Dispatch<React.SetStateAction<"vs-light" | "vs-dark">>;
  bot : 'iot'|'ros';
  stream : 'cam'|'lidar';
}


export const Mycontext = createContext<MyContextType | undefined>(undefined);

export default function CodeEditor() {
  const [theme, setTheme] = useState<"vs-light" | "vs-dark">("vs-dark");
  const monaco = useMonaco();
  const [nav,setNav] = useState<'output'|'editor'>('editor');
  const [stream,setStream] = useState<'cam'|'lidar'>('cam');
  const [bot,setbot] = useState<'iot'|'ros'>('ros');
  const [editorContent,setEditorContent] = useState<string>('#Rero')
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
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
  // Effect to update the theme whenever it changes

  useEffect(() => {}, [theme]);
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

  const handleStop = async () => {
    console.log("Stopping execution...");
    const res = await fetch("/api/stop", { method: "GET" });
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
    <Mycontext.Provider value={{ theme, setTheme ,bot ,stream }}>
      <div className="flex flex-col">
        <Navbar onRun={handleRun} onStop={handleStop} onOutput={handleOutput} onEditor = {handleEditor} onCam={handleCam} onLidar={handleLidar}/>
        <div className="basis-11/12 flex flex-col">
          <div className="h-screen flex flex-row-reverse">
            <div className="basis-1/2">
            {nav==='editor'?<Editor
                defaultLanguage="python"
                value={editorContent}
                theme={theme}
                onMount={handleEditorMount}
                onChange={handleEditorChange}
              ></Editor>:<Output></Output>}
              
            </div>
            {stream==='cam'?(<Streaming></Streaming>):(<LdrStream></LdrStream>)}
            
          </div>
        </div>
      </div>
    </Mycontext.Provider>
  );
}
