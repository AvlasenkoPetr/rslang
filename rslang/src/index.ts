import './assets/styles/default.scss'
import './assets/styles/alternative.scss'
import { checkStatsDay, getLastPage, isTokenAlive, isUserExists, renderBookWithLS } from './components/Helpers/helpers';
import { BookPage } from './components/pages/book-page/book-page';
import './components/pages/main-page/main-page.scss'
import { Router } from './components/router/router'


const router = new Router();
router.setListener();

getLastPage();

if (isUserExists()) {
  checkStatsDay()
  isTokenAlive()
}

console.log('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMDJhNTY5ZmJhZDk3MDAxNmQ3YzVmOCIsImlhdCI6MTY0NTQ4NjI4NCwiZXhwIjoxNjQ1NTAwNjg0fQ.DhNfqQiksvWDttmmlg03W8wL35s4VGApBv4hkwdwYGI');
