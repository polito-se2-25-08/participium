import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "../../providers/AuthContext";
import DangerButton from "../../buttons/variants/danger/DangerButton";
import { useEffect, useState } from "react";
import { technicianService } from "../../../api/technicianService";
import { categoryService } from "../../../api/categoryService";

export default function TechnitianProfilePage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user } = useUser();
  const [categoryNames, setCategoryNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      if (user.role !== "TECHNICIAN") return;

      try {
        const [myCatsRes, allCatsRes] = await Promise.all([
          technicianService.getTechnicianCategories(),
          categoryService.getAllCategories(),
        ]);

        if (
          myCatsRes.success &&
          allCatsRes.success &&
          Array.isArray(myCatsRes.data) &&
          Array.isArray(allCatsRes.data)
        ) {
          const myIds = myCatsRes.data;
          const allCats = allCatsRes.data;
          const names = allCats
            .filter((c) => myIds.includes(c.id))
            .map((c) => c.category);
          setCategoryNames(names);
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, [user.role]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex">
          <span className="font-semibold w-32">Name:</span>
          <span className="flex-1">{user.name}</span>
        </div>

        <div className="flex">
          <span className="font-semibold w-32">Surname:</span>
          <span className="flex-1">{user.surname}</span>
        </div>

        <div className="flex">
          <span className="font-semibold w-32">Username:</span>
          <span className="flex-1">{user.username}</span>
        </div>

        <div className="flex">
          <span className="font-semibold w-32">Email:</span>
          <span className="flex-1">{user.email}</span>
        </div>

        <div className="flex">
          <span className="font-semibold w-32">Role:</span>
          <span className="flex-1">{user.role}</span>
        </div>

        <div className="flex">
          <span className="font-semibold w-32">Technical Offices:</span>
          <span className="flex-1">
            {categoryNames.length > 0 ? categoryNames.join(", ") : "None"}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <DangerButton onClick={handleLogout}>Logout</DangerButton>
        </div>
      </div>
    </>
  );
}
