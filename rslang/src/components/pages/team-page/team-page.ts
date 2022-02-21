import appendFooter from '../../Reusable-components/footer/footer';
import './team-page.scss'

class TeamPage {
  MAIN_WRAPPER: HTMLElement;

  TEAM_PAGE: HTMLElement; 

  constructor() {
    this.MAIN_WRAPPER = document.querySelector('.main__wrapper') as HTMLElement;

    this.TEAM_PAGE = document.createElement('main');
    this.TEAM_PAGE.className = 'team-page page';
  }

  renderTeamPage() {
    this.MAIN_WRAPPER.innerHTML = ''
    this.TEAM_PAGE.innerHTML = this.teamPageContent()

    this.MAIN_WRAPPER.append(this.TEAM_PAGE)
    appendFooter(this.MAIN_WRAPPER)
  }

  teamPageContent = (): string => {
    return `
    <div class="team__wrapper">
      <div class="team__card">
        <div class="img-border">
          <div class="img avlasenko"></div>
        </div>
        <div class="info">
          <h2 class="info__name"><a class="info__name_link" href="https://github.com/AvlasenkoPetr" target="_blink"></a>Avlasenko Petr</h2>
          <p class="info__contribution">
            Сделал что-то
          </p>
        </div>
      </div>
      
      <div class="team__card">
        <div class="img-border">
          <div class="img skrinnik"></div>
        </div>
        <div class="info">
          <h2 class="info__name"><a class="info__name_link" href="https://github.com/rakyt4gin" target="_blink"></a>Andrei Skrinnik</h2>
          <p class="info__contribution">
            Сделал что-то
          </p>
        </div>
      </div>
      
      <div class="team__card">
        <div class="img-border">
          <div class="img arakelyan"></div>
        </div>
        <div class="info">
          <h2 class="info__name"><a class="info__name_link" href="https://github.com/Prizzz" target="_blink"></a>Robert Arakelyan</h2>
          <p class="info__contribution">
            Сделал что-то
          </p>
        </div>
      </div>
    </div>
    `
  }
}

export default TeamPage