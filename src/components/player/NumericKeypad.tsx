import { useState, useEffect } from 'react';
import { Delete } from 'lucide-react';
import { getTranslations } from '../../i18n';
import { useGameStore } from '../../store/gameStore';

interface NumericKeypadProps {
  onAnswer: (value: number) => void;
  disabled: boolean;
}

const KEYS = ['7', '8', '9', '4', '5', '6', '1', '2', '3'];

export function NumericKeypad({ onAnswer, disabled }: NumericKeypadProps) {
  const { lang } = useGameStore();
  const t = getTranslations(lang);
  const [input, setInput] = useState('');

  // Reset when a new question arrives (disabled transitions false→true→false)
  useEffect(() => {
    if (!disabled) setInput('');
  }, [disabled]);

  function pressDigit(d: string) {
    if (disabled) return;
    setInput((prev) => (prev.length < 4 ? prev + d : prev));
  }

  function pressDelete() {
    if (disabled) return;
    setInput((prev) => prev.slice(0, -1));
  }

  function pressConfirm() {
    if (disabled || input === '') return;
    const n = parseInt(input, 10);
    if (!isNaN(n)) onAnswer(n);
  }

  // Keyboard support
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (disabled) return;
      if (e.key >= '0' && e.key <= '9') pressDigit(e.key);
      else if (e.key === 'Backspace') pressDelete();
      else if (e.key === 'Enter') pressConfirm();
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-xs mx-auto">
      {/* Display */}
      <div className="w-full text-center py-3 px-4 bg-white rounded-2xl shadow-inner border-2 border-purple-200 text-4xl font-black text-purple-800 min-h-[68px] tracking-widest">
        {input || <span className="text-gray-300">?</span>}
      </div>

      {/* Digit grid */}
      <div className="grid grid-cols-3 gap-2 w-full">
        {KEYS.map((k) => (
          <button
            key={k}
            onClick={() => pressDigit(k)}
            disabled={disabled}
            className={[
              'keypad-btn py-4 rounded-2xl text-xl font-black transition-colors duration-100 select-none',
              disabled
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-purple-800 border-2 border-purple-200 hover:bg-purple-100 active:bg-purple-200 cursor-pointer shadow-sm',
            ].join(' ')}
          >
            {k}
          </button>
        ))}

        {/* Bottom row: delete | 0 | confirm */}
        <button
          onClick={pressDelete}
          disabled={disabled}
          className={[
            'keypad-btn py-4 rounded-2xl text-xl transition-colors duration-100 flex items-center justify-center select-none',
            disabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-red-100 text-red-600 border-2 border-red-200 hover:bg-red-200 cursor-pointer shadow-sm',
          ].join(' ')}
          aria-label={t('delete')}
        >
          <Delete size={22} />
        </button>

        <button
          key="0"
          onClick={() => pressDigit('0')}
          disabled={disabled}
          className={[
            'keypad-btn py-4 rounded-2xl text-xl font-black transition-colors duration-100 select-none',
            disabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-purple-800 border-2 border-purple-200 hover:bg-purple-100 active:bg-purple-200 cursor-pointer shadow-sm',
          ].join(' ')}
        >
          0
        </button>

        <button
          onClick={pressConfirm}
          disabled={disabled || input === ''}
          className={[
            'keypad-btn py-4 rounded-2xl text-xl font-black transition-colors duration-100 select-none',
            disabled || input === ''
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-green-500 text-white border-2 border-green-600 hover:bg-green-600 cursor-pointer shadow-sm',
          ].join(' ')}
          aria-label={t('confirm')}
        >
          ✓
        </button>
      </div>
    </div>
  );
}
