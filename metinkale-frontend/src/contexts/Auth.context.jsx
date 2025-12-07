// // src/contexts/Auth.context.jsx
import {
  createContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import useSWRMutation from 'swr/mutation';
import * as api from '../api';
import { getKlantById } from '../api/klant';

export const JWT_TOKEN_KEY = 'jwtToken';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(JWT_TOKEN_KEY));
  const [klantId, setKlantId] = useState(localStorage.getItem('klantId'));
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState(null);

  // Haal klantgegevens op bij refresh
  useEffect(() => {
    async function fetchUser() {
      if (token && klantId) {
        setUserLoading(true);
        try {
          const data = await getKlantById(klantId);
          setUser(data);
          setUserError(null);
        } catch (err) {
          setUserError(err);
        }
        setUserLoading(false);
      }
    }
    fetchUser();
  }, [token, klantId]);

  const {
    isMutating: loginLoading,
    error: loginError,
    trigger: doLogin,
  } = useSWRMutation('http://localhost:9000/api/klanten/login', api.post);

  const {
    isMutating: registerLoading,
    error: registerError,
    trigger: doRegister,
  } = useSWRMutation('http://localhost:9000/api/klanten/register', api.post);

  const login = useCallback(
    async (email, password) => {
      try {
        const { klant, token } = await doLogin({ email, password });
        setToken(token);
        setKlantId(klant.klantID);
        localStorage.setItem(JWT_TOKEN_KEY, token);
        localStorage.setItem('klantId', klant.klantID);
        setUser(klant);
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    [doLogin],
  );

  const register = useCallback(
    async (data) => {
      try {
        const { klant, token } = await doRegister(data);
        setToken(token);
        setKlantId(klant.klantID);
        localStorage.setItem(JWT_TOKEN_KEY, token);
        localStorage.setItem('klantId', klant.klantID);
        setUser(klant);
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    [doRegister],
  );

  const logout = useCallback(() => {
    setToken(null);
    setKlantId(null);
    setUser(null);
    localStorage.removeItem(JWT_TOKEN_KEY);
    localStorage.removeItem('klantId');
  }, []);

  const value = useMemo(
    () => ({
      user,
      error: loginError || userError || registerError,
      loading: loginLoading || userLoading || registerLoading,
      isAuthed: Boolean(token),
      ready: !userLoading,
      login,
      logout,
      register,
    }),
    [token, user, loginError, loginLoading, userError, userLoading, registerError,
      registerLoading, login, logout, register],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
