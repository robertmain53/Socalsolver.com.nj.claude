export default function Explanation({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l-4 border-blue-500 bg-blue-50 p-4 my-4">
      <strong className="block text-blue-700 mb-2">Explanation</strong>
      <div>{children}</div>
    </div>
  );
}
