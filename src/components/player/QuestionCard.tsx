import { type Question } from '../../types';

interface QuestionCardProps {
  question: Question;
  animKey: number; // changing this key triggers the slide-in animation
}

export function QuestionCard({ question, animKey }: QuestionCardProps) {
  return (
    <div
      key={animKey}
      className="animate-slide-in flex flex-col items-center justify-center py-8 px-6 bg-white rounded-3xl shadow-lg"
    >
      <p className="text-5xl font-black text-purple-700 tracking-tight select-none">
        {question.a} × {question.b} = ?
      </p>
    </div>
  );
}
