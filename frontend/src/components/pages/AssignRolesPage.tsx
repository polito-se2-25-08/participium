import { useState, useEffect } from "react";
import {
  getAllUsers,
  assignRole,
  deleteUser,
  getTechnicianCategories,
  updateTechnicianCategories,
} from "../../api/adminService";
import { categoryService } from "../../api/categoryService";
import { useAuth } from "../providers/AuthContext";
import PageTitle from "../titles/PageTitle";
import ContentContainer from "../containers/ContentContainer";
import type { User } from "../../interfaces/dto/user/User";
import DeleteUserModal from "../modals/DeleteUserModal";
import ManageCategoriesModal from "../modals/ManageCategoriesModal";

export function AssignRolesPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    // State to manage the visibility and target of the delete confirmation modal
    isOpen: boolean;
    userId: number | null;
  }>({ isOpen: false, userId: null });

  const [categoryModal, setCategoryModal] = useState<{
    isOpen: boolean;
    userId: number | null;
    selectedCategories: number[];
  }>({ isOpen: false, userId: null, selectedCategories: [] });

  const [allCategories, setAllCategories] = useState<
    { id: number; category: string }[]
  >([]);

  // Define possible roles to show (excluding "CITIZEN")
  const roles: Array<"ADMIN" | "OFFICER" | "TECHNICIAN"> = [
    "ADMIN",
    "OFFICER",
    "TECHNICIAN",
  ];

  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchCategories();
    }
  }, [token]);

  const fetchCategories = async () => {
    const response = await categoryService.getAllCategories();
    if (response.success && Array.isArray(response.data)) {
      setAllCategories(response.data);
    }
  };

  const fetchUsers = async () => {
    if (!token) {
      setError("No authentication token found");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getAllUsers(token);
      setUsers(data.filter((user: User) => user.role !== "CITIZEN")); // Exclude CITIZEN roles
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    if (!token) {
      setError("No authentication token found");
      return;
    }

    try {
      setUpdatingUserId(userId);
      setError(null);
      await assignRole(userId, newRole, token);
      // Update local state
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: newRole as User["role"] } : user
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update role");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleManageCategories = async (userId: number) => {
    if (!token) return;
    try {
      setUpdatingUserId(userId);
      const categories = await getTechnicianCategories(userId, token);
      setCategoryModal({
        isOpen: true,
        userId,
        selectedCategories: categories,
      });
    } catch (err) {
      setError("Failed to load technician categories");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const toggleCategory = (categoryId: number) => {
    setCategoryModal((prev) => {
      const isSelected = prev.selectedCategories.includes(categoryId);
      return {
        ...prev,
        selectedCategories: isSelected
          ? prev.selectedCategories.filter((id) => id !== categoryId)
          : [...prev.selectedCategories, categoryId],
      };
    });
  };

  const saveCategories = async () => {
    const { userId, selectedCategories } = categoryModal;
    if (!token || !userId) return;

    try {
      setUpdatingUserId(userId);
      await updateTechnicianCategories(userId, selectedCategories, token);
      setCategoryModal({ isOpen: false, userId: null, selectedCategories: [] });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update categories"
      );
    } finally {
      setUpdatingUserId(null);
    }
  };

  // when the "Delete" button is clicked sets the user ID and opens the confirmation modal
  const promptDeleteUser = (userId: number) => {
    setDeleteModal({ isOpen: true, userId });
  };

  // when "Cancel" is clicked resets the modal state without performing any action
  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, userId: null });
  };

  // Performs the actual delete
  const confirmDeleteUser = async () => {
    const userId = deleteModal.userId;
    if (!token || !userId) return;

    try {
      setUpdatingUserId(userId);
      setError(null);

      // Close the modal immediately
      setDeleteModal({ isOpen: false, userId: null });

      // API call to delete the user
      await deleteUser(userId, token);

      // Remove the deleted user from the local list to update UI without reloading
      setUsers(users.filter((user) => user.id !== userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (loading) {
    return (
      <ContentContainer width="xl:w-3/4 sm:w-full" padding="p-3 sm:p-5">
        <PageTitle>Assign Roles</PageTitle>
        <p className="text-gray-600 text-center mt-2">Loading users...</p>
      </ContentContainer>
    );
  }

  return (
    <ContentContainer
      width="xl:w-3/4 sm:w-full"
      padding="p-3 sm:p-5"
      gap="gap-4"
    >
      <PageTitle>Assign Roles</PageTitle>
      <div className="flex flex-col rounded-xl shadow-xl border border-gray-600 p-8 gap-3">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded text-sm sm:text-base">
            {error}
          </div>
        )}

        {/* Desktop Table View - Hidden on Mobile */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.name} {user.surname}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value)
                      }
                      disabled={updatingUserId === user.id}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2 justify-end">
                      {user.role === "TECHNICIAN" && (
                        <button
                          onClick={() => handleManageCategories(user.id)}
                          disabled={updatingUserId === user.id}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs disabled:bg-gray-400 transition-colors"
                        >
                          Offices
                        </button>
                      )}
                      <button
                        onClick={() => promptDeleteUser(user.id)}
                        disabled={updatingUserId === user.id}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs disabled:bg-gray-400 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View - Hidden on Desktop */}
        <div className="md:hidden space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Name
                  </p>
                  <p className="text-sm text-gray-900 font-medium">
                    {user.name} {user.surname}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Username
                  </p>
                  <p className="text-sm text-gray-900">{user.username}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Email
                  </p>
                  <p className="text-sm text-gray-900 break-words">
                    {user.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Role
                  </p>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    disabled={updatingUserId === user.id}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="pt-2 flex flex-col gap-2">
                  {user.role === "TECHNICIAN" && (
                    <button
                      onClick={() => handleManageCategories(user.id)}
                      disabled={updatingUserId === user.id}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm disabled:bg-gray-400 transition-colors"
                    >
                      Manage Offices
                    </button>
                  )}
                  <button
                    onClick={() => promptDeleteUser(user.id)}
                    disabled={updatingUserId === user.id}
                    className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm disabled:bg-gray-400 transition-colors"
                  >
                    Delete User
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && !error && (
          <p className="text-gray-600 text-center py-4 text-sm sm:text-base">
            No users found
          </p>
        )}
      </div>

      <ManageCategoriesModal
        isOpen={categoryModal.isOpen}
        allCategories={allCategories}
        selectedCategories={categoryModal.selectedCategories}
        onClose={() =>
          setCategoryModal({
            isOpen: false,
            userId: null,
            selectedCategories: [],
          })
        }
        onSave={saveCategories}
        onToggleCategory={toggleCategory}
      />

      <DeleteUserModal
        isOpen={deleteModal.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDeleteUser}
      />
    </ContentContainer>
  );
}
