// Navbar.tsx
import { PlayIcon, StopIcon, SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import {CodeBracketIcon,CommandLineIcon,VideoCameraIcon,SignalIcon} from '@heroicons/react/24/outline'
import React, { useContext } from "react";
import { Mycontext } from './CodeEditor';
import { oxanium } from "./fonts";
interface NavbarProps {
  onRun: () => void;
  onStop: () => void;
  onOutput : ()=> void;
  onEditor :()=>void;
  onCam : ()=>void;
  onLidar : ()=>void;
}

const Navbar: React.FC<NavbarProps> = ({ onRun, onStop ,onOutput , onEditor,onCam,onLidar}) => {
  const context = useContext(Mycontext);

  if (!context) {
    throw new Error("MyContext must be used within a MyContext.Provider");
  }

  const { theme, setTheme ,bot} = context;
  
  return (
    <div className="bg-[#131313] flex flex-row basis-1/12">
      <div className="basis-1/2 flex flex-row">
      <button className="flex flex-row basis-[12%] items-center justify-items-center" onClick={onCam}>
        <VideoCameraIcon className="  text-white w-[25px] aspect-square"></VideoCameraIcon>
        <p className={`text-sm text-white ${oxanium.className} ml-2`}>Cam</p>
      </button>
      {bot==='ros'?(<button className="basis-[12%] flex flex-row items-center justify-items-center" onClick={onLidar}>
        <SignalIcon className="text-white w-[25px] aspect-square"></SignalIcon>
        <p className={`text-sm text-white ${oxanium.className} ml-2`}>Lidar</p>
      </button>):null}
      
      </div>
      <div className="basis-1/2 flex flex-row-reverse items-center justify-items-center">
      <div className="basis-[20%]">
      <button onClick={onRun} className={`w-[25px] aspect-square mt-1`}><PlayIcon className=" text-white"/></button>
      <button onClick={onStop} className="w-[25px] aspect-square ml-4 mt-1 "><StopIcon className=" text-white" /></button>
      <button onClick={() => setTheme(theme === 'vs-dark' ? 'vs-light' : 'vs-dark')}>
        {theme === 'vs-light' ? (
          <SunIcon className="w-[25px] aspect-square text-yellow-500 ml-4 mt-1 " />
        ) : (
          <MoonIcon className="w-[25px] aspect-square text-yellow-500 ml-4 mt-1" />
        )}
      </button>
      </div>
      <div className="flex flex-row basis-[80%]">
      <button onClick={onEditor} className= {`flex flex-row basis-[25%] items-center ${oxanium.className}`}>
        
        <CodeBracketIcon  className={`stroke-current text-white w-[25px] aspect-square `}></CodeBracketIcon>
        <p className="text-sm text-white ml-2">Code Editor</p>
      </button>
      <button onClick={onOutput} className={`flex flex-row basis-[25%] items-center ${oxanium.className}`}>
        <CommandLineIcon className="text-white w-[25px] aspect-square "></CommandLineIcon>
        <p className="text-sm text-white ml-2">Output</p>
        </button>
      </div>
      
      </div>
      
    </div>
  );
};

export default Navbar;
