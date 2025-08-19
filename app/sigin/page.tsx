"use client";
import { createClient } from "@/lib/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
    const [isSignedUp, setIsSignedUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const supabase = createClient();
    const router = useRouter();

    async function handleAuth(event: React.FormEvent) {
        event.preventDefault();
        try {
            if (isSignedUp) {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) {
                    throw error;
                }
                setMessage(
                    "Sign up successful! Please check your email for confirmation."
                );
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) {
                    throw error;
                }
                router.push("/dashboard");
                setMessage("Sign in successful! Welcome back.");
            }
        } catch (error) {
            console.error("Error signing in:", error);
        }
    }

    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        Personalized AI Newsletter
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        {isSignedUp ? "Create" : "Sign In"} to your account.
                    </p>
                </div>

                <div className="bg-white py-8 px-6 shadow rounded-lg">
                    <form
                        action="/api/auth/signin"
                        method="post"
                        className="space-y-6"
                        onSubmit={handleAuth}
                    >
                        {message && (
                            <div className="bg-green-50 border border-green-200 p-4 rounded">
                                <p className="text-sm text-gray-600">Message: {message}</p>
                            </div>
                        )}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-indigo-300 text-indigo-900 bg-indigo-50 font-mono border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 sm:text-sm transition-colors"
                                    placeholder="you@company.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-indigo-300 text-indigo-900 bg-indigo-50 font-mono border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 sm:text-sm transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <button
                                    type="button"
                                    onClick={() => setIsSignedUp((p) => !p)}
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    {isSignedUp
                                        ? "Already have an account? Sign In"
                                        : "Don't have an account? Sign Up"}
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {isSignedUp ? "Create account" : "Sign in"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
