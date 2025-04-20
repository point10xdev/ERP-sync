import { useAuth } from "../auth/store/authAtoms";

export const HomePage = () => {
  const { user } = useAuth();
  return <h1 className="text-2xl font-bold">Welcome, {user?.username}!</h1>;
};
