<script setup lang="ts">
import ErrorComponent from "./components/ErrorComponent.vue";
</script>

<template>
  <!-- <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
    <LoginPage />
  </nav> -->
  <ErrorComponent />
  <router-view />
</template>

<style></style>
