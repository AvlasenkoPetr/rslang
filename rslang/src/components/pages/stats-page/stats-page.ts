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

            <div class="stats-page__card">
                <p>Новых слов сегодня</p>
                <h2>${newWordsTotal}</h2>
            </div>

            <div class="stats-page__card">
                <p>Ваша точность</p>
                <h2>${accuracyTotal}%</h2>
            </div>

            <div class="stats-page__card">
                <h2>Аудиовызов</h2>
                <p>Новые слова: ${audiocallNewWords}</p>
                <p>Точность: ${audiocallAccuracy}%</p>
                <p>Лучший стрик: ${statsData.optional?.audioCall?.maxRow || 0}</p>
            </div>
                
            <div class="stats-page__card">
                <h2>Спринт</h2>
                <p>Новые слова: ${sprintNewWords}</p>
                <p>Точность: ${sprintAccuracy}%</p>
                <p>Лучший стрик: ${statsData.optional?.sprint?.maxRow || 0}</p>
            </div>

        </div>
        `

        this.MAIN_WRAPPER.append(this.STATS_PAGE)
        appendFooter(this.MAIN_WRAPPER)

    }
}

export default StatsPage