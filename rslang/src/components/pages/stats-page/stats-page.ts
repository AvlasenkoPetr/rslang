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

        try {
            statsData = await this.FETCH.GET_STATISTICS()
            console.log(statsData);
            
        } catch {
            // const basicStats: IStatisticResponse = {
            //     learnedWords: 0,
            //     optional: {
            //         audiocall: {
            //             newWords: 0,
            //             correct: 0,
            //             wrong: 0,
            //             maxRow: 0,
            //         },
            //         sprint: {
            //             newWords: 0,
            //             correct: 0,
            //             wrong: 0,
            //             maxRow: 0
            //         }
            //     }
            // }
            // await this.FETCH.UPDATE_STATISTICS(basicStats)
            // statsData = await this.FETCH.GET_STATISTICS()
            // console.log(statsData);
        }
        // console.log(statsData);
        

        this.STATS_PAGE.innerHTML = `
        <div class="stats-page__wrapper">

            <div class="stats-page__card">
                <p>Сегодня вы узнали</p>
                <h2>${2}</h2>
                <p>новых слова</p>
            </div>
            <div class="stats-page__card"></div>
            <div class="stats-page__card"></div>
            <div class="stats-page__card"></div>

        </div>
        `

        this.MAIN_WRAPPER.append(this.STATS_PAGE)
        appendFooter(this.MAIN_WRAPPER)

    }
}

export default StatsPage