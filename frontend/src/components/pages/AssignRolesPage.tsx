import { useState, useEffect } from "react";
import { getAllUsers, assignRole } from "../../api/adminService";
import { useAuth } from "../providers/AuthContext";
import PageTitle from "../titles/PageTitle";
import ContentContainer from "../containers/ContentContainer";
import type { User } from "../../interfaces/dto/user/User";

export function AssignRolesPage() {
	const { token } = useAuth();
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

	const roles: Array<"CITIZEN" | "ADMIN" | "OFFICER" | "TECHNICIAN"> = [
		"CITIZEN",
		"ADMIN",
		"OFFICER",
		"TECHNICIAN",
	];

	useEffect(() => {
		if (token) {
			fetchUsers();
		}
	}, [token]);

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
			setUsers(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load users");
		} finally {
			setLoading(false);
		}
	};

	const handleRoleChange = async (userId: string, newRole: string) => {
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

	if (loading) {
		return (
			<ContentContainer width="xl:w-3/4 sm:w-full" padding="p-5">
				<PageTitle>Assign Roles</PageTitle>
				<p className="text-gray-600">Loading users...</p>
			</ContentContainer>
		);
	}

	return (
		<ContentContainer width="xl:w-3/4 sm:w-full" padding="p-5" gap="gap-4">
			<PageTitle>Assign Roles</PageTitle>

			{error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
					{error}
				</div>
			)}

			<div className="overflow-x-auto">
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
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{users.length === 0 && !error && (
				<p className="text-gray-600 text-center py-4">No users found</p>
			)}
		</ContentContainer>
	);
}
