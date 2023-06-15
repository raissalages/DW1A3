const addListForm = document.getElementById('add-list-form');
const mainList = document.getElementById('main-list');

const API_KEY = '49cc8c821cd2aff9af04c9f98c36eb74';
const CITY = 'São Paulo';
const weatherWidget = document.getElementById('weather-widget');

let isSublistVisible = false;
let timerInterval;
let timeInSeconds = 0;
let workTittle = document.getElementById('work');
let breakTittle = document.getElementById('break');
let workTime = 25;
let breakTime = 5;
let seconds = "00"

// Functions related to local storage
function saveData() {
  const mainListArr = Array.from(mainList.children).map(listItem => {
    return {
      name: listItem.querySelector('.list-title').textContent,
      subItems: Array.from(listItem.querySelectorAll('.sub-list .subitem'))
        .map(item => item.textContent) 
    };
  });

  localStorage.setItem('mainList', JSON.stringify(mainListArr));
}

function loadData() {
  const data = JSON.parse(localStorage.getItem('mainList'));

  if (data) {
    data.forEach(listData => {
      addList(null, listData.name, listData.subItems);
    });
  }
}


function deleteSubitem(event) {
  const subitem = event.target.parentElement.parentElement; 
  const sublist = subitem.parentElement; 
  sublist.removeChild(subitem);
  saveData();
}


function toggleSubitem(event) {
  const subitem = event.target;
  subitem.classList.toggle('completed');
  saveData();

}

function addSubItem(subList, subItemName) {
  const subItemContainer = document.createElement('div');
  subItemContainer.className = 'subitem-container';
  const newSubItem = document.createElement('li');
  newSubItem.className = 'subitem';
  newSubItem.textContent = subItemName;

  const deleteIconSubItem = document.createElement('img');
  deleteIconSubItem.src = 'bin.png';
  deleteIconSubItem.alt = 'Excluir';

  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-btn';
  deleteButton.appendChild(deleteIconSubItem);
  deleteButton.addEventListener('click', deleteSubitem);

  newSubItem.appendChild(deleteButton);
  subList.appendChild(newSubItem);
}


function addList(event, name = '', subItems = []) {
  if (event !== null) {
    event.preventDefault();
  }

  const newListName = name || document.getElementById('list-input').value;

  const newList = document.createElement('li');
  newList.className = 'list-item';

  const listTitle = document.createElement('span');
  listTitle.className = 'list-title';
  listTitle.textContent = newListName;

  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'toggle-btn';
  toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'button-container';

  const titleContainer = document.createElement('div');
  titleContainer.className = 'title-container';


  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';

  const deleteIcon = document.createElement('img');
  deleteIcon.src = './bin.png';
  deleteIcon.alt = 'Excluir';

  deleteBtn.appendChild(deleteIcon);

  const subList = document.createElement('ul');
  subList.className = 'sub-list';

  buttonContainer.appendChild(toggleBtn);
  buttonContainer.appendChild(deleteBtn);

  titleContainer.appendChild(listTitle);
  titleContainer.appendChild(buttonContainer);

  newList.appendChild(titleContainer);
  newList.appendChild(subList);

  mainList.appendChild(newList);


  document.getElementById('list-input').value = '';


  const toggleSublist = () => {
    if (isSublistVisible) {
      subList.style.display = 'none';
      toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i>'; 
    } else {
      subList.style.display = 'block';
      toggleBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    }
    isSublistVisible = !isSublistVisible;
  };

  toggleBtn.addEventListener('click', toggleSublist);

  toggleBtn.style.cursor = 'pointer';
  listTitle.style.cursor = 'text';

  const addSubItemForm = document.createElement('form');
  addSubItemForm.className = 'add-subitem-form';

  const subItemInput = document.createElement('input');
  subItemInput.type = 'text';
  subItemInput.placeholder = 'Digite um novo item';
  subItemInput.className = 'subitem-input';

  const subItemBtn = document.createElement('button');
  subItemBtn.type = 'submit';
  subItemBtn.textContent = 'Adicionar';
  subItemBtn.id = 'subitem-button';

  addSubItemForm.appendChild(subItemInput);
  addSubItemForm.appendChild(subItemBtn);
  subList.appendChild(addSubItemForm);

  subItems.forEach(subItemName => {
    addSubItem(subList, subItemName);
  });
  deleteBtn.addEventListener('click', () => {
    newList.remove();
    saveData();

  });
  
  addSubItemForm.addEventListener('submit', event => {
    event.preventDefault();
    const newSubItemName = subItemInput.value;
    addSubItem(subList, newSubItemName);
    subItemInput.value = '';
    saveData();

  });

  listTitle.setAttribute('contenteditable', 'true');

  listTitle.addEventListener('input', () => {
    const maxLength = 20;
    if (listTitle.textContent.length > maxLength) {
      listTitle.textContent = listTitle.textContent.slice(0, maxLength);
    }
  });

  listTitle.textContent = newListName;
  listTitle.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      listTitle.blur(); 
    }
  });

  listTitle.addEventListener('blur', () => {
    const updatedListTitle = listTitle.textContent;
    saveData();
  });

  subList.addEventListener('click', event => {
    if (event.target.classList.contains('subitem')) {
      toggleSubitem(event);
    }
  });
  saveData();

}

