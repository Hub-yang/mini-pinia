<script setup lang="ts">
import { useCountStore } from './store/counterStore'

const countStore = useCountStore()
const increment = () => {
  countStore.increment()
}
</script>

<template>
  <div>
    <h3>{{ countStore.count }}</h3>
    <h3>{{ countStore.dbCounter }}</h3>

    <button @click="increment">actions修改</button>
    <button @click="countStore.$patch({ count: (countStore.count += 1) })">$patch修改</button>
    <button @click="countStore.count++">直接修改</button>
  </div>
</template>
