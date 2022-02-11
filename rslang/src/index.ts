import './assets/styles/default.scss'
import { Router } from './components/Router/router'

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