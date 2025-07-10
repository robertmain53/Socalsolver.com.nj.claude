'use client';
import React from 'react';

type SectionType = 'explain' | 'learn' | 'challenge';

export const MDXSectionParser = ({ content }: { content: string }) => {
  const blocks = extractCustomBlocks(content);

  return (
    <div className="prose">
      {blocks.map((block, idx) => (
        <Section key={idx} type={block.type} content={block.content} />
      ))}
    </div>
  );
};

function extractCustomBlocks(raw: string) {
  const sections: { type: SectionType; content: string }[] = [];
  const pattern = /:::(explain|learn|challenge)[\r\n]+([\s\S]+?):::/g;
  let match;
  while ((match = pattern.exec(raw)) !== null) {
    sections.push({
      type: match[1] as SectionType,
      content: match[2].trim(),
    });
  }
  return sections;
}

const Section = ({ type, content }: { type: SectionType; content: string }) => {
  if (type === 'challenge') {
    try {
      const { question, answer } = JSON.parse(content);
      return (
        <div className="bg-yellow-50 p-4 rounded">
          <h3>🎓 Challenge</h3>
          <p><strong>Question:</strong> {question}</p>
          <p><strong>Answer:</strong> {answer}</p>
        </div>
      );
    } catch {
      return <div>Error parsing challenge block.</div>;
    }
  }

  return (
    <div className="bg-slate-50 p-4 rounded">
      <h3>
        {type === 'explain' ? '🧾 How It Works' : '🧠 Learn the Concept'}
      </h3>
      <p>{content}</p>
    </div>
  );
};

