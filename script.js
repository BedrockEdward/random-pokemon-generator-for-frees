function getRandomSample(array, count) {
  const copy = [...array];
  const result = [];
  while (result.length < count && copy.length > 0) {
    const index = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(index, 1)[0]);
  }
  return result;
}

function randomOne(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/* ===== SLOT SETTERS ===== */

function setPokemonSlot(index, name) {
  const textBox = document.getElementById(`poke-out-${index}`);
  const imgBox = document.getElementById(`poke-img-${index}`);

  textBox.textContent = name;

  // Bulbapedia link
  const encoded = encodeURIComponent(name);
  textBox.onclick = () => {
    window.open(
      `https://bulbapedia.bulbagarden.net/wiki/${encoded}_(Pok%C3%A9mon)`,
      "_blank"
    );
  };

  // Sprite from PokeAPI
  const spriteName = name
    .toLowerCase()
    .replace(/\s+/g, "_")         // spaces → _
    .replace(/[^a-z0-9_-]/g, ""); // keep letters, numbers, _ and -
  imgBox.src = `./pokemon_sprites/${spriteName}.png`;

  imgBox.onerror = () => {
    imgBox.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png";
  };
}

function setAbilitySlot(index, name) {
  const box = document.getElementById(`abi-out-${index}`);
  box.textContent = name;

  const encoded = encodeURIComponent(name);
  box.onclick = () => {
    window.open(
      `https://bulbapedia.bulbagarden.net/wiki/${encoded}_(Ability)`,
      "_blank"
    );
  };
}

function setMoveSlot(index, name) {
  const box = document.getElementById(`move-out-${index}`);
  box.textContent = name;

  const encoded = encodeURIComponent(name);
  box.onclick = () => {
    window.open(
      `https://bulbapedia.bulbagarden.net/wiki/${encoded}_(move)`,
      "_blank"
    );
  };
}

/* ===== MAIN GENERATE BUTTONS ===== */

document.getElementById("btn-pokemon").addEventListener("click", () => {
  const count = parseInt(document.getElementById("pokemon-count").value);
  const container = document.getElementById("pokemon-results");

  // delete old rows
  container.innerHTML = "";

  const results = getRandomSample(pokemon, count);

  results.forEach((name, i) => {
    const index = i + 1;

    const row = document.createElement("div");
    row.className = "poke-row";

    row.innerHTML = `
  <input type="checkbox" class="select-pokemon" data-index="${index}" checked />
  <img id="poke-img-${index}" />
  <button id="poke-out-${index}" class="box"></button>
  <button class="reroll" data-type="pokemon" data-index="${index}">↻</button>
`;

    container.appendChild(row);
    setPokemonSlot(index, name);
  });

  // reconnect reroll buttons for newly created rows
  container.querySelectorAll(".reroll").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      setPokemonSlot(index, randomOne(pokemon));
    });
  });
});

document.getElementById("btn-ability").addEventListener("click", () => {
  const count = parseInt(document.getElementById("ability-count").value);
  const container = document.getElementById("ability-results");

  container.innerHTML = "";

  const results = getRandomSample(ability, count);

  results.forEach((name, i) => {
    const index = i + 1;

    const row = document.createElement("div");
    row.className = "row";

    row.innerHTML = `
  <input type="checkbox" class="select-ability" data-index="${index}" checked />
  <button id="abi-out-${index}" class="box"></button>
  <button class="reroll" data-type="ability" data-index="${index}">↻</button>
`;

    container.appendChild(row);
    setAbilitySlot(index, name);
  });

  container.querySelectorAll(".reroll").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      setAbilitySlot(index, randomOne(ability));
    });
  });
});

document.getElementById("btn-moves").addEventListener("click", () => {
  const count = parseInt(document.getElementById("move-count").value);
  const container = document.getElementById("move-results");

  container.innerHTML = "";

  const results = getRandomSample(moves, count);

  results.forEach((name, i) => {
    const index = i + 1;

    const row = document.createElement("div");
    row.className = "row";

    row.innerHTML = `
  <input type="checkbox" class="select-move" data-index="${index}" checked />
  <button id="move-out-${index}" class="box"></button>
  <button class="reroll" data-type="move" data-index="${index}">↻</button>
`;

    container.appendChild(row);
    setMoveSlot(index, name);
  });

  container.querySelectorAll(".reroll").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      setMoveSlot(index, randomOne(moves));
    });
  });
});

/* ===== REROLL BUTTONS ===== */

document.querySelectorAll(".reroll").forEach(btn => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.type;
    const index = btn.dataset.index;

    if (type === "pokemon") {
      setPokemonSlot(index, randomOne(pokemon));
    }

    if (type === "ability") {
      setAbilitySlot(index, randomOne(ability));
    }

    if (type === "move") {
      setMoveSlot(index, randomOne(moves));
    }
  });
});
document.getElementById("btn-showdown").addEventListener("click", () => {
  const selectedPokemon = [];
  const selectedAbilities = [];
  const selectedMoves = [];

  document.querySelectorAll(".select-pokemon:checked").forEach(cb => {
    const index = cb.dataset.index;
    const name = document.getElementById(`poke-out-${index}`)?.textContent;
    if (name) selectedPokemon.push(name);
  });

  document.querySelectorAll(".select-ability:checked").forEach(cb => {
    const index = cb.dataset.index;
    const name = document.getElementById(`abi-out-${index}`)?.textContent;
    if (name) selectedAbilities.push(name);
  });

  document.querySelectorAll(".select-move:checked").forEach(cb => {
    const index = cb.dataset.index;
    const name = document.getElementById(`move-out-${index}`)?.textContent;
    if (name) selectedMoves.push(name);
  });

  let output = "";

  selectedPokemon.forEach((pokemonName, i) => {
    const abilityName = selectedAbilities[i] || selectedAbilities[0] || "Ability";
    const movesForPokemon = selectedMoves.slice(i * 4, i * 4 + 4);

    output += `${pokemonName}\n`;
    output += `Ability: ${abilityName}\n`;

    movesForPokemon.forEach(move => {
      output += `- ${move}\n`;
    });

    output += `\n`;
  });

  document.getElementById("showdown-output").value = output.trim();
});
document.getElementById("btn-copy").addEventListener("click", async () => {
  const text = document.getElementById("showdown-output").value;

  if (!text.trim()) {
    alert("No script to copy.");
    return;
  }

  try {
    await navigator.clipboard.writeText(text);

    const btn = document.getElementById("btn-copy");
    const oldText = btn.textContent;

    btn.textContent = "Copied!";
    
    setTimeout(() => {
      btn.textContent = oldText;
    }, 1200);

  } catch (err) {
    alert("Copy failed.");
    console.error(err);
  }
});