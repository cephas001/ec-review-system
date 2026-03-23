// frontend/stores/auth.js
import { defineStore } from "pinia";
import { useCookie } from "#app"; // Nuxt auto-imports this, but good practice to be explicit

export const useAuthStore = defineStore("auth", {
  state: () => ({
    // Initialize directly from cookies. This works flawlessly on both Server and Client!
    user: useCookie("ec_user").value || null,
    token: useCookie("ec_token").value || null,
  }),

  actions: {
    setAuth(userData, token) {
      this.user = userData;
      this.token = token;

      // Create cookie refs with an 8-hour expiration (matching your backend JWT)
      const tokenCookie = useCookie("ec_token", { maxAge: 60 * 60 * 8 });
      const userCookie = useCookie("ec_user", { maxAge: 60 * 60 * 8 });

      console.log(userData);

      tokenCookie.value = token;
      userCookie.value = userData;
    },

    logout() {
      this.user = null;
      this.token = null;

      // Clear the cookies by setting them to null
      const tokenCookie = useCookie("ec_token");
      const userCookie = useCookie("ec_user");

      tokenCookie.value = null;
      userCookie.value = null;

      navigateTo("/login");
    },
  },
});
