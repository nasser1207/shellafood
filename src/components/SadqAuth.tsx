"use client";

/**
 * Sadq Authentication Component
 * Example usage of Sadq authentication
 */

import { useState, useEffect } from "react";
import { authenticateSadqAction, checkSadqAuthAction, logoutSadqAction } from "@/app/actions/sadqActions";
import { SadqTokenData } from "@/lib/types/sadq.types";

export default function SadqAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<SadqTokenData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const result = await checkSadqAuthAction();
      setIsAuthenticated(result.isAuthenticated);
      if (result.expiresAt) {
        setToken({
          access_token: "***",
          expires_in: 0,
          token_type: "Bearer",
          scope: "",
          useraccessKey: "***",
          expires_at: result.expiresAt,
        });
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    }
  };

  const handleAuthenticate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authenticateSadqAction();
      
      if (result.success && result.data) {
        setIsAuthenticated(true);
        setToken(result.data);
        console.log("✅ Authentication successful:", result.data);
      } else {
        setError(result.error || "Authentication failed");
        console.error("❌ Authentication failed:", result.error);
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error("❌ Authentication error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await logoutSadqAction();
      
      if (result.success) {
        setIsAuthenticated(false);
        setToken(null);
        console.log("✅ Logout successful");
      } else {
        setError(result.message);
        console.error("❌ Logout failed:", result.message);
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error("❌ Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Sadq Nafath Authentication
      </h2>

      {/* Status */}
      <div className="mb-6 p-4 rounded-lg bg-gray-50">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <span className={`px-2 py-1 rounded text-xs ${
            isAuthenticated 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </span>
        </div>
        
        {token && (
          <div className="mt-2 text-xs text-gray-600">
            <p>Expires: {token.expires_at.toLocaleString()}</p>
            <p>Token Type: {token.token_type}</p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        {!isAuthenticated ? (
          <button
            onClick={handleAuthenticate}
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Authenticating...' : 'Authenticate with Sadq'}
          </button>
        ) : (
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging out...' : 'Logout'}
          </button>
        )}

        <button
          onClick={checkAuthStatus}
          disabled={isLoading}
          className="w-full py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Check Status
        </button>
      </div>
    </div>
  );
}
