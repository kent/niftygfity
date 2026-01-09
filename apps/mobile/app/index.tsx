import { Redirect } from "expo-router";

export default function Index() {
  // Redirect to auth - the AuthRouter in _layout will handle
  // redirecting to (tabs) if already signed in
  return <Redirect href="/auth/login" />;
}
