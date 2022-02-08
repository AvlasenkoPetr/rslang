import './assets/styles/default.scss'
import './components/pages/main-page/main-page.scss'
import { Fetch, ICREATE_USER_WORD, IUPDATE_SETTINGS, IUPDATE_STATISTICS } from "./components/Fetch/fetch";
import { Router } from './components/router/router'

const router = new Router
router.setListener()

