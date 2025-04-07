// project.js - 
//purpose: "This script powers the Fig Tree life path generator. It randomly assembles an alternate version of the user's life using categories like professions, hometowns, majors, and hobbies."
// description: "Based on the fig tree quote in The Bell Jar by Sylvia Plath. This generator gives you a new life story, a branch that could have been apart of your tree, but makes it a little odd."
// Author: Evelyn Marino Castro
// Date: 04/07/2025
// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const fillers = {
  professions: ["toothpick sculptor", "panic room architect", "trash oracle", "sleep technician", "cloud identifier", "emotional support mime", "freeloader", "mall Santa", "dream archivist", "snake massage specialist", "matcha reviewer", "ghost tour guide", "moss arranger", "underwater welder", "AI whisperer", "video game designer", "librarian", "cemetery landscape designer", "falconer", "puppet maker", "YouTuber", "mime", "sock psychologist", "forensic linguist", "reality auditor", "ice sculptor", "zookeeper", "theme park actor", "digital exorcist", "professional mermaid", "clown therapist", "taxidermist", "urban farmer", "bounty hunter", "handwriting analyst", "voice actor", "scent evaluator", "crime scene cleaner", "museum curator", "pet psychic", "fermentation specialist", "baby name consultant", "roller coaster tester", "emoji translator", "teacher", "ghost influencer", "balloon artist", "emotional archaeologist", "haunted Roomba technician", "tarot reader", "anti-influencer", "storm chaser", "luxury dog chef", "ethically questionable magician", "CEO", "snake milker", "cyber prophet", "food stylist", "professional line stander", "astral cartographer", "professional cuddler", "vibe curator", "escape room designer", "haunted house screamer", "nurse", "sentient plant communicator", "conspiracy debunker", "doll doctor", "astronaut", "iceberg listener", "park ranger", "glass blower"],
  descriptor: ["emotionally crowd sourced", "strangely comforting", "like an elaborate inside joke", "great", "fine", "stable", "like you finally found a coping mechanism", "like you locked in", "like it pays the bills", "like your notes app knows too much", "like a group project where no one communicated", "like you didn’t even try", "haunted", "bleak", "concerning", "like you almost had it and then let it go on purpose", "like a deleted scene from something better", "like a character introduced mid-season with no backstory", "like a lullaby that slows down mid-song", "like the lights flickered and no one else noticed", "like you woke up but the spinning top didn’t fall", "like you're one kick away from clarity", "like you pretended to know things and it worked", "like you stopped fake laughing at the bad joke your coworker told you", "like your therapist would be proud", "like a checklist with nothing crossed off", "like a motivational poster in Comic Sans", "like you made a choice and had to commit to the bit", "cool", "like you're the problem", "like you have good credit", "like you know what a Roth IRA is", "like that one scene from twilight", "like you got everything you wanted", "like you ghosted your doctor", "like you shower", "like you answered one email and needed a break", "like you meal prepped once and still talk about it", "like you have three planners and use none of them"],
  state: ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", " Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"],
  thing: ["its haunted spin class", "its unmatched participation in public surveys", "its interpretive dance protests", "its refusal to use roundabouts", "the local obsession with beige decor", "its heated debates over soup classifications", "its unofficial motto: 'we're doing our best'", "the annual chili cook-off that always ends in tears", "its lookalike competitions", "crying in cubicles", "its passion toward today's climate", "how often the power goes out but no one complains", "its highly emotional community theater", "a suspicious number of amateur ventriloquists", "competitive sandwich artistry", "emergency preparedness drills that feel too real", "its town slogan no one can agree on", "the ice cream shop that never opens", "a convenience store that's always playing VHS tapes", "its unofficial slogan: 'Could be worse'", "mushrooms shaped like presidents' heads", "a decades-long dispute over the best exit on the highway", "a statue with eyes that follow you", "a town square that’s always slightly damp", "the world's tiniest art museum", "the gas station where people go to cry", "the slowest drive-thru in the state", "a festival dedicated to lost socks", "a diner that only plays sad 2000s hits", "an annual 'nothing happened here' parade"],
  feeling: ["loved it there", "hated it there", "miss it sometimes", "left and never looked back", "couldn’t wait to leave", "didn’t feel anything", "cried the day you left", "still talk about it like it was yesterday", "ran from it", "became someone else there", "kept it a secret", "got weird there", "lost something important there", "still feel it in your bones", "grew up too fast there", "pretend it didn’t happen", "left part of yourself behind", "romanticized it later", "told people it was fine"],
  major:["Computer Science", "Psychology", "Creative Writing", "Marine Biology", "Philosophy", "Anthropology", "Political Science", "Film and Media Studies", "Environmental Science", "Sociology", "Art History", "Mathematics", "Economics", "Astrophysics", "Theater Arts", "Gender Studies", "Linguistics", "Game Design", "Urban Studies", "Cognitive Science", "Robotics", "Classical Studies", "Music Production", "Agricultural Science", "Peace and Conflict Studies", "Forensic Science", "Data Science", "Fashion Merchandising", "Architecture", "Religious Studies", "Journalism", "Human-Computer Interaction", "Cybersecurity", "Adventure Education", "Viticulture", "Digital Humanities", "Wilderness Therapy", "Library and Information Science", "Ethnomusicology", "Puppetry Arts"],
  hobbies: ["embroidery", "whittling", "glassblowing", "scrapbooking", "birdwatching", "tarot reading", "pottery", "archery", "fermenting vegetables", "competitive puzzling", "moss collecting", "doll repainting", "night photography", "rock skipping", "lockpicking", "soap carving", "accordion playing", "journaling in code", "extremely slow jogging", "making zines", "studying clouds", "ceramic repair", "dumpster diving (ethically)", "foraging", "DIY taxidermy", "watching trains", "building tiny furniture", "reading Wikipedia out loud", "updating a blog no one knows about", "pacing with purpose", "mushroom identification", "shadow puppetry", "found poetry", "sketching strangers", "collecting expired coupons", "learning every country's flag", "painting rocks with eyes", "spinning wool", "submitting fake reviews", "color-coding everything" ],
  roommate: ["a guy named Blake who makes his own toothpaste", "three art students who share one opinion", "your ex’s cousin", "a girl who sleeps with crystals in her mouth", "someone who only cooks with coconut oil", "your old TA", "a barista who won’t stop doing bits", "your childhood best friend, kind of", "a cat that isn’t technically yours", "your landlord’s nephew", "someone who wears headphones but never plays music", "a birdwatcher with no binoculars", "your future self, probably", "a couple who broke up but still share a room", "your therapist’s ex", "someone you met in a Discord server", "a retired clown with night terrors", "a guy who calls every meal 'a vibe'", "your old math tutor", "someone who makes moodboards for groceries", "a DJ who only plays ambient rain sounds", "a woman writing a novel about you (maybe)", "your barista’s twin", "a sleepwalker who doesn’t sleep", "a ghost named Sam", "someone who claims they're just visiting", "an aspiring inventor who hasn’t built anything", "your cousin's ex-roommate", "a bird who won’t leave", "someone who teaches sword fighting online", "a guy who’s always boiling pasta"],
  motivationalsaying:["if only the stars aligned", "but the timing wasn’t right", "if you had answered that one message", "if you’d just said yes", "but someone else got there first", "if you hadn’t overthought it", "if the train hadn’t been late", "but you blinked and missed it", "if you’d followed the weird feeling", "but fear sounded louder that day", "if you’d called instead of waiting", "but you didn’t want to seem eager", "if the dream had made more sense", "if you hadn’t deleted that draft", "but you weren’t ready to want it yet", "if only you’d let yourself believe it", "if you’d walked a little slower", "but the door closed quietly", "if you’d stayed five more minutes", "but you’ll never know now"
 ]         
  

  
};

