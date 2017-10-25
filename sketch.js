// A2Z F17
// Daniel Shiffman
// http://shiffman.net/a2z
// https://github.com/shiffman/A2Z-F17

let data;
let resourceData;
let resourceElts = [];
let permalink;
let params;
let first = true;

// Here is the grammar
function preload() {
  data = loadJSON('data/generator.json');
  resourceData = loadJSON('data/resources.json');
}

let wheel1;
let wheel2;
let wheel3;
let gotResult = false;

function setup() {
  params = getURLParams();

  createCanvas(1300, 500).parent('canvasContainer');

  generate();

  // A button to generate a new sentence
  let spin_button = select('#spin_button');
  spin_button.mousePressed(generate);
}


function draw() {
  background(0);
  textAlign(LEFT, TOP);
  fill(255);
  text("Make a project about", 20, height / 2);
  wheel1.display();
  wheel1.move();
  fill(255);
  text("that", 545, height / 2);
  wheel2.display();
  wheel2.move();
  fill(255);
  text("with", 915, height / 2);
  wheel3.display();
  wheel3.move();

  // TODO: return the final instructions as text
  // and generate resources
  if (wheel1.done && wheel2.done && wheel3.done && !gotResult) {
    newResults([wheel1.result(), wheel2.result(), wheel3.result()]);
  }
}

function newResults(r) {
  console.log("DONE! Results below");
  console.log(r);
  r.forEach(function(r) {
    console.log(r);
    res = resourceData[r];
    if (res != undefined) {
      console.log(res);
      let container = document.getElementById("resources");

      let title = document.createElement("li");
      title.innerHTML = r;
      container.appendChild(title);

      let list = document.createElement("ul");
      container.appendChild(list);

      let helpers = res["helpers"];
      if (helpers != undefined) {
        let li = document.createElement("li");
        li.innerHTML = "Ask " + helpers.join(" or ");
        list.appendChild(li);
      }
      let links = res["resources"];
      if (links != undefined) {
        let li = document.createElement("li");
        let linktags = [];
        links.forEach(function(link) {
          linktags.push("<a target='_blank' href='" + link.url + "'>" + link.name + "</a>");
        });
        li.innerHTML = "Check out " + linktags.join(", ");
        list.appendChild(li);
      }
    }
  });
  gotResult = true;
}


function generate() {
  wheel1 = new Wheel(200, 0, 320, height, data.topic);
  wheel2 = new Wheel(570, 0, 320, height, data.action);
  wheel3 = new Wheel(940, 0, 320, height, data.technology);
  gotResult = false;
  if (first && params.w1) {
    wheel1.target(atob(decodeURIComponent(params.w1)));
    wheel2.target(atob(decodeURIComponent(params.w2)));
    wheel3.target(atob(decodeURIComponent(params.w3)));
  } else {
    wheel1.restart();
    wheel2.restart();
    wheel3.restart();
  }
  // clear any resources?
  for (let i = 0; i < resourceElts.length; i++) {
    resourceElts[i].remove();
  }

  if (!permalink) {
    permalink = createA('', 'permalink');
    permalink.parent('#permalink');
  }
  permalink.attribute('href',
    '?w1=' + encodeURIComponent(btoa(wheel1.result())) +
    '&w2=' + encodeURIComponent(btoa(wheel2.result())) +
    '&w3=' + encodeURIComponent(btoa(wheel3.result())));

  first = false;
  // TODO: Show resources (below canvas) based on what was picked

  // let technology = expansion.children[0].children[3].finalText;
  // let resources = resourceData[technology];
  // if (resources) {
  //   console.log(resourceData);
  //   for (let i = 0; i < resources.resources.length; i++) {
  //     let elt = createElement('li', '');
  //     elt.parent('#resources');
  //     let r = resources.resources[i];
  //     let a = createA(r.url, r.name);
  //     a.parent(elt);
  //     resourceElts.push(elt);
  //   }
  //   let people = resources.helpers;
  //   for (let i = 0; i < people.length; i++) {
  //     let elt = createElement('li', 'Ask ' + people[i] + '!');
  //     elt.parent('#resources');
  //     resourceElts.push(elt);
  //   }
  //
  // } else {
  //   let elt = createElement('li', 'No resources for ' + technology);
  //   elt.parent('#resources');
  //   resourceElts.push(elt);
  // }
}
