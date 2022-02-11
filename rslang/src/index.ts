import './assets/styles/default.scss'
import './components/pages/main-page/main-page.scss'
import { Router } from './components/router/router'

const router = new Router
router.setListener()

// временная затычка для отрисовки залогиненного юзера
window.addEventListener('load', () => {
  if (localStorage.getItem('UserInfo')) {
    (document.querySelector('[data-navigation="login"]') as HTMLElement).dataset.navigation = 'logout'
  }
})