addListForm.addEventListener('submit', addList);



window.onload = () => {
    document.getElementById('minutes').innerHTML = workTime;
    document.getElementById('seconds').innerHTML = seconds;

    workTittle.classList.add('active');
}

function start() {
    document.getElementById('start').style.display = "none";
    document.getElementById('reset').style.display = "block";

    seconds = 59;

    let workMinutes = workTime - 1;
    let breakMinutes = breakTime - 1;

    breakCount = 0;

    let timerFunction = () => {
        document.getElementById('minutes').innerHTML = workMinutes.toString().padStart(2, '0');;
        document.getElementById('seconds').innerHTML = seconds.toString().padStart(2, '0');;

        seconds = seconds - 1;

        if(seconds === 0) {
            workMinutes = workMinutes - 1;
            if(workMinutes === -1 ){
                if(breakCount % 2 === 0) {
                    workMinutes = breakMinutes;
                    breakCount++

                    workTittle.classList.remove('active');
                    breakTittle.classList.add('active');
                }else {
                    workMinutes = workTime;
                    breakCount++

                    breakTittle.classList.remove('active');
                    workTittle.classList.add('active');
                }
            }
            seconds = 59;
        }
    }

    // start countdown
    setInterval(timerFunction, 1000); // 1000 = 1s
}


window.addEventListener('load', loadData);

const volumeButton = document.querySelector('.volume-button');
    const audioPlayer = document.getElementById('audio-player');

    volumeButton.addEventListener('click', function() {
      if (audioPlayer.muted) {
        audioPlayer.muted = false;
        volumeButton.innerHTML = '<i class="fas fa-volume-up"></i>';
      } else {
        audioPlayer.muted = true;
        volumeButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
      }
    });


function updateTimer() {
    const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');

    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;

    timeInSeconds--;
    
    if (timeInSeconds < 0) {
        clearInterval(timerInterval);
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
    }
}


function startTimer() {
    timeInSeconds = 1500; 

    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}


function stopTimer() {
    clearInterval(timerInterval);
    document.getElementById('minutes').textContent = '25';
    document.getElementById('seconds').textContent = '00';
    
}


document.getElementById('work').addEventListener('click', startTimer);

document.getElementById('break').addEventListener('click', stopTimer);



fetch(`https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}`)
  .then(response => response.json())
  .then(data => {
    const temperature = Math.round(data.main.temp - 273.15); 
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const location = data.name;

    const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
    const icon = document.createElement('img');
    icon.src = iconUrl;

    const temperatureElement = document.createElement('p');
    temperatureElement.classList.add('temperature');
    temperatureElement.textContent = `${temperature}°C`;

    const descriptionElement = document.createElement('p');
    descriptionElement.classList.add('description');
    descriptionElement.textContent = description;

    const locationElement = document.createElement('p');
    locationElement.classList.add('location');
    locationElement.textContent = location;

    weatherWidget.innerHTML = '';
    weatherWidget.appendChild(icon);
    weatherWidget.appendChild(temperatureElement);
    weatherWidget.appendChild(descriptionElement);
    weatherWidget.appendChild(locationElement);
  })
  .catch(error => {
    console.log('Error:', error);
    weatherWidget.textContent = 'Failed to fetch weather data.';
  });
