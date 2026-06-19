import { useState } from 'react';

import type { IPromptVariant } from '@/entities/llm-generation-config';

export interface IPromptVariantCardProps {
  variant: IPromptVariant;
  onSave: (variant: IPromptVariant) => void;
  onDelete: (id: string) => void;
  onToggleEdit: (id: string) => void;
}

export function PromptVariantCard({ variant, onSave, onDelete, onToggleEdit }: IPromptVariantCardProps) {
  const [draftSystemPrompt, setDraftSystemPrompt] = useState(variant.systemPrompt ?? '');
  const [draftPrompt, setDraftPrompt] = useState(variant.prompt);

  const handleEdit = () => {
    setDraftSystemPrompt(variant.systemPrompt ?? '');
    setDraftPrompt(variant.prompt);
    onToggleEdit(variant.id);
  };

  const handleSave = () => {
    onSave({
      ...variant,
      systemPrompt: draftSystemPrompt || null,
      prompt: draftPrompt,
    });
  };

  const handleCancel = () => {
    setDraftSystemPrompt(variant.systemPrompt ?? '');
    setDraftPrompt(variant.prompt);
    onToggleEdit(variant.id);
  };

  const handleDelete = () => {
    onDelete(variant.id);
  };

  if (variant.isEditing) {
    return (
      <div className="p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Editing Prompt Variant</span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 text-xs font-medium rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer transition-colors"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="px-3 py-1 text-xs font-medium rounded bg-gray-500 text-white hover:bg-gray-600 cursor-pointer transition-colors"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <textarea
            className="w-full h-20 p-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter system prompt (optional)..."
            value={draftSystemPrompt}
            onChange={(event) => {
              setDraftSystemPrompt(event.target.value);
            }}
          />
          <textarea
            className="w-full h-24 p-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter prompt..."
            value={draftPrompt}
            onChange={(event) => {
              setDraftPrompt(event.target.value);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Prompt Variant</span>
        <div className="flex gap-1">
          <button
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors"
            onClick={handleEdit}
            title="Edit"
          >
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M5 19h1.425L16.2 9.225L14.775 7.8L5 17.575zm-1 2q-.425 0-.712-.288T3 20v-2.425q0-.4.15-.763t.425-.637L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.437.65T21 6.4q0 .4-.138.763t-.437.662l-12.6 12.6q-.275.275-.638.425t-.762.15zM19 6.4L17.6 5zm-3.525 2.125l-.7-.725L16.2 9.225z" />
            </svg>
          </button>
          <button
            className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 cursor-pointer transition-colors"
            onClick={handleDelete}
            title="Delete"
          >
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-red-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5t.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5t-.288.713T19 6v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zm-6.287 10.713Q11 16.425 11 16V9q0-.425-.288-.712T10 8t-.712.288T9 9v7q0 .425.288.713T10 17t.713-.288m4 0Q15 16.426 15 16V9q0-.425-.288-.712T14 8t-.712.288T13 9v7q0 .425.288.713T14 17t.713-.288M7 6v13z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">System Prompt:</span>
          <div className="mt-1 p-2 rounded bg-gray-50 dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap max-h-24 overflow-y-auto">
            {variant.systemPrompt ?? <span className="text-gray-400 italic">None</span>}
          </div>
        </div>
        <div>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Prompt:</span>
          <div className="mt-1 p-2 rounded bg-gray-50 dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap max-h-32 overflow-y-auto">
            {variant.prompt || <span className="text-gray-400 italic">Empty</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
