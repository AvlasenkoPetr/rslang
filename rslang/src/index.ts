import './assets/styles/default.scss'
<<<<<<< HEAD
import './components/pages/main-page/main-page.scss'
import { Router } from './components/router/router'
=======
import { Router } from './components/Router/router'
>>>>>>> bce9854e33138f849343ea3c5fc697f742b602e1

const router = new Router
router.setListener()

function getLastPage(){
  const page = localStorage.getItem('lastPage')
  if(page){
    router.renderPage(page)
  }else{
    router.renderPage()
  }
}

getLastPage()