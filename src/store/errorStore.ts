import { defineStore } from "pinia";

export const useErrorState = defineStore("errorStore", {
  state: () => ({
    errorMsg: null as string | string,
    showError: false,
  }),
  actions: {
    setError(message: string) {
      this.errorMsg = message;
      this.showError = true;
    },
    clearErrorMsg() {
      this.errorMsg = null;
      this.showError = false;
    },
  },
});
