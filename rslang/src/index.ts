import './assets/styles/default.scss'
import { checkStatsDay, getLastPage, isUserExists, renderBookWithLS } from './components/Helpers/helpers';
import { BookPage } from './components/pages/book-page/book-page';
import './components/pages/main-page/main-page.scss'
import { Router } from './components/router/router'


const router = new Router();
router.setListener();

getLastPage();

if (isUserExists()) {
  checkStatsDay()
}