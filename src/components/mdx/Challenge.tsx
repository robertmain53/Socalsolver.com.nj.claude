type Props = {
  question: string;
  answer: string;
};
export default function Challenge({ question, answer }: Props) {
  return (
    <div className="p-4 border rounded bg-yellow-50 my-4">
      <strong>🤔 Challenge:</strong>
      <p className="mt-2">{question}</p>
      <details className="mt-2">
        <summary className="cursor-pointer">Answer</summary>
        <p>{answer}</p>
      </details>
    </div>
  );
}
