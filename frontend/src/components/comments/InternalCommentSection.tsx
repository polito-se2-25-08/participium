import { useUser } from "../providers/AuthContext";

interface CommentSectionProps {
  reportId: number;
}

export default function CommentSection({ reportId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const result = await commentService.getComments(reportId);
      if (result.success) {
        setComments(result.data);
      } else {
        setError("Failed to load comments");
      }
    } catch (err) {
      setError("An error occurred while loading comments");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [reportId]);

  const handleAddComment = async (content: string) => {
    try {
      setSubmitting(true);
      
      const currentUser = user ? {
        id: user.id,
        name: user.name,
        surname: user.surname,
        role: user.role
      } : undefined;

      const result = await commentService.addComment(reportId, content, currentUser);
      if (result.success && result.data) {
        setComments((prev) => [...prev, result.data!]);
      } else {
        // Handle error (maybe show a toast)
        console.error("Failed to add comment");
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="py-4 text-center text-gray-500 text-sm">Loading comments...</div>;
  }

  if (error) {
    return <div className="py-4 text-center text-red-500 text-sm">{error}</div>;
  }

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mt-4">
      <h4 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
        Internal Comments
      </h4>
      
      <CommentList comments={comments} />
      <CommentForm onSubmit={handleAddComment} isSubmitting={submitting} />
    </div>
  );
}
