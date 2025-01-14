import { MessageProps } from './CodeEditor'
import { Poppins } from 'next/font/google'
interface OutputProps {
    msg: MessageProps[]
}
const popins = Poppins({ subsets: ['latin'], weight: '400' })
export default function Output({ msg }: OutputProps) {
    const msgs = msg.map((log, index) => {
        return (
            <div key={index} className={log.type === 'info' ? `text-white ${popins.className}` : `text-red-400 ${popins.className}` }>
                {log.print}
            </div>
        )
    })
    console.log(msgs)
    return (
        <textarea className="bg-[#1e1e1e] w-screen overflow-scroll basis-[38%]" >
            {msgs}
        </textarea>
    )
}