// 토글 버튼
const toggleButton = document.querySelector('.toggle-button')

// 배경
const bodyBackground = document.querySelector('body');

// header-nav
const headerNav = document.querySelector('.header-nav-list-wrapper')

const menu=document.querySelector('.header-nav-menu')
const pay=document.querySelector('.header-nav-pay')
const notice=document.querySelector('.header-nav-notice')

// bookmark-wrapper
const bookmarkWrapper = document.querySelector('.bookmark-wrapper')

// search-input
const searchInput = document.querySelector('#search-input')

// img-icon-wrapper
const imgIconWrappers = document.querySelectorAll('.img-icon-wrapper')

// bookmark-text
const bookmarkTexts = document.querySelectorAll('.bookmark-text')

const searchWindow = document.querySelector('.search-window')

toggleButton.addEventListener('click', function () {
    // 클릭
    // 다크모드로 전환되는 상태
    // 일반모드->다크모드라고 텍스트 바뀌게 해야됨
    toggleButton.textContent = "다크 모드"

    // .붙이지 않는다
    toggleButton.classList.toggle('toggle-button-darkmode')
    bodyBackground.classList.toggle('body-background-darkmode')
    headerNav.classList.toggle("text-darkmode")
    searchInput.classList.toggle("search-input-darkmode")

    menu.src="./images/메뉴.png"
    pay.src="./images/pay.png"
    notice.src="./images/알림.png"

    for (let i = 0; i < imgIconWrappers.length; ++i) {
        imgIconWrappers[i].classList.toggle('img-icon-wrapper-darkmode')
    }

    for (let i = 0; i < bookmarkTexts.length; ++i) {
        bookmarkTexts[i].classList.toggle('text-darkmode')
    }

    searchWindow.classList.toggle('search-window-darkmode')

    // classList.contains 활용
    if (toggleButton.classList.contains('toggle-button-darkmode')) {
        toggleButton.textContent = "일반 모드"
        menu.src="./images/메뉴_negative.png"
        pay.src="./images/pay_negative.png"
        notice.src="./images/알림_negative.png"
    }
})

searchInput.addEventListener('keydown', function (e) {
    // e.code: 어떤 키를 입력했는지 알 수 있게 해줌
    // enter 입력 시 해당 검색어로 검색 진행
    if (e.code === "Enter") {
        // 검색어가 존재하는 경우에만 이용
        if (!e.target.value) {
            alert("검색어를 입력하지 않으셨습니다!")
            return;
        }
    }

    // 이동하기
    const googleSearch = "https://www.google.com/search?q="
    location.href = googleSearch + e.target.value

    // 새창으로 열기
    // window.open(googleSearch + e.target.value, "_blank")
})