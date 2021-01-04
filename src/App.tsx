import React from "react";
import { useDispatch } from "react-redux";
import { accountSetup, login, logout } from "./redux/auth/actions";
import { useAuthStatus, useAuthUser } from "./redux/auth/hooks";
import { User } from "./redux/auth/types";

function App() {
  const authStatus = useAuthStatus();
  const authUser = useAuthUser() as User;
  const dispatch = useDispatch();

  const handleSignIn = () => dispatch(login("fake@email.com", "password"));

  const handleLogout = () => dispatch(logout());

  const handleAccountSetup = () =>
    dispatch(
      accountSetup({
        email: "fake@email.com",
        firstName: "Zerry",
        lastName: "Hogan",
        password: "password",
        confirmPassword: "password",
      })
    );

  if (authStatus === "signIn") {
    return <button onClick={handleSignIn}>Click to sign in</button>;
  }

  if (authStatus === "accountSetup") {
    return <button onClick={handleAccountSetup}>Click to setup account</button>;
  }

  return <button onClick={handleLogout}>Welcome, {authUser.firstName}! Logout</button>;
}

export default App;
