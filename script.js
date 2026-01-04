const label = document.getElementById('label');

function handleClick(button, text) {
  label.textContent = text;
}



document.getElementById('button1').addEventListener('click', () => {
  handleClick(this, getRandomSample(pokemon, 3));
});

document.getElementById('button2').addEventListener('click', () => {
  handleClick(this, getRandomSample(ability, 3));
});

document.getElementById('button3').addEventListener('click', () => {
  handleClick(this, getRandomSample(moves, 4));
});


function getRandomSample(array, count) {
  const copy = [...array];
  const result = [];
  while (result.length < count && copy.length > 0) {
    const index = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(index, 1)[0]);
  }
  return result;
}