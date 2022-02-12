import './assets/styles/default.scss'
import './components/pages/main-page/main-page.scss'
import { Router } from './components/router/router'


const router = new Router();
router.setListener();

function getLastPage() {
  const page = localStorage.getItem('lastPage');
  if (page) {
    router.renderPage(page);
  } else {
    router.renderPage();
  }
}

getLastPage();
