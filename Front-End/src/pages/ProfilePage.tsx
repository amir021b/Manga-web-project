"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import MangaCard from "@/components/manga/MangaCard";
import MangaGrid from "@/components/manga/MangaGrid";
import SettingsTab from "@/components/settings/SettingsTab";
import EditProfileModal from "@/components/profile/EditProfileModal";
import { useBackpack } from "@/context/BackpackContext";
import { useUser } from "@/context/UserContext";
import { fetchProfile } from "@/services/userApi";
import {
  User,
  Pencil,
  Bookmark,
  History,
  Settings as SettingsIcon,
  LogOut,
} from "lucide-react";
import type { UserData } from "@/context/UserContext";
import type { MangaItem } from "@/data/bigThree";

const TABS = [
  { id: "backpack", label: "Backpack", icon: Bookmark },
  { id: "history", label: "History", icon: History },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

function ProfilePage() {
  const router = useRouter();
  const { backpack } = useBackpack();
  const { user, setCurrentUser, logout, isLoggedIn } = useUser();
  const [activeTab, setActiveTab] = useState("backpack");
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      if (!isLoggedIn) return;
      try {
        const data = await fetchProfile();

        if (mounted && data) setCurrentUser(data);
      } catch {
        // Keep existing session
      }
    };
    loadProfile();
    return () => {
      mounted = false;
    };
  }, [isLoggedIn, setCurrentUser]);

  const handleSave = async (next: { username: string; bio: string; avatar: string | null }) => {
    setCurrentUser(next as UserData);
    localStorage.setItem("mangahub_user", JSON.stringify(next));

    const token = localStorage.getItem("mangahub_token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: next.username,
          bio: next.bio,
          avatar: next.avatar,
        }),
      });

      const result = await res.json();
      if (res.ok && result.data?.user) {
        setCurrentUser(result.data.user);
        localStorage.setItem("mangahub_user", JSON.stringify(result.data.user));
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };
  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const username = user?.username || "Manga Fan";
  const email = user?.email || "user@mangahub.com";
  const bio = user?.bio || "Avid manga reader and collector.";

  const openEdit = () => setIsEditOpen(true);
  const closeEdit = () => setIsEditOpen(false);

  return (
    <div className="w-full max-w-4xl mx-auto pt-28 pb-16 px-4">
      <section className="relative overflow-hidden rounded-2xl border border-[var(--mh-border)] bg-[var(--mh-gradient-bg)] p-6 backdrop-blur-md shadow-[var(--mh-shadow-strong)] sm:p-8">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6">
          <div className="relative shrink-0">
            <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full border-2 border-[var(--mh-border)] bg-[var(--mh-surface)] text-[var(--mh-text)] shadow-[0_0_24px_rgba(0,0,0,0.25)]">
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt="avatar"
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                  fill
                  sizes="96px"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <User strokeWidth={1.25} className="h-12 w-12" />
              )}
            </div>
            <span className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-[var(--mh-border)]" />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-[var(--mh-text)]">
              {username}
            </h1>
            <p className="mt-1 text-sm text-[var(--mh-text-secondary)]">
              {email}
            </p>
            <p className="mt-2 text-xs text-[var(--mh-text-muted)]">{bio}</p>
          </div>

          <button
            type="button"
            onClick={openEdit}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--mh-border)] bg-[var(--mh-surface)] px-4 py-2 text-sm text-[var(--mh-text)] transition hover:bg-[var(--mh-surface-strong)] hover:text-[var(--mh-text)]"
          >
            <Pencil className="h-4 w-4" />
            Edit Profile
          </button>
        </div>
      </section>

      <nav className="mt-8 flex items-center gap-6 border-b border-[var(--mh-border)] pb-2 text-sm text-[var(--mh-text-secondary)]">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 pb-2 transition ${isActive ? "text-[var(--mh-text)]" : ""}`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              {isActive && (
                <span className="absolute left-1/2 -bottom-1 h-0.5 w-4 -translate-x-1/2 rounded-full bg-[var(--mh-text)]" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-8">
        {activeTab === "backpack" && (
          <div key="backpack" className="tab-content-in">
            <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 rounded-2xl border border-[var(--mh-border)] bg-[var(--mh-surface)] text-center backdrop-blur-md">
              {backpack.length === 0 ? (
                <>
                  <Bookmark className="h-8 w-8 text-[var(--mh-text-secondary)]" />
                  <p className="mt-2 text-sm text-[var(--mh-text-secondary)]">
                    Your Backpack is empty.
                  </p>
                </>
              ) : (
                <MangaGrid className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {backpack.filter((item): item is MangaItem => item !== undefined).map((item: MangaItem) => (
                    <MangaCard
                      key={item.id}
                      id={item.id}
                      title={item.title}
                      genre={item.genre}
                      posterUrl={item.posterUrl}
                      hoverLift={false}
                    />
                  ))}
                </MangaGrid>
              )}
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div key="history" className="tab-content-in">
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[var(--mh-border)] bg-[var(--mh-surface)] py-16 text-center backdrop-blur-md">
              <History className="h-8 w-8 text-[var(--mh-text-secondary)]" />
              <p className="text-sm text-[var(--mh-text-secondary)]">
                No reading history yet.
              </p>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div key="settings" className="tab-content-in">
            <SettingsTab />
          </div>
        )}
      </div>

      <div className="mt-12 flex justify-center">
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-full border border-red-500/20 px-6 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </div>

      {isEditOpen && (
        <EditProfileModal user={user ?? undefined} onSave={handleSave} onClose={closeEdit} />
      )}
    </div>
  );
}

export default ProfilePage;
