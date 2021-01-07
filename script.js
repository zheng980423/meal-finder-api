const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const mealsEl = document.getElementById('meals');
const resultHeading = document.getElementById('result-heading');
const single_mealEl = document.getElementById('single-meals');

// 搜索菜单 FetchAPI

function searchMeal(e) {
  e.preventDefault();
  // clear single meal
  single_mealEl.innerHTML = '';
  //获得搜索数据
  const term = search.value;

  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then(res => res.json())
      .then(result => {
        console.log(result);
        resultHeading.innerHTML = `<h2>搜索'${term}'的结果为：</h2>`;
        if (result.meals === null) {
          resultHeading.innerHTML = `<p>没有此项的搜索结果，再试一次</p>`;
        } else {
          mealsEl.innerHTML = result.meals
            .map(
              meal => `
          <div class='meal'>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
            <div class='meal-info' data-mealID="${meal.idMeal}">
              <h3>${meal.strMeal}</h3>
            </div>
          </div>
          `
            )
            .join('');
        }
      });
    search.value = '';
  } else {
    alert('请输入内容！');
  }
}

//通过ID获取meal
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}

//获取随机meal
function getRandomMeal() {
  //清空 meals和heading
  mealsEl.innerHTML = '';
  resultHeading.innerHTML = '';
  fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}
//add meal to DOM
function addMealToDOM(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    //查看一下这个API的格式吧
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  single_mealEl.innerHTML = `
  
  <div class='single-meal'>
    <h1>${meal.strMeal}</h1>
    <img src='${meal.strMealThumb}' alt="${meal.strMeal}" />
    <div class='single-meal-info'>
    ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
    ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}

    </div>
    <div class='main'>
      <p>${meal.strInstructions}</p>
      <h2>制作材料</h2>
      <ul>
        ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
      </ul>
    </div>
  </div>
  `;
}

//事件监听
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);
mealsEl.addEventListener('click', e => {
  const mealInfo = e.path.find(item => {
    if (item.classList) {
      return item.classList.contains('meal-info');
    } else {
      return false;
    }
  });
  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid');
    getMealById(mealID);
  }
});
