import './stats-page.scss'
import { isUserExists } from "../../Helpers/helpers";
import appendFooter from "../../Reusable-components/footer/footer";
import { Fetch } from '../../Fetch/fetch';
import { IStatisticResponse } from '../../Interfaces/interfaces';

class StatsPage {
    MAIN_WRAPPER: HTMLElement;
  
    STATS_PAGE: HTMLElement; 

    FETCH
  
    constructor() {
      this.MAIN_WRAPPER = document.querySelector('.main__wrapper') as HTMLElement;
  
      this.STATS_PAGE = document.createElement('main');
      this.STATS_PAGE.className = 'stats-page page';
    
      this.FETCH = new Fetch
    }

    renderStatsPage = async () => {
        this.MAIN_WRAPPER.innerHTML = ''

        if (!isUserExists()) {
            // здесь будет еррор пейдж
            return
        }

        let statsData: IStatisticResponse
        statsData = await this.FETCH.GET_STATISTICS()

        // try {
        //     statsData = await this.FETCH.GET_STATISTICS()
        //     console.log(statsData);
            
        // } catch {
        //     const basicStats: IStatisticResponse = {
        //         learnedWords: 0,
        //         optional: {
        //             audiocall: {
        //                 newWords: 0,
        //                 correct: 0,
        //                 wrong: 0,
        //                 maxRow: 0,
        //             },
        //             sprint: {
        //                 newWords: 0,
        //                 correct: 0,
        //                 wrong: 0,
        //                 maxRow: 0
        //             }
        //         }
        //     }
        //     await this.FETCH.UPDATE_STATISTICS(basicStats)
        //     statsData = await this.FETCH.GET_STATISTICS()
        //     console.log(statsData);
        // }

        console.log(statsData);
        
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

        this.STATS_PAGE.innerHTML = `
        <div class="stats-page__wrapper">

            <div class="stats-page__card words">
                <p>Новых слов сегодня</p>
                <h1>${newWordsTotal}</h1>
            </div>

            <div class="stats-page__card accuracy">
                <div class="accuracy-percentage">${accuracyTotal}%</div>
                <p>Ваша точность</p>
            </div>

            <div class="stats-page__card game">
                <h3>Спринт</h3>
                <div class="game-stats__wrapper">
                    <p><span class="words">${sprintNewWords}</span> - новые слова</p>
                    <p><span class="accuracy">${sprintAccuracy}%</span> - точность</p>
                    <p><span class="row">${statsData.optional?.sprint?.maxRow || 0}</span> - лучшая серия</p>
                </div>
            </div>

            <div class="stats-page__card game">
                <h3>Аудиовызов</h3>
                <div class="game-stats__wrapper">
                    <p><span class="words">${audiocallNewWords}</span> - новые слова</p>
                    <p><span class="accuracy">${audiocallAccuracy}%</span> - точность</p>
                    <p><span class="row">${statsData.optional?.audioCall?.maxRow || 0}</span> - лучшая серия</p>
                </div>
            </div>

        </div>
        `

        this.MAIN_WRAPPER.append(this.STATS_PAGE)
        appendFooter(this.MAIN_WRAPPER)

    }
}

export default StatsPage