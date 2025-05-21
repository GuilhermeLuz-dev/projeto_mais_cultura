import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "login.html"),
        form: resolve(__dirname, "form.html"),
        formEdit: resolve(__dirname, "formEditEvent.html"),
        register: resolve(__dirname, "register.html"),
        event: resolve(__dirname, "event.html"),
        category: resolve(__dirname, "category.html"),
        perfil: resolve(__dirname, "perfil.html"),
        policy: resolve(__dirname, "policy.html"),
        terms: resolve(__dirname, "terms.html"),
      },
    },
  },
});
