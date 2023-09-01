import { _defineStore } from '../mini-pinia'

export const useCountStore = _defineStore('countStore', {
  state: () => ({
    count: 0
  }),
  getters: {
    dbCounter(state: any) {
      return state.count * 2
    }
  },
  actions: {
    increment() {
      this.count++
    }
  }
})
