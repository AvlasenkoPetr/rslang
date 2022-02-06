import './footer.scss'

export function appendFooter(wrapper: HTMLElement): void {
    const footer: HTMLElement = document.createElement('footer')
    footer.className = 'footer'
    footer.innerHTML = `
    <div>RSSchool</div>
    <div>Сделано пацанами</div>
    <div>2022</div>
    `
    wrapper.append(footer)
}