const template = `Hello, I'm here to tell you about your Fig Tree. These are routes in life you could have gone, but didnt.

In this alternate timeline your life looks $descriptor. 

You grew up in $state. More specifically, a town known for $thing, and you $feeling! 

After that you went to college and majored in $major. During your time there you took up $hobbies but, got bored quickly, so you switched to $hobbies. 

You are currently a $professions that lives in $state with $roommate. 

Now you know how your life could have gone, $motivationalsaying.  `

;


// STUDENTS: You don't need to edit code below this line.
const slotPattern = /\$(\w+)/;

// define a class
class FigTreeGenerator {
// constructor function
constructor(template, fillers) {
  // set properties using 'this' keyword
  this.template = template;
  this.fillers = fillers;
  }
 
  chooseRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  replaceSlots(story) {
    while (story.match(slotPattern)) {
      story = story.replace(slotPattern, (match, name) => {
        const options = this.fillers[name];
        return options ? this.chooseRandom(options) : `<UNKNOWN:${name}>`;
      });
    }
    return story;
  }
  //define a method
  generateStory() {
    const finalStory = this.replaceSlots(this.template);
    $("#box").text(finalStory);  // code to run when method is called
  }

  attachEventHandler(buttonId) {
    $(`#${buttonId}`).click(() => this.generateStory());
  }
}

function main() {
  // create an instance of the class
  let myInstance = new FigTreeGenerator(template, fillers);
  myInstance.attachEventHandler("clicker")
  // call a method on the instance
  myInstance.generateStory();
}

// let's get this party started - uncomment me
main();