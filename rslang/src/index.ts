import './assets/styles/default.scss'
import { BookPage } from './components/pages/book-page/book-page';
import './components/pages/main-page/main-page.scss'
import { Router } from './components/router/router'


const router = new Router();
router.setListener();

function getLastPage() {
  const page = localStorage.getItem('lastPage');
  if (page) {
    if (page === 'book') {
      router.renderPage(page);

      const lastBookLevel = localStorage.getItem('lastBookLevel') || '0'
      const lastBookPage = localStorage.getItem('lastBookPage') || '0'

      const bookPage = new BookPage(lastBookLevel)
      bookPage.renderBookPage(lastBookPage)

    } else {
      router.renderPage(page);
    }

  } else {
    router.renderPage();
  }
}

getLastPage();
