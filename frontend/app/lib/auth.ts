// frontend/app/lib/auth.ts
const STORAGE_KEY = "ai-habit-logged-in";

export const auth = {
  isSignedIn: false,

  load() {
    if (typeof window === "undefined") return;
    this.isSignedIn = localStorage.getItem(STORAGE_KEY) === "true";
  },

  login() {
    this.isSignedIn = true;
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, "true");
  },

  logout() {
    this.isSignedIn = false;
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
  },
};
