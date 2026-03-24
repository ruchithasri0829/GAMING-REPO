/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#00ffff] font-mono flex flex-col items-center justify-center p-4 relative crt-flicker">
      <div className="scanlines" />
      <div className="static-noise" />

      <header className="mb-8 text-center z-10 w-full max-w-5xl border-b-4 border-[#ff00ff] pb-4">
        <h1 
          className="text-5xl md:text-7xl font-black tracking-tighter glitch-text" 
          data-text="SYS.OP.SNAKE_BEATS"
        >
          SYS.OP.SNAKE_BEATS
        </h1>
        <div className="mt-4 flex justify-between text-[#ff00ff] text-xl bg-[#00ffff]/10 p-2 border border-[#00ffff]">
          <span>STATUS: ONLINE</span>
          <span className="animate-pulse">AWAITING_INPUT...</span>
          <span>V.9.9.9</span>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl z-10 items-start justify-center">
        <div className="flex-1 w-full max-w-md">
          <MusicPlayer />
        </div>
        <div className="flex-none">
          <SnakeGame />
        </div>
      </div>
    </div>
  );
}
