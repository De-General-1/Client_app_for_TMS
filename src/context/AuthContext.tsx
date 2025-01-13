// import React, { createContext, useState, useContext, useEffect } from "react";
// import { useAuth } from "react-oidc-context"; // Import the hook from react-oidc-context
// import axios from "axios";

// // Define the context type
// interface AuthContextType {
//   user: any;  // User type depends on your needs (use 'oidc-user' if needed)
//   role: string | null;
//   loading: boolean;
//   login: () => void;
//   logout: () => void;
//   getUserRole: (userId: string) => Promise<string | null>;
// }

// // Create the context with the correct type
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Custom hook to use the auth context
// export const useAuthContext = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuthContext must be used within an AuthProvider");
//   }
//   return context;
// };

// // Define the AuthProvider component
// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const { user, isAuthenticated, isLoading, signinRedirect, signoutRedirect } = useAuth(); // Use the hook from react-oidc-context
//   const [role, setRole] = useState<string | null>(null);
//   const [loadingRole, setLoadingRole] = useState<boolean>(true);

//   // Fetch user role from an API
//   const getUserRole = async (userId: string) => {
//     try {
//       const response = await axios.get(
//         `https://ry4hi4iasd.execute-api.eu-west-1.amazonaws.com/users?id=${userId}`
//       );
//       return response.data.role || null;
//     } catch (error) {
//       console.error("Error fetching user role: ", error);
//       return null;
//     }
//   };

//   // Login method that triggers signin
//   const login = async () => {
//     await signinRedirect(); // Use react-oidc-context's signinRedirect
//   };

//   // Logout method that triggers signout
//   const logout = async () => {
//     await signoutRedirect(); // Use react-oidc-context's signoutRedirect
//   };

//   // Fetch role when user is authenticated
//   useEffect(() => {
//     if (isAuthenticated && user) {
//       const fetchUserRole = async () => {
//         try {
//           const fetchedRole = await getUserRole(user.profile.sub);
//           setRole(fetchedRole);
//         } catch (error) {
//           console.error("Error fetching user role:", error);
//           setRole("unknown");
//         } finally {
//           setLoadingRole(false);
//         }
//       };
//       fetchUserRole();
//     }
//   }, [isAuthenticated, user]);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         role,
//         loading: isLoading || loadingRole,
//         login,
//         logout,
//         getUserRole,
//       }}
//     >
//       {isLoading || loadingRole ? <div>Loading...</div> : children}
//     </AuthContext.Provider>
//   );
// };
// export { useAuth };
