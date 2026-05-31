import { type Question } from '../../types';

interface MultipleChoiceAnswersProps {
  question: Question;
  onAnswer: (value: number) => void;
  disabled: boolean;
}

const OPTION_COLORS = [
  'from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700',
  'from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700',
  'from-indigo-400 to-indigo-600 hover:from-indigo-500 hover:to-indigo-700',
  'from-teal-400 to-teal-600 hover:from-teal-500 hover:to-teal-700',
];

export function MultipleChoiceAnswers({ question, onAnswer, disabled }: MultipleChoiceAnswersProps) {
  const options = question.options ?? [];

  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      {options.map((opt, i) => (
        <button
          key={opt}
          onClick={() => !disabled && onAnswer(opt)}
          disabled={disabled}
          className={[
            'py-5 rounded-2xl text-white text-2xl font-black shadow-md transition-all duration-150 bg-gradient-to-br select-none',
            OPTION_COLORS[i % OPTION_COLORS.length],
            disabled
              ? 'opacity-50 cursor-not-allowed'
              : 'active:scale-95 cursor-pointer',
          ].join(' ')}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
