import { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20; // px
const INITIAL_SPEED = 120;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // eslint-disable-next-line no-loop-func
    if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      break;
    }
  }
  return newFood;
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const directionRef = useRef(direction);
  directionRef.current = direction;

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setHasStarted(true);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameOver) return;

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === ' ' && hasStarted) {
      setIsPaused(p => !p);
      return;
    }

    if (!hasStarted && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(e.key)) {
        setHasStarted(true);
    }

    const currentDir = directionRef.current;
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (currentDir !== 'DOWN') setDirection('UP');
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (currentDir !== 'UP') setDirection('DOWN');
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (currentDir !== 'RIGHT') setDirection('LEFT');
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (currentDir !== 'LEFT') setDirection('RIGHT');
        break;
    }
  }, [gameOver, hasStarted]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (gameOver || isPaused || !hasStarted) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { ...head };

        switch (directionRef.current) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(40, INITIAL_SPEED - Math.floor(score / 50) * 8);
    const intervalId = setInterval(moveSnake, speed);

    return () => clearInterval(intervalId);
  }, [direction, food, gameOver, isPaused, hasStarted, score]);

  useEffect(() => {
    setFood(generateFood(INITIAL_SNAKE));
  }, []);

  return (
    <div className="flex flex-col items-center bg-black border-4 border-[#00ffff] p-6 shadow-[8px_8px_0px_#ff00ff] relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#ff00ff] animate-pulse" />
      
      <div className="flex justify-between w-full mb-4 items-end border-b-2 border-[#ff00ff] pb-2">
        <div>
          <h2 className="text-2xl font-black text-[#00ffff]">
            DATA_YIELD: {score.toString().padStart(4, '0')}
          </h2>
        </div>
        <div className={`text-xl ${isPaused ? 'text-[#ff00ff] animate-pulse' : 'text-[#00ffff]'}`}>
          {isPaused ? 'ERR: PAUSED' : 'EXE: RUNNING'}
        </div>
      </div>

      <div 
        className="relative bg-[#001111] border-2 border-[#ff00ff] overflow-hidden"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
        }}
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{
               backgroundImage: `linear-gradient(to right, #00ffff 1px, transparent 1px), linear-gradient(to bottom, #00ffff 1px, transparent 1px)`,
               backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`
             }} 
        />

        <div
          className="absolute bg-[#ff00ff] shadow-[0_0_10px_#ff00ff]"
          style={{
            width: CELL_SIZE,
            height: CELL_SIZE,
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
          }}
        />

        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute ${isHead ? 'bg-[#ffffff] shadow-[0_0_15px_#ffffff] z-10' : 'bg-[#00ffff] shadow-[0_0_8px_#00ffff]'}`}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
                opacity: isHead ? 1 : Math.max(0.4, 1 - index * 0.05),
              }}
            />
          );
        })}

        {!hasStarted && !gameOver && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20 border-4 border-[#ff00ff] m-4">
            <div className="text-center p-4">
              <p className="text-[#00ffff] font-bold text-2xl mb-4 glitch-text" data-text="INITIALIZE?">INITIALIZE?</p>
              <p className="text-[#ff00ff] text-lg animate-pulse">INPUT: ARROW_KEYS</p>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 border-4 border-[#ff00ff] m-4">
            <h3 className="text-4xl font-black text-[#ff00ff] mb-4 glitch-text" data-text="FATAL_ERROR">FATAL_ERROR</h3>
            <p className="text-[#00ffff] mb-8 text-xl">YIELD: {score.toString().padStart(4, '0')}</p>
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-black border-2 border-[#00ffff] text-[#00ffff] text-xl hover:bg-[#00ffff] hover:text-black transition-none uppercase"
            >
              &gt; REBOOT_SYS
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-[#ff00ff] text-lg flex flex-col items-center gap-2 w-full border-t-2 border-[#00ffff] pt-4">
        <span>[W,A,S,D] / [ARROWS] : OVERRIDE_VECTOR</span>
        <span>[SPACE] : HALT_EXECUTION</span>
      </div>
    </div>
  );
}
