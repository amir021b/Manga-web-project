"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import MangaCard from "@/components/manga/MangaCard";
import MangaGrid from "@/components/manga/MangaGrid";
import SettingsTab from "@/components/settings/SettingsTab";
import EditProfileModal from "@/components/profile/EditProfileModal";
import { useBackpack } from "@/context/BackpackContext";
import { useToast } from "@/context/ToastContext";
import { useUser } from "@/context/UserContext";
import { useUpdateProfile } from "@/hooks/api/useUser";
import { useReadingHistory } from "@/hooks/useReadingHistory";
import {
  User,
  Pencil,
  Bookmark,
  History,
  Settings as SettingsIcon,
  LogOut,
} from "lucide-react";
import type { UserData } from "@/types/api";
import { getChapter, getMangaById, type MangaItem } from "@/services/data";
import { withBasePath } from "@/lib/basePath";

const TABS = [
  { id: "backpack", label: "Backpack", icon: Bookmark },
  { id: "history", label: "History", icon: History },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

function ProfilePage() {
  const router = useRouter();
  const { backpack } = useBackpack();
  const { addToast } = useToast();
  const { user, setCurrentUser, logout, isLoggedIn, isLoadingAuth } =
    useUser();
  const { mutateAsync: updateProfile } = useUpdateProfile();
  const readingHistory = useReadingHistory();
  const [activeTab, setActiveTab] = useState("backpack");
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    if (!isLoadingAuth && !isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoadingAuth, isLoggedIn, router]);

  const handleSave = async (next: { username: string; bio: string; avatar: string | null }) => {
    const previousUser = user;
    const optimisticUser: UserData = { ...user, ...next };
    setCurrentUser(optimisticUser);

    if (!isLoggedIn) return;

    try {
      const savedUser = await updateProfile(next);
      if (savedUser) setCurrentUser(savedUser);
      addToast("Profile updated", "Your changes have been saved.");
    } catch (err) {
      setCurrentUser(previousUser);
      const message =
        err instanceof Error ? err.message : "Could not save your profile.";
      addToast("Profile update failed", message);
      throw err;
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
                  src={withBasePath(user.avatar)}
                  alt="avatar"
                  width={96}
                  height={96}
                  unoptimized
                  className="h-full w-full object-cover"
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
            <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 rounded-2xl border border-[var(--mh-border)] bg-[var(--mh-surface)] pb-6 text-center">
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
                      genres={item.genres}
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
            {readingHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[var(--mh-border)] bg-[var(--mh-surface)] py-16 text-center backdrop-blur-md">
                <History className="h-8 w-8 text-[var(--mh-text-secondary)]" />
                <p className="text-sm text-[var(--mh-text-secondary)]">
                  No reading history yet.
                </p>
              </div>
            ) : (
              <div className="space-y-1 rounded-xl border border-[var(--mh-border)] bg-[var(--mh-surface)] overflow-hidden shadow-sm">
                {readingHistory.map((entry) => {
                  const manga = getMangaById(entry.mangaId);
                  const chapter = getChapter(entry.mangaId, entry.chapterId);
                  return (
                    <Link
                      key={entry.mangaId}
                      href={`/manga/${entry.mangaId}/chapter/${entry.chapterId}`}
                      className="flex items-center justify-between gap-4 px-5 py-4 text-sm border-b border-[var(--mh-border)] last:border-0 transition hover:bg-[var(--mh-surface-strong)] group"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-[var(--mh-text)] group-hover:text-[var(--mh-accent)] transition truncate">
                          {manga?.title ?? `Manga #${entry.mangaId}`}
                        </p>
                        <p className="mt-0.5 text-xs text-[var(--mh-text-secondary)] truncate">
                          {chapter
                            ? `Chapter ${chapter.number}${
                                chapter.title ? ` · ${chapter.title}` : ""
                              }`
                            : `Chapter #${entry.chapterId}`}
                        </p>
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--mh-text-muted)]">
                          {entry.volumeId}
                        </span>
                        {typeof entry.progress === "number" &&
                          entry.progress > 0 && (
                            <div className="flex items-center gap-1.5">
                              <span className="h-1 w-14 overflow-hidden rounded-full bg-[var(--mh-surface-strong)]">
                                <span
                                  className="block h-full rounded-full bg-[var(--mh-accent)]"
                                  style={{
                                    width: `${Math.round(entry.progress * 100)}%`,
                                  }}
                                />
                              </span>
                              <span className="text-[10px] text-[var(--mh-text-muted)]">
                                {Math.round(entry.progress * 100)}%
                              </span>
                            </div>
                          )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
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
