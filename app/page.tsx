"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { redirect } from "next/navigation";
import { setToken } from "@/storage/tokenStorage";

export default function Home() {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // ✅ Step 1: On mount — read token from URL or localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);

      // Clean the URL (remove ?token=...)
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);

      setAccessToken(tokenFromUrl); // ✅ update state
    } else {
      // If no token in URL, check localStorage
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setAccessToken(storedToken); // ✅ update state
      } else {
        console.warn("⚠️ No token found in URL or localStorage");
      }
    }
  }, []);

  // ✅ Step 2: Fetch session when accessToken is set
  useEffect(() => {
    if (!accessToken) return;

    const fetchSession = async () => {
      try {
        const response = await axios.get("/api/users/session", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        // console.log("✅ Session data:", response.data);
        // localStorage.setItem("user", response.data);
        setToken(response.data.accessToken); // Store token in your storage
        redirect("/stores");
      } catch (error) {
        console.error("❌ Session fetch failed:", error);
        redirect("/stores"); // Optional: show error UI before redirect
      }
    };

    fetchSession();
  }, [accessToken]);

  return null; // or a loader/spinner
}
