<script setup lang="ts"></script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <!-- full-width black -->
    <header class="bg-black text-white">
      <!-- Container -->
      <div class="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
        <RouterLink to="/" class="flex items-center gap-2 font-bold">
          <img src="/Logo-Goma.svg" alt="Logo Goma" class="h-12 w-auto" />
        </RouterLink>
      </div>
    </header>

    <main class="max-w-3xl mx-auto px-4 pb-10">
      <RouterView />
    </main>
  </div>
</template>
