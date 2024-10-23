import { redirect } from 'next/navigation';
import checkCred from '../functions/functions';
import CodeEditor from '../ui/CodeEditor';

export default async function Page() {

  // Protect dashboard by JWT checking
  const res = await checkCred()
  console.log(res)

  // Redirect to login page
  if (res['status'] === false) {
    redirect('/')
  }

  // Else render the code editor
  return (
    <>
      <CodeEditor bot={res['bot']}></CodeEditor>
    </>
  )
}