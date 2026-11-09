import { createContext, useContext, useState, useEffect } from "react";
import { fetchBackpack, toggleBackpackItem } from "../services/backpackApi";
import { bigThree, bestSellers, latestUpdates } from "../data";

const BackpackContext = createContext();

const allManga = [...bigThree, ...bestSellers, ...latestUpdates];

export function BackpackProvider({ children }) {
  const [backpack, setBackpack] = useState([]);

  // ۱. واکشی اولیه کوله‌پشتی از دیتابیس بک‌اند
  useEffect(() => {
    let mounted = true;

    async function loadBackpack() {
      const token = localStorage.getItem("mangahub_token");
      if (!token) return;

      try {
        const ids = await fetchBackpack();
        if (mounted && Array.isArray(ids)) {
          // تطبیق آی‌دی‌های دیتابیس با دیتای کامل مانگاها برای نمایش در فرانت
          const matchedManga = ids
            .map((id) => allManga.find((m) => String(m.id) === String(id)))
            .filter(Boolean);

          setBackpack(matchedManga);
        }
      } catch (err) {
        console.error("Failed to load backpack from API:", err);
      }
    }

    loadBackpack();
    return () => {
      mounted = false;
    };
  }, []);

  // ۲. افزودن به کوله‌پشتی و همگام‌سازی با بک‌اند
  const addToBackpack = async (manga) => {
    const mangaId = typeof manga === "object" ? manga.id : manga;
    const mangaObj =
      typeof manga === "object"
        ? manga
        : allManga.find((m) => String(m.id) === String(mangaId)) || {
            id: Number(mangaId),
          };

    // آپدیت سریع فرانت‌اند
    setBackpack((prev) => {
      if (prev.some((item) => String(item.id) === String(mangaId))) return prev;
      return [...prev, mangaObj];
    });

    // ارسال درخواست POST به سرور
    try {
      await toggleBackpackItem(mangaId);
    } catch (err) {
      console.error("Failed to sync addToBackpack with backend:", err);
    }
  };

  // ۳. حذف از کوله‌پشتی و همگام‌سازی با بک‌اند
  const removeFromBackpack = async (itemOrId) => {
    const mangaId = typeof itemOrId === "object" ? itemOrId.id : itemOrId;

    // آپدیت سریع فرانت‌اند
    setBackpack((prev) =>
      prev.filter((item) => String(item.id) !== String(mangaId)),
    );

    // ارسال درخواست POST به سرور جهت حذف
    try {
      await toggleBackpackItem(mangaId);
    } catch (err) {
      console.error("Failed to sync removeFromBackpack with backend:", err);
    }
  };

  const isInBackpack = (id) => {
    return backpack.some((item) => String(item.id) === String(id));
  };

  return (
    <BackpackContext.Provider
      value={{
        backpack,
        addToBackpack,
        removeFromBackpack,
        isInBackpack,
      }}
    >
      {children}
    </BackpackContext.Provider>
  );
}

export function useBackpack() {
  const context = useContext(BackpackContext);
  if (!context) {
    throw new Error("useBackpack must be used within a BackpackProvider");
  }
  return context;
}
