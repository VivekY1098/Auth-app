<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        class="mx-auto h-10 w-auto"
        src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
        alt="Your Company"
      />
      <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign Up</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="onSignUp">
        <div>
          <label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
          <div class="mt-2">
            <input
              type="email"
              name="email"
              id="email"
              autocomplete="email"
              v-model="form.email"
              @blur="validateField('email')"
              placeholder="Enter the email address"
              :class="{
                'border-red-500': errors.email && errors.email.required,
              }"
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
            <span
              v-if="errors.email && errors.email.required"
              class="text-red-500 text-xs mt-1 block"
            >
              Email is required.
            </span>

            <span
              v-if="errors.email && errors.email.format"
              class="text-red-500 text-xs mt-1 block"
            >
              Email must be valid.
            </span>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
          </div>
          <div class="mt-2">
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                name="password"
                id="password"
                v-model="form.password"
                @blur="validateField('password')"
                placeholder="••••••••"
                :class="{
                  'border-red-500': errors.password && errors.password.required,
                }"
                autocomplete="current-password"
                required
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                tabindex="-1"
                aria-label="Toggle password visibility"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  :class="{ hidden: showPassword }"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <!-- Eye Open Icon -->
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fill-rule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  :class="{ hidden: !showPassword }"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <!-- Eye Closed Icon -->
                  <path
                    fill-rule="evenodd"
                    d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                    clip-rule="evenodd"
                  />
                  <path
                    d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"
                  />
                </svg>
              </button>
            </div>
            <span
              v-if="errors.password && errors.password.required"
              class="text-red-500 text-xs mt-1 block"
            >
              Password is required.
            </span>
            <span
              v-if="errors.password && errors.password.minLength"
              class="text-red-500 text-xs mt-1 block"
            >
              Password must be at least 6 characters.
            </span>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm/6 font-medium text-gray-900">
              Verify Password
            </label>
          </div>
          <div class="mt-2">
            <div class="relative">
              <input
                :type="showVerifyPassword ? 'text' : 'password'"
                placeholder="••••••••"
                :class="{
                  'border-red-500': form.verifyPass && form.password !== form.verifyPass,
                }"
                name="password"
                id="password"
                v-model="form.verifyPass"
                autocomplete="current-password"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
              <button
                type="button"
                @click="showVerifyPassword = !showVerifyPassword"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                tabindex="-1"
                aria-label="Toggle password visibility"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  :class="{ hidden: showVerifyPassword }"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <!-- Eye Open Icon -->
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fill-rule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  :class="{ hidden: !showVerifyPassword }"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <!-- Eye Closed Icon -->
                  <path
                    fill-rule="evenodd"
                    d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                    clip-rule="evenodd"
                  />
                  <path
                    d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"
                  />
                </svg>
              </button>
            </div>
            <span
              v-if="form.verifyPass && form.password !== form.verifyPass"
              class="text-red-500 text-xs mt-1 block"
            >
              Password is not matching.
            </span>
          </div>
        </div>

        <div>
          <button
            :disabled="!isFormValid"
            type="submit"
            :class="[
              'flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
              isFormValid
                ? 'bg-indigo-600 hover:bg-indigo-500'
                : 'bg-indigo-300 cursor-not-allowed',
            ]"
          >
            Sign up
          </button>
        </div>
      </form>
      <p class="mt-10 text-center text-sm/6 text-gray-500">
        Already have account
        <a href="/" class="font-semibold text-indigo-600 hover:text-indigo-500">Sign In</a>
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import api from "@/service/api";
import { useErrorState } from "@/store/errorStore";
import { computed, reactive, ref } from "vue";

const form = ref({
  email: "",
  password: "",
  verifyPass: "",
});
const errors = reactive({
  email: null as { required?: boolean; format?: boolean } | null,
  password: null as { required?: boolean; minLength?: boolean } | null,
});
const showPassword = ref(false);
const showVerifyPassword = ref(false);

const isFormValid = computed(() => {
  return (
    form.value.email &&
    form.value.password &&
    emailRegex.test(form.value.email) &&
    form.value.password.length >= 6 &&
    form.value.password === form.value.verifyPass
  );
});
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validateField = (fieldName: "email" | "password") => {
  if (fieldName === "email") {
    errors.email = {
      required: !form.value.email,
      format: form.value.email ? !emailRegex.test(form.value.email) : false,
    };
  } else if (fieldName === "password") {
    errors.password = {
      required: !form.value.password,
      minLength: form.value.password ? form.value.password.length < 6 : false,
    };
  }
};
const errorState = useErrorState();

async function onSignUp() {
  if (!isFormValid.value) {
    errorState.setError("Please fill in all fields correctly.");
    return;
  }

  try {
    // const resp = await api.post("/auth/signup", {
    //   email: form.value.email,
    //   password: form.value.password,
    // });

    await api.post("/users", {
      email: form.value.email,
      password: form.value.password,
    });
  } catch (error) {
    const errorMsg = error?.response?.data?.detail || "some error occurred";
    errorState.setError(errorMsg);
  }
}
</script>
