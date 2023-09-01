export const piniaSymbol = Symbol('pinia')

export function createPinia() {
  const pinia: any = markRaw({
    install(app: any) {
      pinia._a = app
      app.provide(piniaSymbol, pinia)
      app.config.globalProperties.$pinia = pinia
    },

    _s: new Map()
  })

  return pinia
}
