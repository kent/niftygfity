import { useSignIn, useSSO } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import * as WebBrowser from "expo-web-browser";

// Warm up browser for faster OAuth
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startSSOFlow } = useSSO();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Warm up browser on mount
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);

  const handleGoogleSignIn = useCallback(async () => {
    setError("");
    setGoogleLoading(true);
    try {
      const { createdSessionId, setActive: setActiveSession } = await startSSOFlow({
        strategy: "oauth_google",
      });

      if (createdSessionId && setActiveSession) {
        await setActiveSession({ session: createdSessionId });
        router.replace("/(app)");
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: Array<{ message: string }> };
      setError(clerkError.errors?.[0]?.message || "Failed to sign in with Google");
    } finally {
      setGoogleLoading(false);
    }
  }, [startSSOFlow, router]);

  const handleSignIn = async () => {
    if (!isLoaded) return;

    setError("");
    setLoading(true);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/(app)");
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: Array<{ message: string }> };
      setError(clerkError.errors?.[0]?.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#0f172a" }}
    >
      <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
        <Text style={{ fontSize: 32, fontWeight: "bold", color: "#fff", textAlign: "center", marginBottom: 8 }}>
          Listy Gifty
        </Text>
        <Text style={{ fontSize: 16, color: "#94a3b8", textAlign: "center", marginBottom: 32 }}>
          Sign in to your account
        </Text>

        {error ? (
          <View style={{ backgroundColor: "#7f1d1d", padding: 12, borderRadius: 8, marginBottom: 16 }}>
            <Text style={{ color: "#fca5a5" }}>{error}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          onPress={handleGoogleSignIn}
          disabled={googleLoading}
          style={{
            backgroundColor: "#fff",
            padding: 16,
            borderRadius: 8,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          {googleLoading ? (
            <ActivityIndicator color="#1f2937" />
          ) : (
            <>
              <Text style={{ fontSize: 18, marginRight: 12 }}>G</Text>
              <Text style={{ color: "#1f2937", fontSize: 16, fontWeight: "600" }}>
                Continue with Google
              </Text>
            </>
          )}
        </TouchableOpacity>

        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: "#334155" }} />
          <Text style={{ color: "#64748b", paddingHorizontal: 16 }}>or</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: "#334155" }} />
        </View>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#64748b"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={{
            backgroundColor: "#1e293b",
            color: "#fff",
            padding: 16,
            borderRadius: 8,
            marginBottom: 12,
            fontSize: 16,
          }}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#64748b"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{
            backgroundColor: "#1e293b",
            color: "#fff",
            padding: 16,
            borderRadius: 8,
            marginBottom: 24,
            fontSize: 16,
          }}
        />

        <TouchableOpacity
          onPress={handleSignIn}
          disabled={loading}
          style={{
            backgroundColor: "#8b5cf6",
            padding: 16,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>Sign In</Text>
          )}
        </TouchableOpacity>

        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 24 }}>
          <Text style={{ color: "#94a3b8" }}>Don't have an account? </Text>
          <Link href="/auth/signup" asChild>
            <TouchableOpacity>
              <Text style={{ color: "#8b5cf6", fontWeight: "600" }}>Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
