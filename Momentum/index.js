async function setRenderBackground() {
    // body에 background 주소를 넣어도 됨

    // 하지만 여기서는 axios 요청으로 이미지 받아올 것임

    // blob -> 이미지, 사운드, 비디오 등 멀티미디어 데이터를 다룰 때 사용
    const result = await axios.get("https://picsum.photos/1280/720", {
        responseType: "blob"
    })
    // picsum 주소의 두 숫자는 각각 너비와 높이다.

    // URL.createObjectURL -> 임시 URL을 만든다.(페이지 내에서만 유효)
    // 받아온 데이터로 임시 URL을 만들어 그 URL에 body를 넣는다.

    const imageURL = URL.createObjectURL(result.data);
    document.querySelector('body').style.backgroundImage = `url(${imageURL})`;
}

// 화살표 함수로 하고 싶다면 다음과 같이 하면 됨
// const setRenderBackground = async() => {}

// 시간 갱신
function setTime() {
    const timer = document.querySelector('.timer');

    setInterval(() => {
        //date 함수
        const date = new Date().toTimeString().split(' ')[0];
        // console.log(date);
        // console.log(date.getHours());
        timer.textContent = `${date}`;
    }, 1000);
}

function getMemo(memo) {
    // localStorage로부터 가져와서 memo에 넣어주는 작업
    const components=memoComponent(memo);
    document.querySelector('.memo-wrapper').insertAdjacentHTML('beforeend', components);
}

function memoComponent(memo){
    return`
    <div class="memo">${memo}</div>
    `
}

function setMemo() {
    const memoInput = document.querySelector('.memo-input');
    memoInput.addEventListener('keyup', function (e) {
        // e.code 입력 시 -> 작성한 키 조회
        // e.code가 Enter인 경우에만 메모를 바꿀 수 있도록 할 것
        // 입력창에 값이 입력된 경우에만 메모를 바꿀 수 있도록 할 것
        if (e.code == 'Enter' && e.target.value) {
            // 메모를 저장
            // const memo=document.querySelector('.memo');
            // memo.textContent=e.target.value;

            /* 새로고침 해도 메모가 날아가지 않도록 저장해야 함
            원래는 백엔드에서 DB에 저장하고 가져오기를 해야하지만
            브라우저에도 간단한 저장소가 있음. -> localStorage
            */

            // 데이터 가져올 때
            // JSON -> 문자
            //JSON.stringify ()

            // 데이터 넣을 때
            // 문자열JSON -> JSON
            // JSON.parse

            // localStorage 사용법
            // localStorage.setItem('키','넣을값')
            // localStorage.getItem('키') -> 값을 가져온다

            let data;
            if(!localStorage.getItem('todo')){
                data=[];
            }
            else{
                data=JSON.parse(localStorage.getItem('todo'));
            }

            data.push(e.target.value);

            localStorage.setItem('todo',JSON.stringify(data));

            // 메모 표시 기능은 getMemo로 분리
            getMemo(e.target.value);

            // 입력창 내용 지우기
            e.target.value = "";
        }
    })
}

function deleteMemo() {
    // 이벤트 위임
    // document.querySelector('body');
    // 위 코드 친거랑 똑같음

    // 이벤트 캡쳐링: 부모에서 자식으로 이벤트 전달
    // 버블링: 자식에서 부모로 이벤트 전달

    // 똑같은 함수 수백만개에 addEventListener를 부른다고 가정 -> 속도 저하

    // 메모 클릭하면 삭제
    document.addEventListener('click', function (e) {

        // localStorage를 지워야 하고
        if (e.target.classList.contains('memo')) {
            const data=JSON.parse(localStorage.getItem('todo'));
            // 문제점 1: 그냥 pop 쓰면 클릭한 메모의 원소가 없어지는 게 아님
            data.pop();
            console.log(data);
            localStorage.setItem('todo',JSON.stringify(data));
            // HTML 파트도 지워야 함
            // e.target.textContent = "";
    
            // 부모 태그로 들어가 해당 태그(자식 태그)를 파괴하는 방식으로 태그 삭제
            e.target.parentNode.removeChild(e.target);
        }
    })
}

