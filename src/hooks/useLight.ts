"use client";

import { db } from "@/utils/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export const useLightValue = (home_id: string) => {
  const [light, setLight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!home_id) return;

    const docRef = doc(db, "Home", home_id);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setLight(data.light ?? null);
        } else {
          console.warn("No such document!");
          setLight(null);
        }
        setIsLoading(false);
      },
      (err) => {
        console.error("Error fetching light value:", err);
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [home_id]);

  return { light, isLoading, error };
};
