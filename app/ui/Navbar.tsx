// Navbar.tsx
import { PlayIcon, StopIcon, SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { CodeBracketIcon, CommandLineIcon, VideoCameraIcon, SignalIcon, PowerIcon } from '@heroicons/react/24/outline'
import React, { useContext } from "react";
import { Mycontext } from './CodeEditor';
import { oxanium } from "./fonts";

// Define types for NavBar
interface NavbarProps {
  onRun: () => void;
  onStop: () => void;
  onOutput: () => void;
  onEditor: () => void;
  onCam: () => void;
  onLidar: () => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onRun, onStop, onOutput, onEditor, onCam, onLidar, onLogout }) => {
  const context = useContext(Mycontext);

  if (!context) {
    throw new Error("MyContext must be used within a MyContext.Provider");
  }

  const {bot,nav} = context;

  return (
    <div className="bg-[#131313] flex flex-row-reverse basis-[2%]">
      <div className="basis-1/2 flex flex-row">
        <button className="flex flex-row basis-[12%] items-center justify-items-end ml-2" onClick={onCam}>
          <VideoCameraIcon className="  text-white w-[23px] aspect-square"></VideoCameraIcon>
          <p className={`text-sm text-white ${oxanium.className} ml-2`}>Cam</p>
        </button>
        {bot === 'ros' ? (<button className="basis-[12%] flex flex-row items-center justify-items-end mt-2" onClick={onLidar}>
          <SignalIcon className="text-white w-[23px] aspect-square"></SignalIcon>
          <p className={`text-sm text-white ${oxanium.className} ml-2`}>Lidar</p>
        </button>) : null}

      </div>
      <div className="basis-1/2 flex flex-row-reverse items-center justify-items-end">
        <div className="basis-[20%]">
          <button onClick={onRun} className={`w-[23px] aspect-square mt-1`}><PlayIcon className=" text-white" /></button>
          <button onClick={onStop} className="w-[23px] aspect-square ml-4 mt-1 "><StopIcon className=" text-white" /></button>
          <button onClick={onLogout}>
            <PowerIcon className={"w-[23px] aspect-square text-white  ml-4"}></PowerIcon>
          </button>
        </div>
        <div className="flex flex-row basis-[80%]">
          <button onClick={onEditor} className={`flex flex-row basis-[25%] items-end  ${oxanium.className} ${nav==="editor"?'bg-[#1e1e1e] border-t-2 border-[#007acc]':''}`}>

            <CodeBracketIcon className={`stroke-current text-white w-[25px] aspect-square `}></CodeBracketIcon>
            <p className="text-sm text-white ml-2">Code Editor</p>
          </button>
          <button onClick={onOutput} className={`flex flex-row basis-[25%] items-end ml-2 ${oxanium.className} ${nav!=="editor"?'bg-[#1e1e1e] border-t-2 border-[#007acc]':''}`}>
            <CommandLineIcon className="text-white w-[25px] aspect-square "></CommandLineIcon>
            <p className="text-sm text-white ml-2">Output</p>
          </button>
        </div>

      </div>

    </div>
  );
};

export default Navbar;
