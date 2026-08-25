import { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { authApi } from "../../services/api/auth.api";
import {
  clearUser,
  setInitializing,
  setUser,
} from "../../store/slices/authSlice";

interface Props {
  children: React.ReactNode;
}

const AuthInitializer = ({ children }: Props) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await authApi.me();

        dispatch(setUser(response.data));
      } catch {
        dispatch(clearUser());
      } finally {
        dispatch(setInitializing(false));
      }
    };

    initializeAuth();
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthInitializer;