function getPosition(options) {
    // navigator.geolocation -> 일반 callback 함수임.(Promise 아님)
    // promise화가 필요함
    return new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
    );
}

async function getWeather(latitude, longitude) {
    // 고정되는 변수는 이렇게 대문자로 표기함
    const API_KEY = "777f45ab929ad80a7d52e3904b309b6f";

    // 위도 경도가 있는 경우
    if (latitude && longitude) {
        // 날씨 API(위도 경도 ver)
        const URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
        const result = await axios.get(URL);
        return result;
    }
    // 위도 경도가 없는 경우
    else {
        // 날씨 API 위도 경도 없는 ver
        const city_name = 'Seoul';
        const URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city_name}&appid=${API_KEY}`;
        const result = await axios.get(URL);
        return result;
    }
}

async function renderWeather() {
    // 위도 경도를 날씨 API에 보내야 함
    try {
        // renderWeather에서 getPosition을 호출해서 위도 경도를 받아온다.
        const position = await getPosition();
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        // 날씨 요청 위도, 경도를 인자로 전달
        const weatherResponse = await getWeather(latitude, longitude);

        const weatherData = weatherResponse.data;

        const dayTime = parseInt(new Date().getHours() / 3) * 3;

        // 현재 시간 기준의 5일 동안의 날씨 가져오기(배열 5개)
        const weatherList = weatherData.list.reduce((acc, cur) => {
            if (cur.dt_txt.indexOf(`${dayTime}:00:00`) > 0) {
                acc.push(cur);
            }

            return acc;
        }, [])

        // 모달 버튼 현재 날씨 아이콘으로 변경
        matchModalButton(weatherList[0].weather[0].main);

        // 컴포넌트 생성
        const components = weatherList.reduce((acc, cur) => {
            const time = cur.dt_txt.split(' ')[0];
            const state = cur.weather[0].main;
            const img = matchIcon(state);
            const temp = (cur.main.temp - 273.15).toFixed(1);
            acc = acc + weatherWrapperComponent(time, state, img, temp);

            return acc;
        }, "")

        // 컴포넌트 추가
        document.querySelector('.modal-dialog').insertAdjacentHTML('beforeend', components);

    } catch (error) {
        alert(error);
    }

}

function weatherWrapperComponent(dayTime, weatherState, weatherImg, temperature) {
    return `
    <div class="weather-box">
        <div style="margin-bottom: 10px; width:90px">${dayTime}</div>
            <div>${weatherState}</div>
            <img src="${weatherImg}" style="height: 50px;">
            <div>${temperature}°</div>
    </div>
    `
}

function matchIcon(weatherData) {
    if (weatherData === "Clear") return "./images/039-sun.png";
    if (weatherData === "Clouds") return "./images/001-cloud.png";
    if (weatherData === "Rain") return "./images/003-rainy.png";
    if (weatherData === "Snow") return "./images/006-snowy.png";
    if (weatherData === "Thunderstorm") return "./images/008-storm.png";
    if (weatherData === "Drizzle") return "./images/031-snowflake.png";
    if (weatherData === "Atmosphere") return "./images/033-hurricane.png";
}

function matchComment() {
    const comment = document.querySelector('.timer-content');
    const time = new Date().getHours();

    if (time < 12) {
        comment.textContent = "Good Morning";
    }
    else {
        comment.textContent = "Good Evening";
    }
}

function matchModalButton(weatherState) {
    const button = document.querySelector('.modal-button');
    button.style.backgroundImage = `url(${matchIcon(weatherState)})`;
}

function allRender() {
    setRenderBackground();
    setTime();
    setMemo();
    deleteMemo();
    renderWeather();
    matchComment();

    // 5초마다 해당 콜백함수 반복
    setInterval(() => {
        setRenderBackground();
    }, 5000);
}

allRender();