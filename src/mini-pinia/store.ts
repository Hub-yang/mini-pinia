import { hasInjectionContext } from 'vue'
import { piniaSymbol } from './createPinia'
export function _defineStore(id: string, options: any) {
  // 初始化getters
  function useStore() {
    const hasContext = hasInjectionContext()
    // 注入pinia实例
    const pinia: any = hasContext && inject(piniaSymbol)
    // 单例创建store
    if (!pinia._s.has(id)) {
      createOptionsStore(id, options, pinia)
    }
    // 从map中获去当前store
    const store = pinia._s.get(id)!
    return store
  }

  return useStore
}

function createOptionsStore(id: string, options: any, pinia: any) {
  const { state: stateFn, getters, actions } = options
  const { keys } = Object
  // 初始化state
  const state = reactive(stateFn())
  pinia._s.set(
    id,
    reactive({
      // 处理state
      ...toRefs(state),
      // 处理getters
      ...keys(getters).reduce((computedGetters: any, key) => {
        computedGetters[key] = computed(() => {
          return getters[key].call(state, state)
        })

        return computedGetters
      }, {}),
      // 处理actions
      ...keys(actions).reduce((wrapperActions: any, key) => {
        wrapperActions[key] = () => actions[key].call(state)
        return wrapperActions
      }, {}),
      // 实现$patch
      $patch(partialStateOrMutator: any) {
        // 如是对象，修改当前state中的同名属性值
        if (typeof partialStateOrMutator === 'object') {
          for (const key in partialStateOrMutator) {
            if (Object.prototype.hasOwnProperty.call(partialStateOrMutator, key)) {
              state[key] = partialStateOrMutator[key]
            }
          }
        } else {
          // 如果是函数，将state传入作为上下文并执行
          partialStateOrMutator(state)
        }
      }
    })
  )
}
