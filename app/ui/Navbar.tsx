// Navbar.tsx
import { PlayIcon, StopIcon, SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import {CodeBracketIcon,CommandLineIcon,VideoCameraIcon,SignalIcon} from '@heroicons/react/24/outline'
import React, { useContext } from "react";
import { Mycontext } from './CodeEditor';

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
      <button className="flex flex-row basis-[20%]" onClick={onCam}>
        <VideoCameraIcon className="  text-white w-[25px] aspect-square mt-1"></VideoCameraIcon>
        <p className="text-sm text-white mt-1 ml-2">Cam</p>
      </button>
      {bot==='ros'?(<button className="basis-[20%] flex flex-row" onClick={onLidar}>
        <SignalIcon className="text-white w-[25px] aspect-square mt-1"></SignalIcon>
        <p className="text-sm text-white mt-1 ml-2">Lidar</p>
      </button>):null}
      
      </div>
      <div className="basis-1/2 flex flex-row-reverse">
      <div className="basis-[20%]">
      <button onClick={onRun} className="w-[25px] aspect-square mt-1 "><PlayIcon className=" text-white"/></button>
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
      <button onClick={onEditor} className= "flex flex-row basis-[20%] ml-2 mt-1">
        
        <CodeBracketIcon  className="stroke-current text-white w-[25px] aspect-square"></CodeBracketIcon>
        <p className="text-sm text-white mt-1 ml-2">Code Editor</p>
      </button>
      <button onClick={onOutput} className="flex flex-row basis-[20%] ml-8 mt-1">
        <CommandLineIcon className="text-white w-[25px] aspect-square"></CommandLineIcon>
        <p className="text-sm text-white mt-1 ml-2">Output</p>
        </button>
      </div>
      
      </div>
      
    </div>
  );
};

export default Navbar;
