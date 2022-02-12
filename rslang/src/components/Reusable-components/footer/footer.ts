import './footer.scss';

function appendFooter(wrapper: HTMLElement): void {
  const footer: HTMLElement = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = `
    <a href="https://rs.school/js/" target="_blink" class="rsschool"></a>
    <div class="team">
        <a href="https://github.com/Prizzz" target="_blink">Prizzz</a>
        <a href="https://github.com/AvlasenkoPetr" target="_blink">AvlasenkoPetr</a>
        <a href="https://github.com/rakyt4gin" target="_blink">rakyt4gin</a>
    </div>
    <div class="year">2022</div>
    `;
  wrapper.append(footer);
}

export default appendFooter;
