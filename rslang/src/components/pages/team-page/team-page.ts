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
      <div class="team__card"></div>
      <div class="team__card"></div>
      <div class="team__card"></div>
    </div>
    `
  }
}

export default TeamPage