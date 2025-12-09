import type { Comment } from "../types";

// Mock data store
let mockComments: Comment[] = [
  {
    id: 1,
    reportId: 1,
    userId: 2,
    user: {
      name: "John",
      surname: "Officer",
      role: "OFFICER",
    },
    content: "I have reviewed the initial report. Needs site visit.",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 2,
    reportId: 1,
    userId: 3,
    user: {
      name: "Jane",
      surname: "Tech",
      role: "TECHNICIAN",
    },
    content: "Scheduled for tomorrow morning.",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

export const commentService = {
  getComments: async (reportId: number): Promise<{ success: boolean; data: Comment[] }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const comments = mockComments.filter((c) => c.reportId === reportId);
    return { success: true, data: comments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) };
  },

  addComment: async (
    reportId: number, 
    content: string, 
    currentUser?: { id: number; name: string; surname: string; role: string }
  ): Promise<{ success: boolean; data?: Comment }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // In a real app, the backend would determine the user from the token
    // Here we use the passed user for the mock, or fallback to a default
    const newComment: Comment = {
      id: Math.max(0, ...mockComments.map(c => c.id)) + 1,
      reportId,
      userId: currentUser?.id || 999,
      user: {
        name: currentUser?.name || "Current",
        surname: currentUser?.surname || "User",
        role: currentUser?.role || "OFFICER",
      },
      content,
      createdAt: new Date().toISOString(),
    };

    mockComments.push(newComment);
    return { success: true, data: newComment };
  },
};
