import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100">
      <h1 className="text-3xl font-bold text-blue-600 underline">
        Todo 앱 마이그레이션 시작!
      </h1>
      <p className="mt-4 text-gray-600">Tailwind CSS v4 스타일링이 정상적으로 적용되었습니다.</p>
    </div>
  )
}

export default App
