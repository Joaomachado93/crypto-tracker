<script setup lang="ts"></script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <header class="bg-black text-white">
      <div class="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
        <RouterLink to="/" class="flex items-center gap-2 font-bold">
          <img src="/Logo-Goma.svg" alt="Logo Goma" class="h-10 w-auto" />
          <span>Crypto Tracker</span>
        </RouterLink>
      </div>
    </header>

    <main class="max-w-3xl mx-auto px-4 pb-10">
      <RouterView />
    </main>
  </div>
</template>
