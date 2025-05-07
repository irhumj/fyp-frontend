"use client";

import useFcmToken from "@/hooks/useFCMToken";
import app from "@/utils/firebase";
import { getMessaging, onMessage } from "firebase/messaging";
import { useEffect, useState } from "react";
import { Lightbulb, Mic, Power, Home, Bell, LoaderCircle } from "lucide-react";
import { useLightValue } from "@/hooks/useLight";

export default function HomePage() {
  const { light, isLoading: isLightLoading } = useLightValue(
    "qrDuYVztOZYIB4WIbper"
  );
  console.log(light);
  const { token, notificationPermissionStatus } = useFcmToken();
  console.log(token);
  console.log(notificationPermissionStatus);
  const [showSettingsPrompt, setShowSettingsPrompt] = useState(false);

  useEffect(() => {
    if (notificationPermissionStatus === "denied") {
      setShowSettingsPrompt(true);
    } else {
      setShowSettingsPrompt(false);
    }

    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      if (notificationPermissionStatus === "granted") {
        const messaging = getMessaging(app);
        const unsubscribe = onMessage(messaging, (payload) =>
          console.log("Foreground push notification received:", payload)
        );
        return () => {
          unsubscribe();
        };
      }
    }
  }, [notificationPermissionStatus]);

  const handleNotificationClick = async () => {
    const permission = await Notification.requestPermission();
    // Handle notification permission status after the user responds
    console.log(`Notification permission status: ${permission}`);
  };

  const [isToggling, setIsToggling] = useState(false);
  const [toggleError, setToggleError] = useState<string | null>(null);

  const handleToggleLight = async () => {
    setIsToggling(true);
    setToggleError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/toggle-light`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ home_id: "qrDuYVztOZYIB4WIbper" }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to toggle light");
      }

      console.log("Toggled Light:", result);
    } catch (error) {
      if (error instanceof Error) {
        setToggleError(error.message);
        console.error("Error toggling light:", error);
      } else {
        setToggleError("An unknown error occurred");
        console.error("Unexpected error:", error);
      }
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="text-center space-y-6 max-w-md w-full">
        <div className="flex items-center justify-center space-x-2 text-3xl font-bold text-gray-800">
          <Home className="w-8 h-8 text-blue-500" />
          <h1>Smart Home Controller</h1>
        </div>

        {/* Light status */}
        <div className="bg-white shadow-md rounded-xl p-4 flex items-center justify-center space-x-2 text-lg text-gray-700">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          <span>Light Status:</span>
          {isLightLoading ? (
            <span className="text-transparent bg-gray-200 animate-pulse rounded-full">
              OFF
            </span>
          ) : (
            <span>{light ? "ON" : "OFF"}</span>
          )}
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg shadow hover:bg-blue-700 transition">
            <Mic className="w-5 h-5" />
            Voice Command
          </button>

          <button
            onClick={handleToggleLight}
            disabled={isToggling || isLightLoading}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg shadow transition ${
              isToggling || isLightLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {isToggling ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <>
                <Power className="w-5 h-5" />
                Turn {light ? "OFF" : "ON"} Light
              </>
            )}
          </button>

          {toggleError && (
            <div className="mt-2 text-red-600 text-sm font-medium">
              {toggleError}
            </div>
          )}

          {/* Notification Button */}
          {notificationPermissionStatus !== "denied" && (
            <button
              onClick={handleNotificationClick}
              disabled={
                notificationPermissionStatus === "granted" ||
                notificationPermissionStatus === "denied"
              }
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg shadow transition ${
                notificationPermissionStatus === "granted"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-yellow-600 hover:bg-yellow-700 text-white"
              }`}
            >
              <Bell className="w-5 h-5" />
              {notificationPermissionStatus === "granted"
                ? "Notifications Enabled"
                : "Enable Notifications"}
            </button>
          )}
        </div>

        {/* Settings Prompt for Denied Notifications */}
        {showSettingsPrompt && (
          <div className="mt-6 bg-red-100 text-red-800 p-4 rounded-lg">
            <p className="text-lg">
              To enable notifications, go to your device settings and allow
              notifications for this app.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
