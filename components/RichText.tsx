'use client';

import React from 'react';

export function formatRichText(raw?: string): string {
  if (!raw) return '';
  let text = String(raw).replace(/\r\n/g, '\n');
  // Preserve indentations: tabs and multiple spaces to non-breaking spaces
  text = text.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
  text = text.replace(/ {2}/g, '&nbsp;&nbsp;');
  // Collapse explicit <br> followed by newline to prevent double breaks
  text = text.replace(/<br\s*\/?>\n?/gi, '<br />');
  // Convert standard newlines into <br />
  text = text.replace(/\n/g, '<br />');
  return text;
}

interface RichTextProps {
  content?: string;
  className?: string;
}

export default function RichText({ content, className = '' }: RichTextProps) {
  if (!content) return null;

  return (
    <div
      className={`leading-relaxed break-words [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-[#0b7337] [&_a]:underline [&_b]:font-bold [&_strong]:font-bold [&_em]:italic [&_u]:underline ${className}`}
      dangerouslySetInnerHTML={{ __html: formatRichText(content) }}
    />
  );
}
