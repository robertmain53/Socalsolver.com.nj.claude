'use client';

import React from 'react';

type Section = {
  type: 'explain' | 'learn' | 'challenge';
  content: string;
};

export function parseSections(raw: string): Section[] {
  const regex = /:::([a-zA-Z]+)\s+([\s\S]*?):::/g;
  const sections: Section[] = [];
  let match;

  while ((match = regex.exec(raw)) !== null) {
    const type = match[1].trim();
    const content = match[2].trim();
    if (['explain', 'learn', 'challenge'].includes(type)) {
      sections.push({ type: type as Section['type'], content });
    }
  }

  return sections;
}

export const MDXSections: React.FC<{ content: string }> = ({ content }) => {
  const sections = parseSections(content);

  return (
    <div className="mdx-sections">
      {sections.map((section, i) => (
        <section key={i} style={{ marginBottom: '2rem' }}>
          <h2>
            {section.type === 'explain' && '🧾 How It Works'}
            {section.type === 'learn' && '🧠 Learn the Concept'}
            {section.type === 'challenge' && '🎓 Try a Challenge'}
          </h2>
          <div>
            {section.type === 'challenge' ? (
              (() => {
                try {
                  const { question, answer } = JSON.parse(section.content);
                  return (
                    <div>
                      <p><strong>Question:</strong> {question}</p>
                      <p><strong>Answer:</strong> {answer}</p>
                    </div>
                  );
                } catch {
                  return <pre>{section.content}</pre>;
                }
              })()
            ) : (
              <div dangerouslySetInnerHTML={{ __html: section.content }} />
            )}
          </div>
        </section>
      ))}
    </div>
  );
};
