import './stats-page.scss'
import { getTodayDate, isUserExists } from "../../Helpers/helpers";
import appendFooter from "../../Reusable-components/footer/footer";
import { Fetch } from '../../Fetch/fetch';
import { IAggregatedWords, IStatisticResponse } from '../../Interfaces/interfaces';
import ErrorPage from '../error-page/error-page';

class StatsPage {
    MAIN_WRAPPER: HTMLElement;
  
    STATS_PAGE: HTMLElement;

    STATS_WRAPPER: HTMLElement

    FETCH
  
    constructor() {
      this.MAIN_WRAPPER = document.querySelector('.main__wrapper') as HTMLElement;
  
      this.STATS_PAGE = document.createElement('main');
      this.STATS_PAGE.className = 'stats-page page';

      this.STATS_WRAPPER = document.createElement('div');
      this.STATS_WRAPPER.className = 'stats-page__wrapper';
    
      this.FETCH = new Fetch
    }

    renderStatsPage = async () => {
        this.MAIN_WRAPPER.innerHTML = ''

        if (!isUserExists()) {
            const errorPage = new ErrorPage()
            errorPage.renderErrorPage()
            return
        }

        this.MAIN_WRAPPER.append(this.STATS_PAGE)
        appendFooter(this.MAIN_WRAPPER)

        let statsData: IStatisticResponse
        statsData = await this.FETCH.GET_STATISTICS()
        
        let learnderWordsCount: number
        const todayLearnedWords: IAggregatedWords = await this.FETCH.GET_AGGREGATED_WORDS({filter: `{"$and":[{"userWord.difficulty":"easy", "userWord.optional.learnDate":"${getTodayDate()}"}]}`})
        const learnedInGames = todayLearnedWords[0].totalCount[0]?.count || 0
        learnderWordsCount = learnedInGames + statsData.learnedWords

        const audiocallCorrect: number = statsData.optional?.audioCall?.correct || 0
        const audiocallWrong: number = statsData.optional?.audioCall?.wrong || 0
        const audiocallNewWords: number = statsData.optional?.audioCall?.newWords || 0
        let audiocallAccuracy: number = Math.round(((audiocallCorrect / (audiocallCorrect + audiocallWrong)) * 100))
        audiocallAccuracy = isNaN(audiocallAccuracy) ? 0 : audiocallAccuracy

        const sprintCorrect: number = statsData.optional?.sprint?.correct || 0
        const sprintWrong: number = statsData.optional?.sprint?.wrong || 0
        const sprintNewWords: number = statsData.optional?.sprint?.newWords || 0
        let sprintAccuracy: number = Math.round((sprintCorrect / (sprintCorrect + sprintWrong) * 100))
        sprintAccuracy = isNaN(sprintAccuracy) ? 0 : sprintAccuracy

        const totalAnswers = audiocallCorrect + audiocallWrong + sprintCorrect + sprintWrong
        const accuracyTotal: number = Math.round(((audiocallCorrect + sprintCorrect) / totalAnswers) * 100)
        const newWordsTotal: number = (audiocallNewWords + sprintNewWords)

        document.body.style.setProperty('--p1', `${accuracyTotal}`);


        this.STATS_WRAPPER.innerHTML = `
        <h2 class="stats-page__title">???????????????????? ???? ??????????????</h2>
        <div class="stats-page__card words">
            <p>?????????? ???????? ??????????????</p>
            <h2>${newWordsTotal}</h2>
            <p>?????????????? ???????? ??????????????</p>
            <h2>${learnderWordsCount}</h2>
        </div>

        <div class="stats-page__card accuracy">
            <div class="accuracy-percentage">${isNaN(accuracyTotal) ? 0 : accuracyTotal}%</div>
            <p>???????? ????????????????</p>
        </div>

        <div class="stats-page__card game">
            <h3>????????????</h3>
            <div class="game-stats__wrapper">
                <p><span class="words">${sprintNewWords}</span> - ?????????? ??????????</p>
                <p><span class="accuracy">${sprintAccuracy}%</span> - ????????????????</p>
                <p><span class="row">${statsData.optional?.sprint?.maxRow || 0}</span> - ???????????? ??????????</p>
            </div>
        </div>

        <div class="stats-page__card game">
            <h3>????????????????????</h3>
            <div class="game-stats__wrapper">
                <p><span class="words">${audiocallNewWords}</span> - ?????????? ??????????</p>
                <p><span class="accuracy">${audiocallAccuracy}%</span> - ????????????????</p>
                <p><span class="row">${statsData.optional?.audioCall?.maxRow || 0}</span> - ???????????? ??????????</p>
            </div>
        </div>
        `
        this.STATS_PAGE.append(this.STATS_WRAPPER)

    }
}

export default StatsPage