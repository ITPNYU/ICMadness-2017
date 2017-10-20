// A2Z F17
// Daniel Shiffman
// http://shiffman.net/a2z
// https://github.com/shiffman/A2Z-F17

// Tracery by Kate Compton
// https://github.com/galaxykate/tracery

let grammar;
let data;
let resourceData;
let resourceElts = [];
let seed;
let permalink;
let params;
let first = true;

// Here is the grammar
function preload() {
  data = loadJSON('data/generator.json');
  resourceData = loadJSON('data/resources.json');
}


function setup() {
  params = getURLParams();

  // Seed with date and time

  //Math.seedrandom(seed);
  noCanvas();
  // Make the grammar
  grammar = tracery.createGrammar(data);
  generate();

  // A button to generate a new sentence
  let spin_button = select('#spin_button');
  spin_button.mousePressed(generate);

}


function generate() {
  if (first) {
    seed = params.id || new Date().getTime();
    first = false;
  } else {
    seed = new Date().getTime();
  }
  randomSeed(seed);

  // clear any resources?
  for (let i = 0; i < resourceElts.length; i++) {
    resourceElts[i].remove();
  }

  let expansion = grammar.expand('#start#');
  select('#instructions').html(expansion.childText);

  if (!permalink) {
    permalink = createA('?id=' + seed, 'permalink');
    permalink.parent('#permalink');
  } else {
    permalink.attribute('href', '?id=' + seed);
  }

  let technology = expansion.children[0].children[3].finalText;
  let resources = resourceData[technology];
  if (resources) {
    console.log(resourceData);
    for (let i = 0; i < resources.resources.length; i++) {
      let elt = createElement('li', '');
      elt.parent('#resources');
      let r = resources.resources[i];
      let a = createA(r.url, r.name);
      a.parent(elt);
      resourceElts.push(elt);
    }
    let people = resources.helpers;
    for (let i = 0; i < people.length; i++) {
      let elt = createElement('li', 'Ask ' + people[i] + '!');
      elt.parent('#resources');
      resourceElts.push(elt);
    }

  } else {
    let elt = createElement('li', 'No resources for ' + technology);
    elt.parent('#resources');
    resourceElts.push(elt);
  }
}
