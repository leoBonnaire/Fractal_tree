var branches = [];
var firstBranchLen = 0;

var xoff = 0;
var sinOff = 0;

function setup() {
  centerCanvas();
  
  // Create the first branch and add it to the tree
  firstBranchLen = ((sin(sinOff)+1)/2) * width / 7 + width / 25;
  branches[0] = new Branch(createVector(width / 2, height), createVector(width / 2, height - firstBranchLen), firstBranchLen);
}

function draw() {
  background(51);
  
  // Make it grow until there's at least 4000 branches
  while(branches.length < 4000) growTree();
  
  // Display the tree
  for(let i = 0; i < branches.length; i++) {
		branches[i].show();
  }
	
  // Reset the tree and create a new first branch
  branches = [];
  firstBranchLen = ((sin(sinOff)+1)/2) * width / 7 + width / 25;
  branches[0] = new Branch(createVector(width / 2, height), createVector(width / 2, height - firstBranchLen), firstBranchLen);
  
  // Increment the offest for the size of the tree and it's moves (Perlin Noise)
  xoff += 0.0007;
  sinOff += 0.002;
}

/* Make the tree grow to the next generation of branches */
function growTree(){
	
  // Go throught all the branches
  for(let i = branches.length - 1; i >= 0; i--) {
	  // Check if the branch already gave childrens
	  if(!branches[i].done) {
		// Add the new branches
		branches.push(branches[i].createBranches()['rightB']);
		branches.push(branches[i].createBranches()['leftB' ]);
	  }
	}
}

/* Branch class */
function Branch(begin, end, len) {
	
  // Starting and ending point of the branch
  this.begin = begin;
  this.end = end;
  // It's lenght
  this.len = len;
  
  // Randomly chose angle and reduct coeff for the next branches
  this.angle = map(noise(xoff + len / 10), 0, 1, PI/12, PI/4);
  this.reduct = map(noise(xoff + len / 10), 0, 1, 2/3, 2.5/3);
  
  // Vector of the direction of the branch
  this.vector = p5.Vector.sub(this.end, this.begin);
  
  // Has it gave childrens ?
  this.done = false;
  
  /* Update the direction vector */
  this.update = function() {
	this.vector = p5.Vector.sub(this.end, this.begin);
  }
  
  /* Display the branch */
  this.show = function() {
	  
	// Change the green quantity in function of the lenght of the branch
	let c = map((200 / this.len), 1, 40, 0, 205) + 50;
	  
	strokeWeight(3);
	stroke(255 - c, 255 + c, 255 - c);
	line(this.begin.x, this.begin.y, this.end.x, this.end.y);
  }
  
  this.createBranches = function() {
	  
	// Update the vector
	this.update();
	  
	let newEnd;
	// Reduct the next branch
	this.vector.mult(this.reduct);
	
	// Rotate the vector to its angle
	this.vector.rotate(this.angle + map(noise(xoff), 0, 1, -PI/12, PI/12));
	// Calculate the new end position
	newEnd = p5.Vector.add(this.end, this.vector);
	// Create the new branch
	let rightB = new Branch(this.end, newEnd, len * this.reduct);
	
	// Now do the same with the other branch
	this.vector.rotate(-2 * this.angle + map(noise(xoff), 0, 1, -PI/12, PI/12));
	newEnd = p5.Vector.add(this.end, this.vector);
	let leftB = new Branch(this.end, newEnd, len * this.reduct);
	
	// The chlidren were made
	this.done = true;
	
	return {rightB, leftB};
  }
  
}

function centerCanvas() {
  // Create the canvas function of the window size
  canvas = createCanvas(0.7 * windowWidth, 0.5 * windowWidth);
  var x = windowWidth - width - 10;
  // y center the canvas
  var y = (windowHeight - 0.5 * windowWidth) / 2;
  canvas.position(x, y);
}

function windowResized() {
  centerCanvas();
}