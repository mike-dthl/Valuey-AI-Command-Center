import { create } from "zustand";

interface UIState {
  sidebarCollapsed: boolean;
  commandPanelOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleCommandPanel: () => void;
  setCommandPanelOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  commandPanelOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleCommandPanel: () => set((state) => ({ commandPanelOpen: !state.commandPanelOpen })),
  setCommandPanelOpen: (open) => set({ commandPanelOpen: open }),
}));
