import { useState } from "react";

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  isSubmitting: boolean;
}

export default function CommentForm({ onSubmit, isSubmitting }: CommentFormProps) {
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    await onSubmit(content);
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex flex-col gap-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[80px] text-sm"
          disabled={isSubmitting}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className={`px-4 py-2 rounded-md text-sm font-medium text-white transition-colors shadow-sm ${
              !content.trim() || isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </form>
  );
}
