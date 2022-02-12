<<<<<<< HEAD
import './assets/styles/default.scss'
import './components/pages/main-page/main-page.scss'
import { Router } from './components/router/router'
=======
import './assets/styles/default.scss';
import { Router } from './components/router/router';
>>>>>>> ca68227ca77ec9b12d6850fe174baf71cd321c70

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
