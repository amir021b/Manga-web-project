import { useState } from 'react';
import { useBackpack } from '../../context/BackpackContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import Collapse from '../ui/Collapse';
import AppearanceSection from './AppearanceSection';
import AccountSection from './AccountSection';
import NotificationsSection from './NotificationsSection';
import {
  Settings, Palette, Shield, Bell, ChevronDown
} from 'lucide-react';
import type { UserData } from '../../context/UserContext';

const SECTIONS = [
  { id: 'appearance', label: 'Appearance', icon: Palette, hint: 'Theme accent color and UI density' },
  { id: 'account', label: 'Account & Security', icon: Shield, hint: 'Password, email, and danger zone' },
  { id: 'notifications', label: 'Notifications', icon: Bell, hint: 'Alerts, newsletters, and announcements' },
];

const SECTION_ICONS: Record<string, React.ComponentType<any>> = {
  appearance: Palette,
  account: Shield,
  notifications: Bell,
};

export default function SettingsTab() {
  const { backpack, setBackpack } = useBackpack();
  const { addToast } = useToast();
  const { accent, setAccent, density, setDensity, ACCENT_OPTIONS, DENSITY_OPTIONS } = useTheme();
  const { user, setCurrentUser } = useUser();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ appearance: true });

  const toggleSection = (id: string) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  const isOpen = (id: string) => !!openSections[id];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5 text-[var(--mh-accent)]" />
        <h2 className="text-xl font-bold text-[var(--mh-text)]">Settings</h2>
      </div>
      <p className="text-sm text-[var(--mh-text-secondary)]">Customize your MangaHub experience.</p>

      {SECTIONS.map((section) => {
        const Icon = SECTION_ICONS[section.id];
        const open = isOpen(section.id);
        return (
          <article
            key={section.id}
            className="overflow-hidden rounded-2xl border border-[var(--mh-border)] bg-[var(--mh-surface)] backdrop-blur-md"
          >
            <button
              type="button"
              onClick={() => toggleSection(section.id)}
              className="flex w-full items-center justify-between px-6 py-4 text-left transition"
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-9 w-9 rounded-xl flex items-center justify-center bg-[var(--mh-surface)] text-[var(--mh-text-secondary)]"
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--mh-text)]">{section.label}</h3>
                  <p className="text-xs text-[var(--mh-text-secondary)]">{section.hint}</p>
                </div>
              </div>
              <ChevronDown
                className={[
                  'h-4 w-4 text-[var(--mh-text-secondary)] transition-transform duration-200',
                  open ? 'rotate-180' : '',
                ].join(' ')}
              />
            </button>
            <Collapse open={open}>
              <div className="px-6 pb-6 space-y-5">
                {section.id === 'appearance' && (
                  <AppearanceSection
                    accent={accent}
                    setAccent={setAccent}
                    density={density}
                    setDensity={setDensity}
                    ACCENT_OPTIONS={ACCENT_OPTIONS}
                    DENSITY_OPTIONS={DENSITY_OPTIONS}
                  />
                )}
                {section.id === 'account' && (
                  <AccountSection
                    user={user}
                    setCurrentUser={setCurrentUser}
                    addToast={(title, message) => addToast(title, message)}
                    setBackpack={(b) => setBackpack(b as any)}
                    router={{ push: () => {}, replace: () => {} }}
                  />
                )}
                {section.id === 'notifications' && (
                  <NotificationsSection />
                )}
              </div>
            </Collapse>
          </article>
        );
      })}
    </div>
  );
}
