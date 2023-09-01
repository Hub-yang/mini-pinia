// core
import App from './App.vue'
// css
import 'virtual:uno.css'
import store from './store'

const app = createApp(App)
app.use(store).mount('#app')
