
// ════════════════════════════════════════
// LearnO — Combined Script
// ════════════════════════════════════════

// ── BACKEND STUBS (standalone mode — no Supabase) ──
var SUPA_USER = null;

// XP system — local fallback when backend not connected
function addXP(amount, label){
  ST.xp += amount;
  ST.lv = Math.floor(ST.xp / 500) + 1;
  updXP();
  toast(amount, label);
  saveBadgeState();
  checkLevelUp();
}

// Leaderboard renderer — local mock data
function rLB(){
  const lbl = document.getElementById('lbl');
  if(!lbl) return;
  const me = { name: USER_PROFILE.name || 'You', avatar: USER_PROFILE.avatar || '⚡', xp: ST.xp };
  const mockPlayers = [
    {name:'Phoenix',avatar:'🔥',xp:4200},
    {name:'Astra',avatar:'🌙',xp:3800},
    {name:'Cypher',avatar:'⚔️',xp:3100},
    {name:'Nova',avatar:'🛸',xp:2650},
    {name:'Blaze',avatar:'🏆',xp:2100},
    {name:'Echo',avatar:'🎮',xp:1750},
    {name:'Vortex',avatar:'🌀',xp:1400},
    {name:'Jade',avatar:'💎',xp:950},
  ];
  // Insert user in correct position
  const all = [...mockPlayers, me].sort((a,b) => b.xp - a.xp).slice(0,10);
  const nametag = getCurrentNametag();
  lbl.innerHTML = all.map((p,i) => {
    const isMe = (p === me);
    const rc = i===0?'r1':i===1?'r2':i===2?'r3':'';
    const badge = isMe && nametag ? ` <span style="font-size:.6rem;color:#61dafb;font-family:'Cinzel',serif;letter-spacing:1px;">${nametag}</span>` : '';
    return `<div class="lr ${rc}" style="animation-delay:${i*.06}s">
      <div class="lrk">${i+1}</div>
      <div class="la" style="border-color:${isMe?'#c9a84c':'rgba(201,168,76,.18)'}">${p.avatar}</div>
      <div class="ln" style="${isMe?'color:var(--ny)':''}">${p.name}${badge}</div>
      <div class="lsc">${p.xp.toLocaleString()} XP</div>
    </div>`;
  }).join('');
  // Check top3 badge
  const myRank = all.findIndex(p => p === me);
  if(myRank >= 0 && myRank < 3) unl('top3');
}

// Profile icon updater — sets nav button to current avatar
function updateProfileIcon(){
  const btn = document.getElementById('profile-nav-btn');
  if(btn && USER_PROFILE.avatar) btn.textContent = USER_PROFILE.avatar;
}

// Profile card display — shows basic stats overlay
function showProfileCard(){
  const existing = document.getElementById('profile-card-overlay');
  if(existing){ existing.remove(); return; }
  const overlay = document.createElement('div');
  overlay.id = 'profile-card-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,.9);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;animation:fi .3s ease;';
  const lvlNames = ['','🌱 Newbie','⚙️ Mediocre','🔥 Expert'];
  const badges = ST.ach.filter(a=>a.ul).length;
  overlay.innerHTML = `
    <div style="background:linear-gradient(145deg,#13110a,#0f0d02);border:1px solid rgba(201,168,76,.35);border-radius:16px;padding:2.5rem 2rem;max-width:380px;width:90%;text-align:center;box-shadow:0 30px 80px rgba(0,0,0,.8),0 0 60px rgba(201,168,76,.12);">
      <div style="font-size:3rem;margin-bottom:.5rem;filter:drop-shadow(0 0 16px rgba(201,168,76,.5))">${USER_PROFILE.avatar||'⚡'}</div>
      <div style="font-family:'Cinzel Decorative',serif;font-size:1.3rem;font-weight:900;color:var(--ny);margin-bottom:.2rem;">${USER_PROFILE.name||'Learner'}</div>
      <div style="font-family:'Cinzel',serif;font-size:.62rem;color:var(--td);letter-spacing:2px;margin-bottom:1.2rem;">${lvlNames[USER_LEVEL]||'Not set'} · Joined ${USER_PROFILE.joined||'Today'}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:.7rem;margin-bottom:1.2rem;">
        <div style="background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.2);border-radius:8px;padding:.6rem .4rem;">
          <div style="font-family:'Cinzel Decorative',serif;font-size:1.1rem;font-weight:900;color:var(--ny);">${ST.xp.toLocaleString()}</div>
          <div style="font-family:'Cinzel',serif;font-size:.55rem;color:var(--td);letter-spacing:1px;">TOTAL XP</div>
        </div>
        <div style="background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.2);border-radius:8px;padding:.6rem .4rem;">
          <div style="font-family:'Cinzel Decorative',serif;font-size:1.1rem;font-weight:900;color:var(--ny);">Lv.${ST.lv}</div>
          <div style="font-family:'Cinzel',serif;font-size:.55rem;color:var(--td);letter-spacing:1px;">LEVEL</div>
        </div>
        <div style="background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.2);border-radius:8px;padding:.6rem .4rem;">
          <div style="font-family:'Cinzel Decorative',serif;font-size:1.1rem;font-weight:900;color:var(--ny);">${badges}/${ST.ach.length}</div>
          <div style="font-family:'Cinzel',serif;font-size:.55rem;color:var(--td);letter-spacing:1px;">BADGES</div>
        </div>
      </div>
      <button onclick="document.getElementById('profile-card-overlay').remove()" style="font-family:'Cinzel',serif;font-size:.72rem;padding:.55rem 1.5rem;background:none;border:1px solid rgba(201,168,76,.4);color:var(--ny);border-radius:6px;cursor:pointer;letter-spacing:1px;">CLOSE</button>
    </div>`;
  overlay.addEventListener('click', function(e){ if(e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

// Auth modal — simplified stub for standalone mode
function showAuthModal(mode){
  showProfileSetup();
}

// Supabase profile sync stub
function supaUpsertProfile(){}

// Leaderboard light update (called from multiple places)
function updLB(){}

// Cammy AI companion stubs
function onCammyBadge(){}
function onCammyLevelUp(){}
function onCammyStreak(){}

// ── EXPERIENCE LEVEL: 0=not set, 1=newbie, 2=mediocre, 3=expert ──
var USER_LEVEL = 0;

const CHAPTERS = [
  {id:'ch1',num:1,title:'The Web Begins',icon:'🌱',level:'newbie',col:'cy',
   desc:'Your first steps into HTML — the skeleton of every webpage.',unlocked:true,
   paragraphs:[
    {id:'ch1p1',title:'What is HTML?',
     text:'HTML stands for HyperText Markup Language — the standard language to structure web content. Every webpage is built with HTML at its core. HTML uses <strong>tags</strong> inside angle brackets like <code>&lt;p&gt;</code> to tell browsers how to display content. Tags come in pairs: an opening tag <code>&lt;h1&gt;</code> and a closing tag <code>&lt;/h1&gt;</code>. The content goes between them.',
     quizzes:[
      {q:'What does HTML stand for?',opts:['HyperText Markup Language','High-Tech Modern Language','HyperText Making Language','Hyperlink Text Markup Language'],ans:0,exp:'HTML = HyperText Markup Language. It is the foundation of every webpage.'},
      {q:'Which symbol wraps HTML tags?',opts:['{ }','[ ]','( )','< >'],ans:3,exp:'HTML tags use angle brackets: <tagname>. Example: <p>Hello</p>.'},
      {q:'What does a closing HTML tag always contain?',opts:['An exclamation mark','A forward slash /','A question mark','A dot'],ans:1,exp:'Closing tags have a slash: </tagname>. Example: </p> closes a paragraph tag.'},
    ]},
    {id:'ch1p2',title:'Basic HTML Structure',
     text:'Every HTML page follows a basic structure. <code>&lt;!DOCTYPE html&gt;</code> tells the browser it\'s HTML5. The <code>&lt;html&gt;</code> element is the root. Inside are two sections: <code>&lt;head&gt;</code> (metadata, invisible — holds title, links) and <code>&lt;body&gt;</code> (all visible content — text, images, buttons). Without this structure, browsers may render your page incorrectly.',
     quizzes:[
      {q:'What does <!DOCTYPE html> tell the browser?',opts:['Download the page','This is an HTML5 document','The page has no styles','Nothing important'],ans:1,exp:'<!DOCTYPE html> declares the document type and tells the browser to use HTML5 standards.'},
      {q:'Which tag holds ALL visible content on a webpage?',opts:['The head tag','The html tag','The body tag','The meta tag'],ans:2,exp:'The <body> tag contains everything visible — text, images, buttons, videos, etc.'},
      {q:'Where does the browser tab title go in HTML?',opts:['Inside the body tag','Inside the footer tag','Inside the head tag using title tag','At the top of body tag'],ans:2,exp:'<title>My Page</title> goes inside <head> and shows in the browser tab.'},
    ]},
    {id:'ch1p3',title:'Common HTML Tags',
     text:'HTML has tags for every purpose. <code>&lt;h1&gt;</code>–<code>&lt;h6&gt;</code> create headings (h1 biggest, h6 smallest). <code>&lt;p&gt;</code> makes paragraphs. <code>&lt;a href=""&gt;</code> creates hyperlinks. <code>&lt;img src=""&gt;</code> embeds images (self-closing — no end tag needed). <code>&lt;div&gt;</code> groups block elements. <code>&lt;span&gt;</code> groups inline elements. <code>&lt;ul&gt;</code>/<code>&lt;ol&gt;</code> make lists with <code>&lt;li&gt;</code> items.',
     quizzes:[
      {q:'Which tag creates the LARGEST heading?',opts:['The h6 tag','The h3 tag','The h1 tag','The header tag'],ans:2,exp:'<h1> is the most important heading. h1 is largest, h6 is smallest.'},
      {q:'Which tag creates a hyperlink?',opts:['The link tag','The a (anchor) tag','The href tag','The url tag'],ans:1,exp:'The <a> (anchor) tag creates hyperlinks. The destination URL goes in href attribute.'},
      {q:'What tag embeds an image?',opts:['The image tag','The picture tag','The img tag','The photo tag'],ans:2,exp:'<img src="path.jpg" alt="desc"> embeds images. It is self-closing — no </img> needed.'},
    ]},
  ]},

  {id:'ch2',num:2,title:'Style Your World',icon:'🎨',level:'newbie',col:'pk',
   desc:'CSS breathes life into HTML — colors, fonts, spacing, layouts.',unlocked:true,
   paragraphs:[
    {id:'ch2p1',title:'What is CSS?',
     text:'CSS (Cascading Style Sheets) controls how HTML looks. Without CSS, all pages would be plain text documents. CSS can be written inline (on the element), internal (in a <code>&lt;style&gt;</code> tag), or external (a separate .css file — best practice). The "cascading" means styles can inherit and override each other in a specific order: more specific rules win.',
     quizzes:[
      {q:'What does CSS stand for?',opts:['Computer Style Sheets','Cascading Style Sheets','Creative Style System','Coded Styling Sheets'],ans:1,exp:'CSS = Cascading Style Sheets. The "cascading" describes how style rules inherit and override.'},
      {q:'Which CSS method is considered best practice for large projects?',opts:['Inline CSS','Internal <style> tag','External .css file','No CSS'],ans:2,exp:'External CSS keeps presentation separate from HTML — cleaner, reusable, easier to maintain.'},
      {q:'What does CSS control?',opts:['Server logic','Database queries','Visual appearance of HTML','Page URL'],ans:2,exp:'CSS controls everything visual: colors, fonts, sizes, spacing, layout, and animations.'},
    ]},
    {id:'ch2p2',title:'Selectors and Properties',
     text:'CSS works by selecting HTML elements and applying rules to them. Syntax: <code>selector { property: value; }</code>. Selectors: <code>p</code> targets all paragraphs, <code>.box</code> targets elements with class="box", <code>#hero</code> targets the element with id="hero". Key properties: <code>color</code> (text color), <code>background-color</code>, <code>font-size</code>, <code>margin</code> (outside space), <code>padding</code> (inside space), <code>border</code>.',
     quizzes:[
      {q:'How do you select an element with class="card" in CSS?',opts:['#card','card','.card','*card'],ans:2,exp:'Classes use a dot prefix: .classname. IDs use a hash: #idname. Tags use just the name: p.'},
      {q:'What does the CSS "color" property control?',opts:['Background color','Border color','Text color','All colors'],ans:2,exp:'The "color" property sets text color. Use "background-color" for the background.'},
      {q:'What is the correct CSS syntax?',opts:['p color:red','p{color=red}','p{color:red;}','color:red{p}'],ans:2,exp:'selector { property: value; } — curly braces wrap rules, colon separates property from value, semicolon ends each rule.'},
    ]},
    {id:'ch2p3',title:'Box Model & Flexbox',
     text:'Every HTML element is a rectangular box. The <strong>Box Model</strong>: content at center, <code>padding</code> (space inside border), <code>border</code>, <code>margin</code> (space outside border — between elements). <code>display: flex</code> activates Flexbox on a container. Use <code>justify-content: center</code> to center horizontally, <code>align-items: center</code> to center vertically. <code>gap</code> sets space between flex children.',
     quizzes:[
      {q:'In the CSS Box Model, which layer is OUTERMOST?',opts:['Padding','Content','Border','Margin'],ans:3,exp:'Margin is outermost — it creates space between elements. Order: content → padding → border → margin.'},
      {q:'Which CSS property creates space INSIDE the border?',opts:['margin','gap','padding','border-space'],ans:2,exp:'Padding creates space between content and border. Margin creates space outside the border.'},
      {q:'Which CSS value activates Flexbox?',opts:['display: block','display: flex','display: grid','display: inline'],ans:1,exp:'display: flex on a container makes it a flex container, enabling powerful alignment of its children.'},
    ]},
  ]},

  {id:'ch3',num:3,title:'JavaScript Awakens',icon:'⚡',level:'newbie',col:'yw',
   desc:'Make pages interactive — variables, functions, DOM — the power begins.',unlocked:true,
   paragraphs:[
    {id:'ch3p1',title:'Variables and Data Types',
     text:'JavaScript (JS) is the web\'s programming language — it makes pages interactive. Variables store data. Use <code>let</code> for values that can change, <code>const</code> for constants that cannot be reassigned. Data types: <code>string</code> ("Hello"), <code>number</code> (42), <code>boolean</code> (true/false), <code>null</code> (intentionally empty), <code>undefined</code> (not yet assigned), <code>object</code> ({key: value}), <code>array</code> ([1,2,3]).',
     quizzes:[
      {q:'Which keyword declares a variable that CANNOT be reassigned?',opts:['let','var','const','def'],ans:2,exp:'const declares a constant. Its value cannot be reassigned. Use let for variables that will change.'},
      {q:'What data type is "Hello World"?',opts:['Number','Boolean','String','Object'],ans:2,exp:'Text in quotes is a string. Strings can use single quotes, double quotes, or backticks.'},
      {q:'What does a boolean represent?',opts:['A number','True or false only','A text value','An empty value'],ans:1,exp:'Booleans have only two values: true or false. Used in conditions and logic.'},
    ]},
    {id:'ch3p2',title:'Functions',
     text:'Functions are reusable blocks of code. Define once, call many times. Traditional: <code>function greet(name) { return "Hello " + name; }</code>. Arrow function (ES6): <code>const greet = (name) => "Hello " + name;</code>. Functions accept <strong>parameters</strong> (inputs) and use <code>return</code> to send back a value. After <code>return</code>, the function stops. Functions are how you break complex problems into manageable, reusable pieces.',
     quizzes:[
      {q:'What is the purpose of a function in JavaScript?',opts:['Store data permanently','Style HTML elements','A reusable block of code','Connect to a database'],ans:2,exp:'Functions are reusable blocks of code that perform a specific task when called.'},
      {q:'Which is a valid arrow function syntax?',opts:['function => (){}','const fn = () => {}','fn -> {}','def fn():'],ans:1,exp:'Arrow function: const fnName = (params) => { body }. Introduced in ES6 for cleaner syntax.'},
      {q:'What does the "return" keyword do?',opts:['Ends the whole program','Calls another function','Sends a value back to the caller','Starts a loop'],ans:2,exp:'return sends a value back from a function. After return, the function stops executing.'},
    ]},
    {id:'ch3p3',title:'DOM Manipulation',
     text:'The DOM (Document Object Model) is JavaScript\'s view of the HTML — a tree of objects it can modify. Select elements with <code>document.getElementById("id")</code> or <code>document.querySelector(".class")</code>. Change content: <code>element.textContent = "new"</code>. Change styles: <code>element.style.color = "red"</code>. Toggle classes: <code>element.classList.add("active")</code>. Listen for clicks: <code>element.addEventListener("click", fn)</code>. This is how JavaScript brings pages to life.',
     quizzes:[
      {q:'What does DOM stand for?',opts:['Data Object Map','Document Object Model','Design Output Method','Dynamic Object Manager'],ans:1,exp:'DOM = Document Object Model. It represents HTML as objects JavaScript can read and modify.'},
      {q:'Which method selects ONE element by its ID?',opts:['document.getElement()','document.querySelector()','document.getElementById()','document.findId()'],ans:2,exp:'document.getElementById("myId") returns the single element with that exact ID.'},
      {q:'How do you change the text of an element in JS?',opts:['element.text = "x"','element.textContent = "x"','element.write("x")','element.html = "x"'],ans:1,exp:'element.textContent = "new text" safely sets the visible text content of an element.'},
    ]},
  ]},

  {id:'ch4',num:4,title:'Semantic & Accessible Web',icon:'🏗️',level:'mediocre',col:'gn',
   desc:'Write HTML that search engines and screen readers truly understand.',unlocked:false,
   paragraphs:[
    {id:'ch4p1',title:'Semantic HTML5',
     text:'Semantic HTML uses meaningful tags that describe their purpose. Instead of generic <code>&lt;div&gt;</code>s, HTML5 gave us: <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;article&gt;</code>, <code>&lt;section&gt;</code>, <code>&lt;aside&gt;</code>, <code>&lt;footer&gt;</code>. These tell browsers, developers, and search engines what each part of a page does. Search engines rank semantic pages better. Screen readers navigate them better. Your code becomes self-documenting.',
     quizzes:[
      {q:'Which HTML5 tag represents navigation links?',opts:['The menu tag','The nav tag','The links tag','The navigation tag'],ans:1,exp:'<nav> defines the navigation section. Helps search engines and screen readers identify site navigation.'},
      {q:'What is the main benefit of semantic HTML?',opts:['Faster loading','Better look','Meaningful structure for SEO and accessibility','Smaller file size'],ans:2,exp:'Semantic HTML gives meaning to content, improving accessibility, SEO, and code maintainability.'},
      {q:'Which tag should wrap the main unique content of a page?',opts:['The div tag','The section tag','The main tag','The content tag'],ans:2,exp:'<main> wraps the dominant content. There should be only ONE <main> per page.'},
    ]},
    {id:'ch4p2',title:'HTML Forms',
     text:'Forms collect user input. <code>&lt;form&gt;</code> wraps all inputs. Input types: <code>text</code>, <code>email</code> (validates format), <code>password</code> (hides input), <code>number</code>, <code>checkbox</code>, <code>radio</code>, <code>submit</code>. Always use <code>&lt;label for="id"&gt;</code> to link descriptions to inputs — clicking the label focuses the field. Add <code>required</code> to prevent empty submission, <code>minlength</code> for length rules, <code>pattern</code> for format validation.',
     quizzes:[
      {q:'Which input type automatically validates email format?',opts:['type="mail"','type="email"','type="address"','type="text"'],ans:1,exp:'type="email" validates email format automatically in modern browsers — no JavaScript needed.'},
      {q:'What attribute makes a form field mandatory?',opts:['mandatory','validate','must-fill','required'],ans:3,exp:'"required" attribute prevents form submission when the field is empty — built-in browser validation.'},
      {q:'How do you link a <label> to an <input>?',opts:['Using class attribute','for attribute matching input id','They link automatically','Using name attribute'],ans:1,exp:'<label for="myInput"> links to <input id="myInput">. Clicking the label focuses the input — better UX.'},
    ]},
    {id:'ch4p3',title:'Web Accessibility (a11y)',
     text:'Accessibility (a11y) means every user can use your site — including people with disabilities. Key rules: always add <code>alt</code> on images for screen readers, use heading hierarchy (h1→h2→h3 never skip), add <code>aria-label</code> on icon-only buttons, ensure text has sufficient contrast against background, make everything keyboard-navigable (Tab key). Accessible sites reach more users, rank better in Google, and are often legally required for public services.',
     quizzes:[
      {q:'What does the "alt" attribute on <img> do?',opts:['Styles the image','Alternative text for screen readers and broken images','Sets image dimensions','Sets image format'],ans:1,exp:'alt text is read by screen readers for visually impaired users, and shown when images fail to load.'},
      {q:'What does "a11y" mean?',opts:['Algorithm','Accessibility','Array 11 types','Auto layout'],ans:1,exp:'a11y is a numeronym for "accessibility" — there are 11 letters between "a" and "y".'},
      {q:'Which is a key accessibility principle?',opts:['Using only images for content','Removing keyboard support','Sufficient color contrast','Making pages load slowly'],ans:2,exp:'Sufficient contrast ensures text is readable for users with visual impairments like color blindness.'},
    ]},
  ]},

  {id:'ch5',num:5,title:'CSS Mastery',icon:'✨',level:'mediocre',col:'pk',
   desc:'Flexbox, Grid, animations, variables — build layouts that work anywhere.',unlocked:false,
   paragraphs:[
    {id:'ch5p1',title:'Flexbox Deep Dive',
     text:'Flexbox arranges items in one direction. Apply <code>display: flex</code> to a container. <code>justify-content</code> aligns along the main axis: <code>center</code>, <code>space-between</code>, <code>space-around</code>, <code>flex-start</code>, <code>flex-end</code>. <code>align-items</code> aligns along the cross axis. <code>flex-direction: column</code> stacks vertically. <code>flex-wrap: wrap</code> lets items flow to next line. <code>gap</code> sets spacing between items without margins.',
     quizzes:[
      {q:'Which property aligns flex items along the MAIN axis?',opts:['align-items','align-content','justify-content','flex-direction'],ans:2,exp:'justify-content controls alignment on the main axis (horizontal in row, vertical in column direction).'},
      {q:'What value puts equal space BETWEEN flex items with none at edges?',opts:['space-around','center','space-between','flex-end'],ans:2,exp:'space-between maximises space between items with no space before first or after last item.'},
      {q:'Which property lets flex items wrap to a new line?',opts:['flex-flow','flex-wrap','flex-break','overflow'],ans:1,exp:'flex-wrap: wrap allows items to move to the next line when they would overflow the container.'},
    ]},
    {id:'ch5p2',title:'CSS Grid',
     text:'CSS Grid is a two-dimensional layout system — it controls rows AND columns simultaneously. Apply <code>display: grid</code> to a container. <code>grid-template-columns: repeat(3, 1fr)</code> creates 3 equal columns. <code>fr</code> = fraction of available space. <code>gap</code> sets spacing between cells. Items can span multiple cells: <code>grid-column: span 2</code>. Rule of thumb: use Grid for page-level layouts, use Flexbox for component-level alignment.',
     quizzes:[
      {q:'What does "fr" mean in CSS Grid?',opts:['font-ratio','free-range','fraction of available space','frame-rate'],ans:2,exp:'fr = fractional unit. 1fr means "one equal share of the available space". 2fr gets twice as much.'},
      {q:'Which property defines columns in CSS Grid?',opts:['grid-columns','column-layout','grid-template-columns','define-columns'],ans:2,exp:'grid-template-columns: 1fr 2fr 1fr creates 3 columns where the middle gets twice the space.'},
      {q:'CSS Grid is best suited for:',opts:['Centering a single button','One-direction row layouts','Two-dimensional page layouts','Hiding elements'],ans:2,exp:'Grid handles rows AND columns simultaneously. Flexbox handles one dimension at a time.'},
    ]},
    {id:'ch5p3',title:'CSS Variables & Animations',
     text:'CSS custom properties (variables) store reusable values: <code>:root { --gold: #c9a84c; }</code> then use them anywhere: <code>color: var(--gold)</code>. Perfect for theming. CSS Animations: define states with <code>@keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-20px); } }</code> then apply: <code>animation: bounce 0.5s ease infinite alternate</code>. For simple transitions: <code>transition: all 0.3s ease</code> animates property changes smoothly on hover.',
     quizzes:[
      {q:'How do you declare a CSS custom property (variable)?',opts:['$color: red','--color: red','@color: red','#color: red'],ans:1,exp:'CSS variables use double-hyphen prefix: --variable-name: value. Usually declared in :root for global access.'},
      {q:'How do you USE a CSS variable?',opts:['$variable','var(--variable)','use(variable)','$(variable)'],ans:1,exp:'var(--variable-name) accesses the CSS variable. Example: color: var(--primary-color).'},
      {q:'Which rule defines animation states in CSS?',opts:['@animation','@frames','@keyframes','@motion'],ans:2,exp:'@keyframes name { from { ... } to { ... } } defines animation states. Reference the name in animation property.'},
    ]},
  ]},

  {id:'ch6',num:6,title:'JavaScript Intermediate',icon:'🔧',level:'mediocre',col:'yw',
   desc:'Arrays, objects, async code, ES6+ features — write modern JavaScript.',unlocked:false,
   paragraphs:[
    {id:'ch6p1',title:'Arrays and Array Methods',
     text:'Arrays store ordered data: <code>const nums = [1, 2, 3]</code>. Essential methods: <code>.push(val)</code> adds to end, <code>.pop()</code> removes from end, <code>.map(fn)</code> transforms each element into a new array, <code>.filter(fn)</code> keeps only elements where fn returns true, <code>.reduce(fn, init)</code> reduces to one value, <code>.find(fn)</code> returns the first match, <code>.includes(val)</code> checks if a value exists, <code>.forEach(fn)</code> iterates without returning.',
     quizzes:[
      {q:'What does Array.map() return?',opts:['The original modified array','A new array with each element transformed','The index of each element','undefined'],ans:1,exp:'map() returns a NEW array of same length with each element transformed by the callback function.'},
      {q:'Which method returns elements that PASS a test function?',opts:['map()','find()','filter()','reduce()'],ans:2,exp:'filter() returns a new array containing only elements where the callback function returns true.'},
      {q:'What does .push() do?',opts:['Removes the last element','Adds to the beginning','Adds element to the END of an array','Sorts the array'],ans:2,exp:'.push(value) adds one or more elements to the END of an array and returns the new length.'},
    ]},
    {id:'ch6p2',title:'Objects and Destructuring',
     text:'Objects store key-value pairs: <code>const user = { name: "Alex", age: 25 }</code>. Access with dot notation: <code>user.name</code> or bracket notation: <code>user["name"]</code>. ES6 destructuring extracts values cleanly: <code>const { name, age } = user</code>. The spread operator copies objects or arrays: <code>const copy = { ...user, role: "admin" }</code>. <code>Object.keys(obj)</code> returns all keys, <code>Object.values(obj)</code> returns all values.',
     quizzes:[
      {q:'How do you access property "name" from object "user"?',opts:['user->name','user[name]','user.name or user["name"]','get(user.name)'],ans:2,exp:'Both dot (user.name) and bracket (user["name"]) notation work. Use brackets for dynamic/variable keys.'},
      {q:'What does destructuring do?',opts:['Deletes an object','Extracts values from objects/arrays into variables','Copies an array','Merges two objects'],ans:1,exp:'Destructuring: const { name, age } = user — creates variables directly from object properties.'},
      {q:'What does the spread operator (...) do to an object?',opts:['Deletes all properties','Copies its properties into a new context','Converts to array','Sorts its keys'],ans:1,exp:'Spread copies properties: const newObj = { ...oldObj, newProp: val }. The original is not modified.'},
    ]},
    {id:'ch6p3',title:'Promises and Async/Await',
     text:'JavaScript is single-threaded but handles async operations via Promises. A Promise can be <em>pending</em>, <em>fulfilled</em>, or <em>rejected</em>. Chain with <code>.then().catch()</code> or use the cleaner <code>async/await</code>: mark a function <code>async</code>, then <code>await</code> any Promise inside it. Wrap with <code>try/catch</code> for error handling. This is how you fetch from APIs: <code>const data = await fetch(url).then(r => r.json())</code>.',
     quizzes:[
      {q:'What are the three states of a Promise?',opts:['start, middle, end','open, closed, error','pending, fulfilled, rejected','waiting, done, failed'],ans:2,exp:'pending (waiting) → fulfilled (resolved with value) → rejected (failed with error).'},
      {q:'What does the "async" keyword do to a function?',opts:['Makes it run faster','Makes it return a Promise automatically','Makes it synchronous','Prevents errors'],ans:1,exp:'async functions automatically return a Promise. Inside them you can use await to pause for async results.'},
      {q:'Which syntax handles errors with async/await?',opts:['if/else','.catch() only','try/catch','error()'],ans:2,exp:'try { await something() } catch(err) { handle(err) } — same pattern as synchronous error handling.'},
    ]},
  ]},

  {id:'ch7',num:7,title:'Algorithms & Problem Solving',icon:'🧠',level:'expert',col:'gn',
   desc:'Big-O, sorting, recursion — think like a computer scientist.',unlocked:false,
   paragraphs:[
    {id:'ch7p1',title:'Big-O Notation',
     text:'Big-O describes how time/space grows as input (n) grows. <code>O(1)</code> — constant: same speed always (array index access). <code>O(log n)</code> — logarithmic: halves input each step (binary search). <code>O(n)</code> — linear: one pass through data (loop). <code>O(n log n)</code> — efficient sorting (merge sort). <code>O(n²)</code> — quadratic: nested loops, gets slow fast. <code>O(2ⁿ)</code> — exponential: avoid for large inputs. Always consider Big-O before writing loops.',
     quizzes:[
      {q:'What is the Big-O of accessing an array element by index?',opts:['O(n)','O(log n)','O(n²)','O(1)'],ans:3,exp:'Array index access is O(1) — constant time. It takes the same time for array[0] or array[1000000].'},
      {q:'Two nested loops over n elements gives which Big-O?',opts:['O(n)','O(2n)','O(n²)','O(log n)'],ans:2,exp:'Nested loops: n × n = O(n²). For n=1000, that\'s 1,000,000 operations. Avoid when possible.'},
      {q:'Binary search has which time complexity?',opts:['O(n)','O(log n)','O(n log n)','O(1)'],ans:1,exp:'Binary search halves the search space each step → O(log n). 1 million items needs only ~20 steps.'},
    ]},
    {id:'ch7p2',title:'Sorting Algorithms',
     text:'<strong>Bubble Sort</strong>: compare adjacent pairs, swap if out of order — O(n²) worst case. Simple but inefficient. <strong>Merge Sort</strong>: divide array in half, sort each half, merge — always O(n log n). Stable. <strong>Quick Sort</strong>: pick a pivot, partition around it, recurse — O(n log n) average, O(n²) worst. Very fast in practice. <strong>JavaScript\'s .sort()</strong> uses TimSort (hybrid merge+insertion) — O(n log n). For interviews: know all four, implement at least two.',
     quizzes:[
      {q:'What is Bubble Sort\'s worst-case time complexity?',opts:['O(n)','O(log n)','O(n log n)','O(n²)'],ans:3,exp:'Bubble Sort compares all adjacent pairs repeatedly — O(n²). Only use for tiny or nearly-sorted data.'},
      {q:'Which sort algorithm always runs at O(n log n) regardless of input?',opts:['Bubble Sort','Quick Sort','Merge Sort','Insertion Sort'],ans:2,exp:'Merge Sort is always O(n log n) — divides and conquers consistently regardless of input order.'},
      {q:'Quick Sort works by:',opts:['Comparing adjacent elements','Inserting one by one in order','Picking a pivot and partitioning around it','Building a heap'],ans:2,exp:'Quick Sort picks a pivot, puts smaller elements left and larger right, then recurses on each partition.'},
    ]},
    {id:'ch7p3',title:'Recursion',
     text:'Recursion is a function that calls itself with a smaller problem. It needs two things: a <strong>base case</strong> (the stopping condition) and a <strong>recursive case</strong> (the self-call). Example: <code>function factorial(n) { if(n===1) return 1; return n * factorial(n-1); }</code>. The base case is <code>n===1</code>. Without a base case, you get infinite recursion → stack overflow. Classic uses: tree traversal, Fibonacci, file system scanning, parsing nested structures.',
     quizzes:[
      {q:'What is the "base case" in recursion?',opts:['The first function call','The condition that STOPS recursion','A loop inside the function','The return value'],ans:1,exp:'The base case is the stopping condition. Without it, recursion never stops and causes stack overflow.'},
      {q:'What happens if you forget the base case in recursion?',opts:['Function returns undefined','Function runs once','Stack overflow — infinite recursion','Nothing, it works fine'],ans:2,exp:'Infinite recursion causes a stack overflow error — the call stack fills up completely and crashes.'},
      {q:'Which problem is naturally solved with recursion?',opts:['Sorting a flat list','Adding two numbers','Traversing a tree structure','Centering a div'],ans:2,exp:'Trees are naturally recursive: visit node, then recursively visit each child. Perfect match for recursion.'},
    ]},
  ]},

  {id:'ch8',num:8,title:'Data Structures Deep Dive',icon:'🗄️',level:'expert',col:'pu',
   desc:'Stacks, queues, linked lists, hash maps, trees — tools every engineer knows.',unlocked:false,
   paragraphs:[
    {id:'ch8p1',title:'Stacks and Queues',
     text:'A <strong>Stack</strong> is LIFO (Last In, First Out) — like a stack of plates. <code>push()</code> adds to top, <code>pop()</code> removes from top. Used in: browser back button, undo/redo, function call stack, expression parsing. A <strong>Queue</strong> is FIFO (First In, First Out) — like a queue at a store. Enqueue adds to back, Dequeue removes from front. Used in: task scheduling, print queues, BFS traversal. In JS: stack uses push/pop, queue uses push/shift.',
     quizzes:[
      {q:'A Stack follows which principle?',opts:['FIFO','LILO','LIFO','FILO'],ans:2,exp:'Stack = LIFO (Last In, First Out). The last item added is the first one removed.'},
      {q:'A Queue follows which principle?',opts:['LIFO','FIFO','LILO','Random'],ans:1,exp:'Queue = FIFO (First In, First Out). First item added is first to be removed — like a real queue.'},
      {q:'In JS, which array method simulates a Queue DEQUEUE?',opts:['.pop()','.push()','.shift()','.splice()'],ans:2,exp:'.shift() removes the FIRST element — simulates dequeue. .push() adds to end — simulates enqueue.'},
    ]},
    {id:'ch8p2',title:'Linked Lists',
     text:'A Linked List is a chain of nodes — each node holds data and a pointer to the next node. Unlike arrays, no indexes — you traverse from the <strong>head</strong>. <strong>Singly linked</strong>: each node points to next only. <strong>Doubly linked</strong>: each node points to both next and previous. Strength: inserting/deleting at the front is O(1) — no shifting needed. Weakness: accessing element at position n is O(n) — must traverse from head. Arrays are better for random access; linked lists for frequent front insertions.',
     quizzes:[
      {q:'Time complexity of inserting at the FRONT of a Linked List?',opts:['O(n)','O(n²)','O(log n)','O(1)'],ans:3,exp:'Inserting at the head is O(1) — just update the head pointer. No elements need to be shifted.'},
      {q:'What does each node in a linked list contain?',opts:['Only data','Only a pointer','Data AND a pointer to the next node','An index'],ans:2,exp:'Each node stores: the data (value) + a reference/pointer to the next node in the chain.'},
      {q:'Accessing element at position n in a Linked List is:',opts:['O(1)','O(log n)','O(n)','O(n²)'],ans:2,exp:'You must traverse from head node by node — O(n). This is why arrays are better for random access.'},
    ]},
    {id:'ch8p3',title:'Hash Maps and Trees',
     text:'A <strong>Hash Map</strong> maps keys to values via a hash function — average O(1) get/set/delete. JS objects and <code>Map</code> are hash maps. A <strong>Binary Search Tree (BST)</strong> stores values where left child < parent < right child, giving O(log n) search for balanced trees. A <strong>Min-Heap</strong> always keeps the minimum at root — used in priority queues. A <strong>Max-Heap</strong> keeps maximum at root. Heaps power Dijkstra\'s shortest path algorithm and sorting.',
     quizzes:[
      {q:'Average time complexity for Hash Map get/set?',opts:['O(n)','O(log n)','O(n²)','O(1)'],ans:3,exp:'Hash maps provide O(1) average for insert, delete, and lookup — extremely fast for large datasets.'},
      {q:'In a Binary Search Tree, where is a value LESS than root stored?',opts:['Right subtree','Root itself','Left subtree','Anywhere'],ans:2,exp:'BST rule: left < root < right. This ordering enables efficient O(log n) search by halving at each step.'},
      {q:'A Min-Heap guarantees the root is:',opts:['The maximum value','A random value','The minimum value','The median'],ans:2,exp:'A Min-Heap always keeps the minimum at root. Extracting the minimum is O(1) — very useful.'},
    ]},
  ]},

  {id:'ch9',num:9,title:'Modern Web & React',icon:'⚛️',level:'expert',col:'cy',
   desc:'Components, hooks, state management — build real-world applications.',unlocked:false,
   paragraphs:[
    {id:'ch9p1',title:'React Components & JSX',
     text:'React builds UIs from reusable components — JavaScript functions that return JSX (HTML-like syntax in JS). Example: <code>function Button({label}) { return &lt;button&gt;{label}&lt;/button&gt;; }</code>. Components accept <strong>props</strong> as inputs. JSX rules: one root element per component, use <code>className</code> not <code>class</code>, close ALL tags including <code>&lt;img /&gt;</code>, use <code>{expression}</code> to embed JavaScript. Components compose into trees — this is React\'s architecture.',
     quizzes:[
      {q:'What does JSX stand for?',opts:['JavaScript Extra','JavaScript XML','Java Syntax Extension','JSON Exchange'],ans:1,exp:'JSX = JavaScript XML. HTML-like syntax compiled to React.createElement() calls by tools like Babel.'},
      {q:'In JSX, what replaces the HTML "class" attribute?',opts:['cssClass','htmlClass','className','class'],ans:2,exp:'className replaces class because "class" is a reserved JavaScript keyword.'},
      {q:'What are React "props"?',opts:['Built-in styles','State variables','Inputs passed from parent to component','Server responses'],ans:2,exp:'Props (properties) are read-only inputs passed to components, making them reusable with different data.'},
    ]},
    {id:'ch9p2',title:'React Hooks',
     text:'Hooks let functional components use React features. <code>useState</code>: <code>const [count, setCount] = useState(0)</code> — first item is the value, second is the setter. Calling the setter triggers a re-render. <code>useEffect</code> runs after render for side effects: <code>useEffect(() => { fetchData(); }, [url])</code>. Dependency array <code>[]</code> = run once on mount. <code>[value]</code> = run when value changes. Rules: only call hooks at the top level of components — never inside conditions or loops.',
     quizzes:[
      {q:'What does useState return?',opts:['Just the value','Just the setter','An array: [value, setter]','An object with state'],ans:2,exp:'useState returns [currentValue, setterFunction]. Destructure: const [count, setCount] = useState(0).'},
      {q:'useEffect with empty [] dependency array runs:',opts:['On every render','When any state changes','Once after initial mount','Never'],ans:2,exp:'useEffect(() => {}, []) runs once after component mounts — equivalent to componentDidMount.'},
      {q:'Where MUST React hooks be called?',opts:['Inside if statements','Inside for loops','At the top level of a component','Anywhere'],ans:2,exp:'Hooks must be at the top level — never inside conditions, loops, or nested functions. React Rules of Hooks.'},
    ]},
    {id:'ch9p3',title:'State Management & Virtual DOM',
     text:'As apps grow, state management becomes critical. <code>useContext</code> shares state without prop drilling. <code>useReducer</code> handles complex state transitions. Large apps use Redux Toolkit or Zustand for global state. Performance: <code>useMemo(fn, deps)</code> caches expensive calculations, <code>useCallback(fn, deps)</code> memoizes functions, <code>React.memo(Component)</code> prevents re-renders if props haven\'t changed. React\'s <strong>Virtual DOM</strong> is a JS copy of the real DOM — React diffs changes and updates only what changed.',
     quizzes:[
      {q:'What problem does useContext solve?',opts:['Slow rendering','Prop drilling through many layers','Memory leaks','Async operations'],ans:1,exp:'useContext provides state directly to deeply nested components, avoiding passing props through every layer.'},
      {q:'What is React\'s Virtual DOM?',opts:['A real browser DOM','A JS copy of the DOM for efficient diffing','A CSS framework','A database'],ans:1,exp:'Virtual DOM is a lightweight JS representation. React compares it with real DOM and updates only changed parts.'},
      {q:'What does useMemo do?',opts:['Fetches data from APIs','Manages global state','Caches expensive calculation results','Creates element references'],ans:2,exp:'useMemo(fn, deps) caches the result, only recomputing when dependencies change — prevents expensive re-runs.'},
    ]},
  ]},

  {id:'ch10',num:10,title:'The Final Boss',icon:'👑',level:'master',col:'gn',
   desc:'All topics. All chapters. One ultimate test. Prove you\'ve mastered LearnO.',unlocked:false,
   paragraphs:[
    {id:'ch10p1',title:'Web Foundations Mastery',
     text:'The Final Boss tests everything from HTML structure to JavaScript internals. A true developer understands not just HOW to use tools but WHY they work. HTML provides structure, CSS provides presentation, JavaScript provides behaviour — the three pillars of the web. Every website you have ever visited was built with these. You have studied them all — semantics, the box model, event listeners, DOM manipulation. Now it is time to prove mastery.',
     quizzes:[
      {q:'The three core technologies of every webpage are:',opts:['Python, SQL, CSS','HTML, CSS, JavaScript','React, Node, MongoDB','PHP, MySQL, HTML'],ans:1,exp:'HTML (structure) + CSS (style) + JavaScript (behaviour) = the foundation of all web development.'},
      {q:'Which CSS property controls both ROWS and COLUMNS simultaneously?',opts:['display: flex','display: grid','display: table','display: block'],ans:1,exp:'CSS Grid controls two dimensions (rows AND columns). Flexbox handles one dimension at a time.'},
      {q:'What does "position: sticky" do?',opts:['Fixes to viewport always','Relative until scroll threshold then sticks','Removes from document flow','Centers the element'],ans:1,exp:'sticky acts like relative normally, but once you scroll past a threshold it sticks like fixed.'},
    ]},
    {id:'ch10p2',title:'JavaScript Deep End',
     text:'Closures, the event loop, prototypes — these separate script writers from engineers. A <strong>closure</strong> is a function that remembers variables from its enclosing scope even after that scope has finished executing. The <strong>event loop</strong> makes JavaScript non-blocking despite being single-threaded: sync code runs on the call stack, async callbacks wait in the task queue and run when the stack is empty. <strong>Prototypes</strong> are how objects inherit from other objects in JavaScript.',
     quizzes:[
      {q:'What is a closure?',opts:['A way to close the browser tab','A function retaining access to its outer scope','A method to end loops','An error type'],ans:1,exp:'A closure is a function that remembers variables from its enclosing scope even after the scope has ended.'},
      {q:'JavaScript\'s event loop allows it to be:',opts:['Multi-threaded','Synchronous only','Non-blocking despite single-threaded','Faster than C++'],ans:2,exp:'The event loop queues async callbacks. Sync code runs first, then callbacks run when the call stack empties.'},
      {q:'What does Array.reduce() do?',opts:['Removes elements from array','Reduces array to a single value via accumulator','Finds the minimum value','Sorts the array'],ans:1,exp:'reduce((acc, curr) => acc + curr, 0) accumulates all elements into one final value.'},
    ]},
    {id:'ch10p3',title:'Systems Thinking — The Master Level',
     text:'Senior developers think in systems. They consider Big-O before writing loops, plan accessibility before adding images, design component architecture before writing functions. They know: a React component does ONE thing, a database query inside a loop is always wrong (N+1 problem), semantic HTML is not optional. They write code for the developer who comes after them — not just for the machine. You started from zero. You studied HTML, CSS, JavaScript, algorithms, data structures, and React. That journey is what LearnO was built for.',
     quizzes:[
      {q:'What is the "N+1 problem" in databases?',opts:['Database has N+1 tables','Running one query per item in a list instead of one batch query','Having more than N columns','A specific SQL error'],ans:1,exp:'N+1: fetching a list (1 query) then querying each item separately (N queries) = N+1 total. Always batch.'},
      {q:'A well-designed React component should:',opts:['Handle all app logic','Do one thing well (Single Responsibility)','Contain as much state as possible','Never accept props'],ans:1,exp:'Single Responsibility Principle: each component does one thing. Split large components for reusability.'},
      {q:'What best describes a senior developer mindset?',opts:['Write the cleverest possible code','Write fast to type code','Write readable, maintainable code','Write fewest lines possible'],ans:2,exp:'Code is read far more than written. Clarity and maintainability are the highest priorities.'},
    ]},
  ]},
];

// Build flat quiz banks
const CHAPTER_QQ = {};
// Load any previously saved custom chapters into CHAPTERS on startup
(function() {
  var saved = JSON.parse(localStorage.getItem('learno-custom-chapters') || '[]');
  saved.forEach(function(cc) {
    cc.unlocked = true;
    CHAPTERS.push(cc);
  });
})();
CHAPTERS.forEach(ch => {
  CHAPTER_QQ[ch.id] = ch.paragraphs.flatMap(p => p.quizzes.map(q => ({...q, chapter:ch.id, para:p.id})));
});
const ALL_CHAPTER_QS = CHAPTERS.flatMap(ch =>
  ch.paragraphs.flatMap(p => p.quizzes.map(q => ({...q, chapter:ch.id})))
);



const PUZZLES=[
  {id:'fl',title:'🐛 Fix the Infinite Loop',desc:'This loop runs forever — find and fix the bug!',diff:'easy',xp:100,
   start:`// FIX THE BUG: This loop never ends!\nfunction countDown(n) {\n  let i = n;\n  while (i > 0) {\n    console.log(i);\n    // Something is missing here...\n  }\n  console.log("Done!");\n}\ncountDown(5);`,
   hint:'The loop variable never changes. How do you decrease i by 1 each iteration?',
   test:c=>c.includes('i--')||c.includes('i-=1')||c.includes('i = i - 1'),solved:false},
  {id:'pal',title:'🔤 Palindrome Checker',desc:'Complete the function to check if a string is a palindrome.',diff:'med',xp:200,
   start:`// Complete this function!\n// "racecar" → true, "hello" → false\n\nfunction isPalindrome(str) {\n  // Your code here...\n  \n}\n\nconsole.log(isPalindrome("racecar")); // true\nconsole.log(isPalindrome("hello"));   // false`,
   hint:'Try: str.split("").reverse().join("") then compare with original.',
   test:c=>c.includes('reverse')||(c.includes('for')&&c.includes('length')),solved:false},
  {id:'fb',title:'🔢 FizzBuzz Classic',desc:'Print 1–20. Multiples of 3 → "Fizz", of 5 → "Buzz", both → "FizzBuzz".',diff:'easy',xp:80,
   start:`// Classic FizzBuzz!\nfor (let i = 1; i <= 20; i++) {\n  // Your code here...\n  \n}`,
   hint:'Use % to check divisibility. Always check FizzBuzz (3 AND 5) first!',
   test:c=>c.includes('FizzBuzz')&&c.includes('Fizz')&&c.includes('Buzz')&&c.includes('%'),solved:false},
  {id:'flt',title:'🌀 Array Flattener',desc:'Flatten a nested array: [[1,2],[3,4]] → [1,2,3,4].',diff:'hard',xp:300,
   start:`function flatten(arr) {\n  // Your code here...\n  \n}\n\nconsole.log(flatten([[1,2],[3,4],[5]]));`,
   hint:'Try: arr.reduce((acc, val) => acc.concat(val), [])  or  [].concat(...arr)',
   test:c=>c.includes('reduce')||c.includes('concat')||c.includes('.flat'),solved:false},
  {id:'db',title:'⏱️ Debounce Function',desc:'Implement debounce: delay execution until N ms after last call.',diff:'hard',xp:400,
   start:`function debounce(fn, delay) {\n  // Your code here...\n  \n}\n\nconst log = debounce(() => console.log("Called!"), 300);\nlog(); log(); log(); // Should only log ONCE`,
   hint:'You need a variable to hold the timer. Use setTimeout and clearTimeout.',
   test:c=>c.includes('setTimeout')&&c.includes('clearTimeout'),solved:false},
];



const LBDATA=[]; // real players only from Supabase // real players only from Supabase

const ACH=[
  // id, icon, name, desc, xpReward, condition description, unlocked
  {id:'first_blood',   icon:'🚀', name:'FIRST BLOOD',     desc:'Answer all 3 quizzes correctly in a single paragraph section',   xp:50,  ul:false, rarity:'common'},
  {id:'on_fire',       icon:'🔥', name:'ON FIRE',          desc:'Get 5 quiz answers correct in a row without a single mistake',     xp:75,  ul:false, rarity:'common'},
  {id:'perfect',       icon:'💯', name:'PERFECTIONIST',    desc:'Score 100% on any full chapter quiz tab',                           xp:100, ul:false, rarity:'rare'},
  {id:'puzzle_breaker',icon:'🧩', name:'PUZZLE BREAKER',   desc:'Solve your first code puzzle successfully',                         xp:60,  ul:false, rarity:'common'},
  {id:'speed_coder',   icon:'⚡', name:'SPEED CODER',      desc:'Complete a full quiz in under 60 seconds',                          xp:80,  ul:false, rarity:'rare'},
  {id:'top3',          icon:'🏆', name:'PODIUM FINISH',    desc:'Reach the top 3 on the leaderboard',                               xp:120, ul:false, rarity:'rare'},
  {id:'scholar',       icon:'🎓', name:'SCHOLAR',          desc:'Complete all 3 sections of any single chapter',                    xp:100, ul:false, rarity:'common'},
  {id:'diamond',       icon:'💎', name:'DIAMOND',          desc:'Earn 1000+ total XP — a true learner',                             xp:150, ul:false, rarity:'epic'},
  {id:'chapter_master',icon:'📖', name:'CHAPTER MASTER',   desc:'Complete 3 full chapters (all sections done)',                     xp:200, ul:false, rarity:'epic'},
  {id:'snake_charmer', icon:'🐍', name:'SNAKE CHARMER',    desc:'Reach level 3 in Snake Quest',                                     xp:80,  ul:false, rarity:'rare'},
  {id:'tower_lord',    icon:'🏗️', name:'TOWER LORD',       desc:'Stack 10 or more blocks in Tower Build',                           xp:100, ul:false, rarity:'rare'},
  {id:'memory_king',   icon:'🔮', name:'MEMORY KING',      desc:'Complete Code Memory in under 20 moves',                           xp:80,  ul:false, rarity:'rare'},
  {id:'streak_god',    icon:'⚔️', name:'STREAK GOD',        desc:'Maintain a 10-answer correct streak at any point',                xp:150, ul:false, rarity:'epic'},
  {id:'completionist', icon:'👑', name:'COMPLETIONIST',    desc:'Unlock every other badge — the ultimate achievement',              xp:500, ul:false, rarity:'legendary'},
];



// ── STATE ──
const ST={xp:0,lv:1,streak:0,quiz:{topic:null,qs:[],idx:0,ans:false,score:0,t0:0},puzzles:JSON.parse(JSON.stringify(PUZZLES)),ach:JSON.parse(JSON.stringify(ACH)),ap:null};


// ── XP ──
// addXP defined in backend
function updXP(){const p=(ST.xp%500)/500*100;document.getElementById('xf').style.width=p+'%';document.getElementById('xt').textContent=ST.xp;document.getElementById('lvl').textContent=ST.lv;}
function toast(n,lbl){const t=document.createElement('div');t.className='xpt';t.textContent=`+${n} XP${lbl?' — '+lbl:''}`;document.body.appendChild(t);setTimeout(()=>t.remove(),2000);}



// ── CHAPTER STATE ──
const CH_STATE = {
  completedParas: new Set(),    // "ch1p1", "ch1p2" etc
  completedChapters: new Set(), // "ch1", "ch2" etc
};

// ── UNLOCK LOGIC ──
function computeUnlocks(){
  // Custom vault chapters always stay unlocked — skip them
  CHAPTERS.forEach(ch => { if (!ch.id || !ch.id.startsWith('custom-')) ch.unlocked = false; });

  const lvl = USER_LEVEL;
  const done = CH_STATE.completedChapters;

  // Ch 1-3: always unlocked (newbie base)
  CHAPTERS[0].unlocked = true;
  CHAPTERS[1].unlocked = true;
  CHAPTERS[2].unlocked = true;

  // Ch 4-6: unlock if mediocre/expert OR newbie who finished ch1+ch2+ch3
  const newbieGrad = done.has('ch1') && done.has('ch2') && done.has('ch3');
  const med = lvl >= 2 || newbieGrad;
  CHAPTERS[3].unlocked = med;
  CHAPTERS[4].unlocked = med;
  CHAPTERS[5].unlocked = med;

  // Ch 7-9: unlock if expert OR mediocre who finished ch4+ch5+ch6
  const mediocreGrad = done.has('ch4') && done.has('ch5') && done.has('ch6');
  const exp = lvl >= 3 || mediocreGrad;
  CHAPTERS[6].unlocked = exp;
  CHAPTERS[7].unlocked = exp;
  CHAPTERS[8].unlocked = exp;

  // Ch 10: unlock after finishing ch7+ch8+ch9 (all levels)
  const expertGrad = done.has('ch7') && done.has('ch8') && done.has('ch9');
  CHAPTERS[9].unlocked = expertGrad;
}

// ── EXPERIENCE SELECTOR SCREEN ──
function showExperienceSelector(){
  document.querySelectorAll('.scr').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.ntabs button').forEach(b => b.classList.remove('active'));
  document.getElementById('s-learn').classList.add('active');
  document.getElementById('tb-learn').classList.add('active');

  const mg = document.getElementById('mg');
  mg.innerHTML = '';

  const wrap = document.createElement('div');
  wrap.id = 'exp-selector';
  wrap.style.cssText = 'width:100%;max-width:900px;margin:0 auto;padding:2rem 2rem 4rem;display:flex;flex-direction:column;align-items:center;';
  wrap.innerHTML = `
    <div class="sh" style="padding:1.5rem 0 2rem;text-align:center;width:100%">
      <h2 class="st">SELECT YOUR <span>EXPERIENCE</span></h2>
      <p class="ss">Choose your level — we'll tailor your learning path</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.6rem;width:100%;max-width:840px;margin:0 auto;">
      ${[
        {lvl:1, icon:'🌱', name:'NEWBIE', tag:'Starting from zero', desc:'I\'m new to coding. Never written a line. Ready to start from absolute scratch.', color:'#27c93f'},
        {lvl:2, icon:'⚙️', name:'MEDIOCRE', tag:'Some experience', desc:'I\'ve touched HTML/CSS/JS before. Know the basics but want to go deeper.', color:'#c9a84c'},
        {lvl:3, icon:'🔥', name:'EXPERT', tag:'You know the basics', desc:'I know web fundamentals well. I want algorithms, data structures, React, and advanced concepts.', color:'#e05252'},
      ].map(e => `
        <div class="exp-card" onclick="selectExperience(${e.lvl})" style="
          background:linear-gradient(145deg,#13110a,#0f0d02);
          border:2px solid rgba(201,168,76,.2);
          border-radius:16px;padding:2.4rem 1.8rem;
          cursor:pointer;text-align:center;
          transition:all .3s cubic-bezier(.22,.9,.36,1);
          position:relative;overflow:hidden;
        "
        onmouseover="this.style.transform='translateY(-8px) scale(1.02)';this.style.borderColor='${e.color}80';this.style.boxShadow='0 20px 50px rgba(0,0,0,.7),0 0 30px ${e.color}30';"
        onmouseout="this.style.transform='';this.style.borderColor='rgba(201,168,76,.2)';this.style.boxShadow='';"
        >
          <div style="font-size:3.8rem;margin-bottom:1rem;filter:drop-shadow(0 0 12px ${e.color}80);animation:gc-bob 3s ease-in-out infinite;">${e.icon}</div>
          <div style="font-family:'Cinzel Decorative',serif;font-size:1.15rem;font-weight:900;color:${e.color};margin-bottom:.3rem;text-shadow:0 0 14px ${e.color}60;">${e.name}</div>
          <div style="font-family:'Cinzel',serif;font-size:.62rem;color:rgba(201,168,76,.6);letter-spacing:2px;margin-bottom:.8rem;text-transform:uppercase;">${e.tag}</div>
          <div style="font-size:.82rem;color:var(--td);line-height:1.6;">${e.desc}</div>
          <div style="margin-top:1.2rem;font-family:'Cinzel',serif;font-size:.65rem;color:${e.color};letter-spacing:1px;border:1px solid ${e.color}40;border-radius:99px;padding:.3rem .8rem;display:inline-block;">SELECT →</div>
        </div>
      `).join('')}
    </div>
  `;
  mg.appendChild(wrap);

  // Animate cards in
  setTimeout(() => {
    const cards = wrap.querySelectorAll('.exp-card');
    cards.forEach((c, i) => {
      c.style.opacity = '0';
      c.style.transform = 'translateY(30px)';
      setTimeout(() => {
        c.style.transition = 'opacity .5s ease, transform .5s ease, border-color .3s, box-shadow .3s';
        c.style.opacity = '1';
        c.style.transform = 'translateY(0)';
      }, i * 150);
    });
  }, 50);
}

function selectExperience(lvl){
  USER_LEVEL = lvl;
  localStorage.setItem('learno-level', lvl);
  computeUnlocks();

  // Celebration flash
  const names = ['', 'Newbie', 'Mediocre', 'Expert'];
  const icons = ['', '🌱', '⚙️', '🔥'];
  const msgs = [
    '',
    'Welcome, Newbie! Your journey starts now. Chapter 1 is open — let\'s go!',
    'Welcome back! Chapters 1–6 are ready for you. Prove that experience!',
    'Expert mode activated! All 9 chapters unlocked. Chapter 10 awaits your mastery.',
  ];
  showM(icons[lvl], names[lvl] + ' Mode!', msgs[lvl], '', () => {
    rLearnScreen();
  });
}

// ── LEARN SCREEN (chapter list) ──
function rLearnScreen(){
  const mg = document.getElementById('mg');
  mg.innerHTML = '';

  // If level not set, show experience selector
  if(!USER_LEVEL){
    showExperienceSelector();
    return;
  }

  computeUnlocks();

  const wrap = document.createElement('div');
  wrap.style.cssText = 'width:100%;max-width:1200px;margin:0 auto;padding:2rem 3rem 4rem;display:block;';

  // Level badge + change level option
  const lvlColors = ['','#27c93f','#c9a84c','#e05252'];
  const lvlNames = ['','🌱 NEWBIE','⚙️ MEDIOCRE','🔥 EXPERT'];
  wrap.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.8rem;flex-wrap:wrap;gap:.8rem;width:100%;">
      <div>
        <div style="font-family:'Cinzel',serif;font-size:.65rem;color:var(--td);letter-spacing:3px;margin-bottom:.3rem;">YOUR LEVEL</div>
        <div style="font-family:'Cinzel Decorative',serif;font-size:1rem;font-weight:900;color:${lvlColors[USER_LEVEL]};text-shadow:0 0 14px ${lvlColors[USER_LEVEL]}60;">${lvlNames[USER_LEVEL]}</div>
      </div>
      <button onclick="USER_LEVEL=0;localStorage.removeItem('learno-level');showExperienceSelector();" style="font-family:'Cinzel',serif;font-size:.65rem;padding:.4rem 1rem;background:none;border:1px solid rgba(201,168,76,.3);color:var(--td);border-radius:99px;cursor:pointer;letter-spacing:1px;">↺ CHANGE LEVEL</button>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1.4rem;width:100%;" id="chapter-grid"></div>
  `;
  mg.appendChild(wrap);

  const grid = document.getElementById('chapter-grid');

  CHAPTERS.forEach(ch => {
    const done = CH_STATE.completedChapters.has(ch.id);
    const parasDone = ch.paragraphs.filter(p => CH_STATE.completedParas.has(p.id)).length;
    const total = ch.paragraphs.length;
    const pct = Math.round(parasDone / total * 100);

    const levelColors = {newbie:'#27c93f', mediocre:'#c9a84c', expert:'#e05252', master:'#f0d080'};
    const levelLabels = {newbie:'NEWBIE', mediocre:'MEDIOCRE', expert:'EXPERT', master:'MASTER'};
    const lc = levelColors[ch.level];

    const card = document.createElement('div');
    card.style.cssText = `
      background:linear-gradient(145deg,#13110a,#0f0d02);
      border:1px solid ${ch.unlocked ? 'rgba(201,168,76,.3)' : 'rgba(255,255,255,.06)'};
      border-radius:4px;padding:1.4rem;
      cursor:${ch.unlocked ? 'pointer' : 'default'};
      transition:all .25s cubic-bezier(.22,.9,.36,1);
      position:relative;overflow:hidden;
      opacity:${ch.unlocked ? '1' : '0.45'};
    `;
    card.innerHTML = `
      <div style="position:absolute;top:0;left:0;right:0;height:3px;background:${ch.unlocked ? `linear-gradient(90deg,${lc},${lc}aa)` : 'rgba(255,255,255,.08)'};"></div>
      <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:.7rem;">
        <div>
          <div style="font-family:'Cinzel',serif;font-size:.6rem;color:${lc};letter-spacing:2px;margin-bottom:.2rem;">CHAPTER ${ch.num} · ${levelLabels[ch.level]}</div>
          <div style="font-size:1.6rem;">${ch.icon}</div>
        </div>
        <div style="font-family:'Cinzel Decorative',serif;font-size:1.6rem;font-weight:900;color:rgba(201,168,76,.15);">${String(ch.num).padStart(2,'0')}</div>
      </div>
      <div style="font-family:'Cinzel Decorative',serif;font-size:.9rem;font-weight:700;color:${ch.unlocked ? 'var(--ny)' : 'var(--td)'};margin-bottom:.35rem;">${ch.title}</div>
      <div style="font-size:.78rem;color:var(--td);line-height:1.5;margin-bottom:.9rem;">${ch.desc}</div>
      ${ch.unlocked ? `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.5rem;">
          <span style="font-family:'Cinzel',serif;font-size:.62rem;color:var(--td);">${parasDone}/${total} SECTIONS</span>
          <span style="font-family:'Cinzel',serif;font-size:.62rem;color:${lc};">${done ? '✅ COMPLETE' : pct + '%'}</span>
        </div>
        <div style="height:4px;background:rgba(255,255,255,.07);border-radius:99px;overflow:hidden;">
          <div style="height:100%;width:${pct}%;background:${lc};border-radius:99px;transition:width 1s ease;box-shadow:0 0 8px ${lc}80;"></div>
        </div>
      ` : `
        <div style="font-family:'Cinzel',serif;font-size:.65rem;color:rgba(255,255,255,.25);letter-spacing:1px;">
          🔒 ${getUnlockHint(ch)}
        </div>
      `}
    `;
    if(ch.unlocked){
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-6px) scale(1.01)';
        card.style.borderColor = `${lc}80`;
        card.style.boxShadow = `0 20px 50px rgba(0,0,0,.7),0 0 30px ${lc}15`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.borderColor = 'rgba(201,168,76,.3)';
        card.style.boxShadow = '';
      });
      card.addEventListener('click', () => openChapter(ch.id));
    }
    grid.appendChild(card);
  });
}

function getUnlockHint(ch){
  if(ch.level === 'mediocre') return 'Complete Chapters 1–3 or select Mediocre/Expert level';
  if(ch.level === 'expert') return 'Complete Chapters 4–6 or select Expert level';
  if(ch.level === 'master') return 'Complete Chapters 7–9 to unlock the Final Boss';
  return 'Locked';
}

// ── OPEN CHAPTER (paragraphs view) ──
function openChapter(chId){
  const ch = CHAPTERS.find(c => c.id === chId);
  if(!ch || !ch.unlocked) return;

  const mg = document.getElementById('mg');
  mg.innerHTML = '';

  const wrap = document.createElement('div');
  wrap.style.cssText = 'width:100%;max-width:840px;margin:0 auto;padding:2rem 3rem 4rem;display:block;';

  const levelColors = {newbie:'#27c93f', mediocre:'#c9a84c', expert:'#e05252', master:'#f0d080'};
  const lc = levelColors[ch.level];

  wrap.innerHTML = `
    <div style="display:flex;align-items:center;gap:.8rem;margin-bottom:1.8rem;">
      <button onclick="rLearnScreen()" style="font-family:'Cinzel',serif;font-size:.7rem;background:none;border:1px solid rgba(255,255,255,.15);color:var(--td);padding:.38rem .85rem;border-radius:6px;cursor:pointer;">← BACK</button>
      <div>
        <div style="font-family:'Cinzel',serif;font-size:.6rem;color:${lc};letter-spacing:2px;">CHAPTER ${ch.num}</div>
        <div style="font-family:'Cinzel Decorative',serif;font-size:1.1rem;color:var(--ny);">${ch.icon} ${ch.title}</div>
      </div>
    </div>
    <div id="paras-container"></div>
  `;
  mg.appendChild(wrap);

  const container = document.getElementById('paras-container');

  ch.paragraphs.forEach((para, pi) => {
    const done = CH_STATE.completedParas.has(para.id);
    const paraDiv = document.createElement('div');
    paraDiv.id = 'para-' + para.id;
    paraDiv.style.cssText = `
      background:linear-gradient(145deg,#13110a,#0f0d02);
      border:1px solid rgba(201,168,76,.18);
      border-radius:12px;padding:1.6rem;margin-bottom:1.2rem;
      transition:border-color .3s;
    `;
    paraDiv.innerHTML = `
      <div style="display:flex;align-items:center;gap:.7rem;margin-bottom:1rem;">
        <div style="font-family:'Cinzel Decorative',serif;font-size:1.4rem;font-weight:900;color:rgba(201,168,76,.12);">P${pi+1}</div>
        <div>
          <div style="font-family:'Cinzel Decorative',serif;font-size:.88rem;color:var(--ny);">${para.title}</div>
          ${done ? '<div style="font-family:\'Cinzel\',serif;font-size:.6rem;color:#27c93f;letter-spacing:1px;">✅ COMPLETED</div>' : ''}
        </div>
      </div>
      <div style="font-size:.9rem;line-height:1.85;color:var(--tm);margin-bottom:1.4rem;padding:.9rem 1rem;background:rgba(201,168,76,.04);border-left:3px solid ${lc}40;border-radius:0 8px 8px 0;">${para.text}</div>
      <div style="font-family:'Cinzel',serif;font-size:.72rem;color:${lc};letter-spacing:2px;margin-bottom:.9rem;">📝 QUIZ — ANSWER ALL 3</div>
      <div id="quizzes-${para.id}"></div>
    `;
    container.appendChild(paraDiv);
    renderParaQuizzes(para, ch, lc);
  });
}

function renderParaQuizzes(para, ch, lc){
  const container = document.getElementById('quizzes-' + para.id);
  if(!container) return;

  const state = { answered: new Array(para.quizzes.length).fill(false), correct: 0 };
  container.innerHTML = '';

  para.quizzes.forEach((quiz, qi) => {
    const qDiv = document.createElement('div');
    qDiv.id = `q-${para.id}-${qi}`;
    qDiv.style.cssText = 'background:rgba(0,0,0,.25);border-radius:10px;padding:1rem;margin-bottom:.8rem;';
    qDiv.innerHTML = `
      <div style="font-size:.88rem;font-weight:700;margin-bottom:.8rem;line-height:1.5;">Q${qi+1}. ${quiz.q}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;" id="opts-${para.id}-${qi}">
        ${quiz.opts.map((opt, oi) => `
          <button
            onclick="answerParaQ('${para.id}',${qi},${oi},'${ch.id}')"
            id="opt-${para.id}-${qi}-${oi}"
            style="
              font-family:'Crimson Pro',serif;font-size:.82rem;
              padding:.6rem .8rem;border-radius:8px;text-align:left;cursor:pointer;
              border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);
              color:var(--tm);transition:all .18s;display:flex;align-items:center;gap:.5rem;
            "
            onmouseover="if(!this.disabled){this.style.borderColor='${lc}80';this.style.background='${lc}15';}"
            onmouseout="if(!this.disabled&&!this.classList.contains('correct')&&!this.classList.contains('wrong')){this.style.borderColor='rgba(255,255,255,.1)';this.style.background='rgba(255,255,255,.04)';}"
          >
            <span style="font-family:'Cinzel',serif;font-size:.65rem;color:var(--ny);min-width:1rem;">${['A','B','C','D'][oi]}</span>
            ${opt}
          </button>
        `).join('')}
      </div>
      <div id="fb-${para.id}-${qi}" style="display:none;margin-top:.7rem;padding:.7rem .9rem;border-radius:8px;font-size:.8rem;line-height:1.5;"></div>
    `;
    container.appendChild(qDiv);
  });

  // Completion button (hidden until all answered)
  const btnDiv = document.createElement('div');
  btnDiv.id = `complete-${para.id}`;
  btnDiv.style.display = 'none';
  btnDiv.innerHTML = `
    <button onclick="completePara('${para.id}','${ch.id}')" style="
      font-family:'Cinzel Decorative',serif;font-size:.75rem;font-weight:700;letter-spacing:1.5px;
      padding:.7rem 2rem;background:linear-gradient(135deg,#27c93f,#2ee844);
      border:none;border-radius:8px;color:#040300;cursor:pointer;
      box-shadow:0 4px 20px rgba(39,201,63,.4);transition:all .2s;margin-top:.5rem;
    "
    onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 30px rgba(39,201,63,.6)';"
    onmouseout="this.style.transform='';this.style.boxShadow='0 4px 20px rgba(39,201,63,.4)';"
    >✓ SECTION COMPLETE — CLAIM XP</button>
  `;
  container.appendChild(btnDiv);

  // Store state on the container
  container._state = state;
  container._total = para.quizzes.length;
}

function answerParaQ(paraId, qi, chosen, chId){
  const para = CHAPTERS.flatMap(c => c.paragraphs).find(p => p.id === paraId);
  const quiz = para.quizzes[qi];
  const correct = chosen === quiz.ans;

  // Disable all options for this question
  for(let i = 0; i < quiz.opts.length; i++){
    const btn = document.getElementById(`opt-${paraId}-${qi}-${i}`);
    if(!btn) continue;
    btn.disabled = true;
    btn.onmouseover = null;
    btn.onmouseout = null;
    if(i === quiz.ans){
      btn.style.borderColor = '#27c93f';
      btn.style.background = 'rgba(39,201,63,.15)';
      btn.style.color = '#27c93f';
    } else if(i === chosen && !correct){
      btn.style.borderColor = '#e05252';
      btn.style.background = 'rgba(224,82,82,.12)';
      btn.style.color = '#e88f8f';
    }
  }

  // Show feedback
  const fb = document.getElementById(`fb-${paraId}-${qi}`);
  if(fb){
    fb.style.display = 'block';
    if(correct){
      fb.style.background = 'rgba(39,201,63,.1)';
      fb.style.border = '1px solid rgba(39,201,63,.35)';
      fb.style.color = '#2ee844';
      fb.innerHTML = '✅ Correct! — ' + quiz.exp;
      addXP(15, 'Chapter quiz');
    } else {
      fb.style.background = 'rgba(224,82,82,.1)';
      fb.style.border = '1px solid rgba(224,82,82,.3)';
      fb.style.color = '#e88f8f';
      fb.innerHTML = '❌ Not quite. — ' + quiz.exp;
    }
  }

  // Track completion
  const container = document.getElementById('quizzes-' + paraId);
  if(container && container._state){
    container._state.answered[qi] = true;
    if(correct) container._state.correct++;
    // Check streak badge
    checkBadge_streak(ST.streak);
    const allDone = container._state.answered.every(Boolean);
    if(allDone){
      const completeBtn = document.getElementById('complete-' + paraId);
      if(completeBtn) completeBtn.style.display = 'block';
      // Fire first_blood if all answers were correct
      const allCorrect = container._state.correct === container._total;
      if(allCorrect) checkBadge_firstBlood(true);
    }
  }
}

function completePara(paraId, chId){
  CH_STATE.completedParas.add(paraId);

  // Check if all paras in chapter done
  const ch = CHAPTERS.find(c => c.id === chId);
  const allParasDone = ch.paragraphs.every(p => CH_STATE.completedParas.has(p.id));
  if(allParasDone && !CH_STATE.completedChapters.has(chId)){
    CH_STATE.completedChapters.add(chId);
    computeUnlocks();
    addXP(100, `Chapter ${ch.num} Complete!`);
    spawnC();
    checkBadge_scholar(CH_STATE.completedChapters.size);
    showM('🏆', 'Chapter Complete!',
      `You finished "${ch.title}"! New chapters may have unlocked.`,
      '+100 XP bonus', () => { rLearnScreen(); });
  } else {
    addXP(30, 'Section complete');
    // Refresh the para to show completed state
    const paraDiv = document.getElementById('para-' + paraId);
    if(paraDiv){
      const titleArea = paraDiv.querySelector('div > div > div:nth-child(2)');
      if(titleArea && !titleArea.querySelector('.done-badge')){
        const badge = document.createElement('div');
        badge.className = 'done-badge';
        badge.style.cssText = "font-family:'Cinzel',serif;font-size:.6rem;color:#27c93f;letter-spacing:1px;margin-top:.2rem;";
        badge.textContent = '✅ COMPLETED';
        titleArea.appendChild(badge);
      }
    }
    const btn = document.getElementById('complete-' + paraId);
    if(btn) btn.style.display = 'none';
  }
}

// ── UPDATED gS to trigger experience selector on first learn visit ──
function gS(name){
  document.querySelectorAll('.scr').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.ntabs button').forEach(b => b.classList.remove('active'));
  document.getElementById('s-'+name).classList.add('active');
  const tb = document.getElementById('tb-'+name);
  if(tb) tb.classList.add('active');

  if(name === 'learn'){
    if(!USER_PROFILE.name){ showProfileSetup(); return; }
    if(!USER_LEVEL) showExperienceSelector();
    else rLearnScreen();
  }
  if(name === 'quiz') rQTopics();
  if(name === 'kmap') initKnowledgeMap();
  if(name === 'puzzle'){ showPL(); rPL(); }
  if(name === 'lb') rLB();
  if(name === 'ach') rAch();
  if(name === 'games') rGames();
  if(name === 'vault') initVaultOnFirstOpen();
}

// ── UPDATED QUIZ TOPICS — uses chapters ──
function rQTopics(){
  const topics = [
    {id:'ch1',icon:'🌱',label:'The Web Begins',c:'#27c93f'},
    {id:'ch2',icon:'🎨',label:'Style Your World',c:'#e8c97a'},
    {id:'ch3',icon:'⚡',label:'JavaScript Awakens',c:'#f0d080'},
    {id:'ch4',icon:'🏗️',label:'Semantic Web',c:'#d4af37'},
    {id:'ch5',icon:'✨',label:'CSS Mastery',c:'#c9a84c'},
    {id:'ch6',icon:'🔧',label:'JS Intermediate',c:'#b8922a'},
    {id:'ch7',icon:'🧠',label:'Algorithms',c:'#e05252'},
    {id:'ch8',icon:'🗄️',label:'Data Structures',c:'#9b59b6'},
    {id:'ch9',icon:'⚛️',label:'React',c:'#61dafb'},
    {id:'ch10',icon:'👑',label:'Final Boss',c:'#f0d080'},
  ];

  document.getElementById('qtg').innerHTML = topics.map(t => {
    const ch = CHAPTERS.find(c => c.id === t.id);
    const locked = ch && !ch.unlocked;
    return `
      <div onclick="${locked ? '' : `sQ('${t.id}')`}" style="
        background:var(--cb);border:1px solid ${locked ? 'rgba(255,255,255,.06)' : 'var(--cbo)'};
        border-radius:12px;padding:1.4rem;text-align:center;
        cursor:${locked ? 'default' : 'pointer'};
        transition:all .2s;opacity:${locked ? '0.4' : '1'};
        ${locked ? '' : `onmouseover="this.style.borderColor='${t.c}';this.style.transform='translateY(-4px)'"  onmouseout="this.style.borderColor='';this.style.transform=''"`}
      "
      ${locked ? '' : `onmouseover="this.style.borderColor='${t.c}80';this.style.transform='translateY(-4px)';" onmouseout="this.style.borderColor='var(--cbo)';this.style.transform='';"`}
      >
        <div style="font-size:2rem;margin-bottom:.45rem;">${t.icon}</div>
        <div style="font-family:'Cinzel Decorative',serif;font-size:.82rem;font-weight:700;color:${locked ? 'var(--td)' : t.c};">${t.label}</div>
        <div style="font-size:.7rem;color:var(--td);margin-top:.25rem;font-family:'Cinzel',serif;">
          ${locked ? '🔒 LOCKED' : (CHAPTER_QQ[t.id] ? CHAPTER_QQ[t.id].length + ' QUESTIONS' : '0 QUESTIONS')}
        </div>
      </div>
    `;
  }).join('');

  // Append custom chapters from vault
  var customHTML = CHAPTERS.filter(function(c){ return c.id && c.id.startsWith('custom-'); }).map(function(c) {
    return '<div onclick="sQ(\'' + c.id + '\')" style="' +
      'background:linear-gradient(145deg,rgba(201,168,76,.08),rgba(184,146,42,.04));' +
      'border:1px solid rgba(201,168,76,.35);border-radius:12px;padding:1.4rem;text-align:center;' +
      'cursor:pointer;transition:all .2s;position:relative;" ' +
      'onmouseover="this.style.borderColor=\'#c9a84c\';this.style.transform=\'translateY(-4px)\';" ' +
      'onmouseout="this.style.borderColor=\'rgba(201,168,76,.35)\';this.style.transform=\'\';">' +
      '<div style="position:absolute;top:.4rem;right:.5rem;font-family:Cinzel,serif;font-size:.52rem;' +
        'background:rgba(201,168,76,.15);border:1px solid rgba(201,168,76,.3);color:#c9a84c;' +
        'padding:.1rem .45rem;border-radius:99px;letter-spacing:1px;">VAULT</div>' +
      '<div style="font-size:2rem;margin-bottom:.45rem;">' + c.icon + '</div>' +
      '<div style="font-family:Cinzel Decorative,serif;font-size:.82rem;font-weight:700;color:#f0d080;">' + c.title + '</div>' +
      '<div style="font-size:.7rem;color:#9a8660;margin-top:.25rem;font-family:Cinzel,serif;">' +
        (CHAPTER_QQ[c.id] ? CHAPTER_QQ[c.id].length + ' QUESTIONS' : '9 QUESTIONS') +
      '</div>' +
    '</div>';
  }).join('');

  if (customHTML) {
    document.getElementById('qtg').innerHTML += customHTML;
  }

  document.getElementById('qts').style.display = 'block';
  document.getElementById('qa').style.display = 'none';
}

function sQ(topic){
  const qs = CHAPTER_QQ[topic] ? [...CHAPTER_QQ[topic]].sort(()=>Math.random()-.5) : [];
  if(!qs.length){ showM('⚠️','No Questions','This chapter has no quiz questions yet.','',()=>{}); return; }
  ST.quiz = {topic, qs, idx:0, ans:false, score:0, t0:Date.now()};
  const topicLabel = CHAPTERS.find(c=>c.id===topic)?.title || topic;
  ST.quiz.label = topicLabel;
  document.getElementById('qts').style.display = 'none';
  document.getElementById('qa').style.display = 'block';
  rQ();
}

// ── UPDATED SNAKE — uses chapter questions, shows answer before next Q ──
const SNAKE_QS_ALL = [];
function rebuildSnakeQs(){
  SNAKE_QS_ALL.length = 0;
  // Use ALL chapter questions
  ALL_CHAPTER_QS.forEach(q => SNAKE_QS_ALL.push(q));
  // fallback if empty
  if(!SNAKE_QS_ALL.length){
    SNAKE_QS_ALL.push({q:'What does HTML stand for?',opts:['HyperText Markup Language','High-Tech Modern Language','HyperText Making Language','Hyperlink'],ans:0,exp:'HTML = HyperText Markup Language.'});
  }
}

function rndSnakeQ(){ return SNAKE_QS_ALL[Math.floor(Math.random()*SNAKE_QS_ALL.length)]; }

// Show answer reveal panel in snake game
function showSnakeAnswerReveal(q, correct, chosenLabel, onDone){
  const revealBox = document.getElementById('sq-reveal');
  if(!revealBox) { onDone(); return; }

  revealBox.style.display = 'block';
  revealBox.innerHTML = `
    <div style="padding:.8rem 1rem;border-radius:10px;background:${correct ? 'rgba(39,201,63,.12)' : 'rgba(224,82,82,.12)'};border:1px solid ${correct ? '#27c93f60' : '#e0525260'};">
      <div style="font-family:'Cinzel',serif;font-size:.65rem;color:${correct ? '#27c93f' : '#e05252'};letter-spacing:2px;margin-bottom:.4rem;">
        ${correct ? '✅ CORRECT!' : '❌ WRONG!'}
      </div>
      <div style="font-size:.8rem;font-weight:700;margin-bottom:.4rem;color:var(--tm);">Correct answer: <span style="color:#f0d080">${q.opts[q.ans]}</span></div>
      <div style="font-size:.75rem;color:var(--td);line-height:1.5;">${q.exp}</div>
    </div>
  `;

  setTimeout(() => {
    revealBox.style.display = 'none';
    revealBox.innerHTML = '';
    onDone();
  }, 2200);
}

// ── UPDATED eatApple — shows answer THEN continues ──
function eatApple(apple){
  const q = SN.currentQ;
  const correct = apple.optIdx === q.ans;

  // Pause the snake while showing answer
  SN.running = false;
  if(SN.loop) clearInterval(SN.loop);

  // Flash the answer panel
  const opts = document.getElementById('sq-opts');
  opts.querySelectorAll('.sq-btn').forEach((b, i) => {
    b.disabled = true;
    if(i === q.ans) b.classList.add('hit-correct');
    else if(i === apple.optIdx && !correct) b.classList.add('hit-wrong');
  });

  if(correct){
    SN.streak++;
    const xpGain = (20 + SN.level * 10) * 2;
    SN.xpEarned += xpGain;
    SN.score += 50 * SN.level;
    for(let i=0;i<3;i++) SN.snake.push({...SN.snake[SN.snake.length-1]});
    if(SN.score >= 150 * SN.level * SN.level){
      SN.level++;
    }
    addXP(xpGain, 'Snake Quest 2× bonus');
    addParticles(apple.x, apple.y, '#d4af37');
    addParticles(apple.x+1, apple.y, '#f0d080');
    document.getElementById('sn-hint').textContent = `✅ Correct! +${xpGain} XP — 2× BONUS! 🔥`;
    updSnakeUI();
  } else {
    addParticles(apple.x, apple.y, '#e05252');
    SN.snake.pop(); SN.snake.pop(); SN.snake.pop();
    document.getElementById('sn-hint').textContent = `❌ Wrong! Correct was: "${q.opts[q.ans]}"`;
  }

  // Show answer reveal, then resume or end
  showSnakeAnswerReveal(q, correct, q.opts[apple.optIdx], () => {
    if(!correct && SN.snake.length <= 3){
      gameOver(false);
      return;
    }
    SN.streak = correct ? SN.streak : 0;
    updSnakeUI();
    if(SN.snake.length > 0){
      SN.running = true;
      SN.loop = setInterval(snakeTick, SN.tickMs);
      nextSnakeQ();
    }
  });

  drawSnake();
}

// ── LOAD SAVED LEVEL ON INIT ──
(function initLevel(){
  const saved = parseInt(localStorage.getItem('learno-level'));
  if(saved >= 1 && saved <= 3){
    USER_LEVEL = saved;
    computeUnlocks();
  }
})();

// ── THEME TOGGLE ──
function applyLightModeInlineOverrides(isLight) {
  const old = document.getElementById('learno-light-inline');
  if (old) old.remove();
  if (!isLight) return;
  const style = document.createElement('style');
  style.id = 'learno-light-inline';
  style.textContent = `
    body.light #paras-container > div,
    body.light [id^="para-"] {
      background: linear-gradient(145deg,#fffdf5,#fff8ee) !important;
      border-color: rgba(201,168,76,.3) !important;
    }
    body.light [id^="q-"] {
      background: rgba(201,168,76,.08) !important;
    }
    body.light [id^="q-"] > div:first-child {
      color: #1a1400 !important;
    }
    body.light [id^="opt-"] {
      background: rgba(201,168,76,.07) !important;
      border-color: rgba(201,168,76,.3) !important;
      color: #1a1400 !important;
    }
    body.light [id^="opt-"] span {
      color: #8a6200 !important;
    }
    body.light [id^="fb-"] { color: #3a2800 !important; }
    body.light [id^="para-"] div[style*="color:var(--tm)"] { color: #1a1400 !important; }
    body.light [id^="para-"] div[style*="background:rgba(201"] {
      color: #1a1400 !important;
      background: rgba(201,168,76,.07) !important;
    }
  `;
  document.head.appendChild(style);
}

function toggleTheme(){
  const chk = document.getElementById('theme-chk');
  if(chk.checked){
    document.body.classList.add('light');
    localStorage.setItem('learno-theme','light');
    applyLightModeInlineOverrides(true);
  } else {
    document.body.classList.remove('light');
    localStorage.setItem('learno-theme','dark');
    applyLightModeInlineOverrides(false);
  }
}

// ── ENTER APP ──
function enterApp(){
  const sp = document.getElementById('s-splash');
  if(sp){ sp.classList.add('exit'); setTimeout(()=>{ sp.style.display='none'; }, 900); }
}


// ── QUIZ ──


function rQ(){
  const cq=ST.quiz, q=cq.qs[cq.idx], tot=cq.qs.length, pct=(cq.idx/tot)*100;
  const lab=['A','B','C','D'];
  const topicTitle = CHAPTERS.find(c=>c.id===cq.topic)?.title || cq.topic;
  document.getElementById('qi').innerHTML=`
    <div style="max-width:760px;margin:0 auto;padding:2rem 1.5rem 4rem;">
      <div class="qh">
        <div class="qto">${topicTitle} QUIZ</div>
        <div class="qpt">Q${cq.idx+1} of ${tot}</div>
      </div>
      <div class="qpb"><div class="qpf" style="width:${pct}%"></div></div>
      <div class="qc">
        <div class="qn">QUESTION ${cq.idx+1}</div>
        <div class="qt">${q.q}</div>
        ${q.code?`<div class="qcode">${sHL(q.code)}</div>`:''}
        <div class="og" id="og">
          ${q.opts.map((o,i)=>`<button class="ob" id="o${i}" onclick="ansQ(${i})"><span class="ol">${lab[i]}</span>${o}</button>`).join('')}
        </div>
        <div id="ef" class="ef" style="display:none"></div>
        <div style="margin-top:1.5rem;text-align:right">
          <button id="nb" onclick="nxtQ()" style="display:none;font-family:'Cinzel',serif;font-size:.75rem;padding:.55rem 1.5rem;background:linear-gradient(135deg,#c9a84c,#e8c97a);border:none;border-radius:6px;color:#080600;cursor:pointer;font-weight:700;letter-spacing:1px;">NEXT →</button>
        </div>
      </div>
    </div>`;
}

function ansQ(i){
  const cq=ST.quiz, q=cq.qs[cq.idx];
  if(cq.ans)return;
  cq.ans=true;
  const cor=i===q.ans;
  if(cor){cq.score++;ST.streak++;if(ST.streak>=5)unl(1);addXP(20,'Quiz answer');}
  else ST.streak=0;
  document.querySelectorAll('.ob').forEach((b,idx)=>{
    b.disabled=true;
    if(idx===q.ans)b.style.cssText+=';border-color:#27c93f;background:rgba(39,201,63,.12);color:#27c93f';
    else if(idx===i&&!cor)b.style.cssText+=';border-color:#e05252;background:rgba(224,82,82,.1);color:#e05252';
  });
  const ef=document.getElementById('ef');
  ef.style.display='block';
  ef.style.cssText=`display:block;margin-top:1rem;padding:.8rem 1rem;border-radius:8px;font-size:.85rem;line-height:1.6;${cor?'background:rgba(39,201,63,.1);border:1px solid rgba(39,201,63,.3);color:#2ee844':'background:rgba(224,82,82,.1);border:1px solid rgba(224,82,82,.3);color:#e88f8f'}`;
  ef.innerHTML=(cor?'✅ ':'❌ ')+q.exp;
  const nb=document.getElementById('nb');if(nb)nb.style.display='inline-block';
}

function nxtQ(){
  ST.quiz.idx++;ST.quiz.ans=false;
  if(ST.quiz.idx>=ST.quiz.qs.length)finQ();else rQ();
}

function finQ(){
  const cq=ST.quiz,tot=cq.qs.length,pct=Math.round(cq.score/tot*100),el=Math.round((Date.now()-cq.t0)/1000);
  unl(0);checkBadge_quizPerfect(pct,el);checkBadge_streak(ST.streak);
  const bon=pct===100?100:pct>=80?50:0;
  if(bon)addXP(bon,'Completion bonus');
  addXP(cq.score*20,'Quiz score');
  showM(pct>=80?'🏆':pct>=50?'👍':'😅','Quiz Complete!',`You scored ${cq.score}/${tot} (${pct}%) in ${el}s`,`+${cq.score*20+bon} XP earned`,()=>rQTopics());
}


// ── PUZZLES ──
function rPL(){
  document.getElementById('cll').innerHTML=ST.puzzles.map(p=>`
    <div class="ci" onclick="opP('${p.id}')">
      <span class="cci">${p.title.split(' ')[0]}</span>
      <div class="cif">
        <div class="cin">${p.title.replace(/^\S+\s/,'')}</div>
        <div class="cim">${p.desc.substring(0,55)}... · ⚡${p.xp} XP · <span class="db d${p.diff==='easy'?'e':p.diff==='med'?'m':'h'}" style="font-size:.6rem">${p.diff}</span></div>
      </div>
      <span class="cst">${p.solved?'✅':'🔒'}</span>
    </div>`).join('');
}
function showPL(){document.getElementById('plv').style.display='block';document.getElementById('pwv').style.display='none';}
function opP(id){
  const pz=ST.puzzles.find(p=>p.id===id);if(!pz)return;
  ST.ap=pz;
  document.getElementById('plv').style.display='none';
  document.getElementById('pwv').style.display='block';
  document.getElementById('pi').innerHTML=`
    <div style="max-width:880px;margin:0 auto;padding:2rem 1.5rem 4rem;">
      <button onclick="showPL()" style="font-family:'Cinzel',serif;font-size:.72rem;background:none;border:1px solid rgba(255,255,255,.15);color:var(--td);padding:.38rem .85rem;border-radius:6px;cursor:pointer;margin-bottom:1.4rem">← BACK</button>
      <div class="ph"><div class="ptl">${pz.title}</div><div class="pdesc">${pz.desc}</div></div>
      <div class="pw">
        <div class="cp">
          <div class="pnh"><span class="pnt">EDITOR</span><div class="dots"><div class="dot dr"></div><div class="dot dy"></div><div class="dot dg"></div></div></div>
          <textarea id="ce" spellcheck="false">${pz.start}</textarea>
        </div>
        <div class="op">
          <div class="pnh"><span class="pnt">OUTPUT</span><span style="font-size:.62rem;color:var(--td);font-family:'Cinzel',serif">SIMULATED</span></div>
          <div id="co"><span class="ol2 i">// Click RUN to execute</span></div>
        </div>
      </div>
      <div class="pc">
        <button class="br" onclick="runP()">▶ RUN CODE</button>
        <button class="bh" onclick="showHint()">💡 HINT</button>
        <button class="brs" onclick="resetP('${id}')">↺ RESET</button>
      </div>
    </div>`;
}
const PZ_WORKER_SRC=`self.onmessage=function(e){var lines=[];var c={log:function(){lines.push({t:'s',v:Array.prototype.slice.call(arguments).map(function(x){return typeof x==='object'?JSON.stringify(x):String(x);}).join(' ')});},error:function(){lines.push({t:'e',v:'✗ '+Array.prototype.slice.call(arguments).join(' ')});},warn:function(){lines.push({t:'w',v:'⚠ '+Array.prototype.slice.call(arguments).join(' ')});}};try{(new Function('console',e.data))(c);postMessage({ok:true,lines:lines});}catch(err){postMessage({ok:false,lines:lines,error:err.message});}};`;
function runP(){
  const pz=ST.ap,code=document.getElementById('ce').value,out=document.getElementById('co');
  out.innerHTML='<span class="ol2 i">// Running...</span>';
  if(window._pzWorker){try{window._pzWorker.terminate();}catch(e){}}
  const blob=new Blob([PZ_WORKER_SRC],{type:'application/javascript'});
  const worker=new Worker(URL.createObjectURL(blob));
  window._pzWorker=worker;
  let done=false;
  const finish=(data)=>{
    if(done)return;done=true;clearTimeout(timer);
    try{worker.terminate();}catch(e){}
    out.innerHTML='';
    (data.lines||[]).forEach(l=>{const s=document.createElement('span');s.className=`ol2 ${l.t}`;s.textContent=l.v;out.appendChild(s);});
    if(data.ok){
      if(pz.test(code)){
        const s=document.createElement('span');s.className='ol2 i';s.textContent='✓ Solution looks correct!';out.appendChild(s);
        if(!pz.solved){pz.solved=true;setTimeout(()=>{addXP(pz.xp,'Puzzle solved');checkBadge_puzzle();showM('🧩','Puzzle Solved!',`You cracked "${pz.title.replace(/^\S+\s/,'')}"!`,`+${pz.xp} XP`,()=>{showPL();rPL();});spawnC();},300);}
      }
    }else{
      const s=document.createElement('span');s.className='ol2 e';s.textContent='✗ Error: '+data.error;out.appendChild(s);
    }
    if(!out.children.length)out.innerHTML='<span class="ol2">// No output. Try console.log()</span>';
  };
  const timer=setTimeout(()=>finish({ok:false,lines:[],error:'Code took too long to run — check for an infinite loop.'}),3000);
  worker.onmessage=(e)=>finish(e.data);
  worker.onerror=(err)=>finish({ok:false,lines:[],error:err.message});
  worker.postMessage(code);
}
function showHint(){showM('💡','HINT',ST.ap.hint,'',()=>{});}
function resetP(id){const p=ST.puzzles.find(x=>x.id===id);document.getElementById('ce').value=p.start;document.getElementById('co').innerHTML='<span class="ol2 i">// Code reset</span>';}


// ── LEADERBOARD ──
function getCurrentNametag(){
  const lv = ST.lv;
  const keys = Object.keys(NAMETAG_REWARDS).map(Number).sort((a,b)=>b-a);
  for(const k of keys){ if(lv >= k) return NAMETAG_REWARDS[k]; }
  return '';
}


// ── ACHIEVEMENTS ──
function unl(idOrIdx){
  // Accept badge id string or legacy index number
  let badge;
  if(typeof idOrIdx === 'number'){
    // Legacy index map
    const legacyMap = [0,1,2,3,4,5,6,7]; // old indices 0-7 map to first 8 badges
    badge = ST.ach[legacyMap[idOrIdx]];
  } else {
    badge = ST.ach.find(b => b.id === idOrIdx);
  }
  if(!badge || badge.ul) return; // already unlocked or not found
  badge.ul = true;
  onCammyBadge();
  // Award XP for unlocking
  const xpReward = badge.xp || 50;
  ST.xp += xpReward;
  ST.lv = Math.floor(ST.xp / 500) + 1;
  updXP();
  updLB();
  // Show badge unlock notification
  showBadgeUnlock(badge, xpReward);
  // Check completionist
  checkCompletionist();
  // Save to localStorage
  saveBadgeState();
}

function showBadgeUnlock(badge, xpReward){
  var rc = rarityColor(badge.rarity);
  var el = document.createElement('div');
  el.style.cssText = 'position:fixed;bottom:5rem;right:1.5rem;z-index:9997;background:linear-gradient(145deg,#1a1400,#0f0d00);border:1.5px solid '+rc+';border-radius:12px;padding:1rem 1.2rem;display:flex;align-items:center;gap:.8rem;box-shadow:0 8px 40px rgba(0,0,0,.7),0 0 30px '+rc+'40;animation:slideInRight .4s cubic-bezier(.22,.9,.36,1);max-width:300px;';

  var iconDiv = document.createElement('div');
  iconDiv.style.cssText = 'font-size:2.2rem;filter:drop-shadow(0 0 12px '+rc+');flex-shrink:0;';
  iconDiv.textContent = badge.icon;
  el.appendChild(iconDiv);

  var info = document.createElement('div');

  var rarityLbl = document.createElement('div');
  rarityLbl.style.cssText = "font-family:'Cinzel',serif;font-size:.55rem;color:"+rc+";letter-spacing:2px;margin-bottom:.2rem;";
  rarityLbl.textContent = 'BADGE UNLOCKED \u00b7 ' + badge.rarity.toUpperCase();
  info.appendChild(rarityLbl);

  var nameLbl = document.createElement('div');
  nameLbl.style.cssText = "font-family:'Cinzel Decorative',serif;font-size:.82rem;font-weight:700;color:var(--ny);";
  nameLbl.textContent = badge.name;
  info.appendChild(nameLbl);

  var xpLbl = document.createElement('div');
  xpLbl.style.cssText = 'font-size:.72rem;color:var(--td);margin-top:.15rem;';
  xpLbl.textContent = '+' + xpReward + ' XP reward';
  info.appendChild(xpLbl);

  el.appendChild(info);
  document.body.appendChild(el);

  setTimeout(function(){
    el.style.transition = 'opacity .5s, transform .5s';
    el.style.opacity = '0';
    el.style.transform = 'translateX(20px)';
    setTimeout(function(){ el.remove(); }, 500);
  }, 3500);
  checkLevelUp();
}

function rarityColor(r){
  return {common:'#c9a84c', rare:'#61dafb', epic:'#b44fff', legendary:'#f0d080'}[r] || '#c9a84c';
}

let _lastLv = 1;
function checkLevelUp(){
  const newLv = Math.floor(ST.xp / 500) + 1;
  if(newLv > _lastLv){
    _lastLv = newLv;
    setTimeout(()=>showLevelUp(newLv), 400);
    onCammyLevelUp();
  }
}

function showLevelUp(lv){
  var avatarUnlock = LEVEL_REWARDS[lv];
  var nametag = NAMETAG_REWARDS[lv];

  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;z-index:9996;background:rgba(0,0,0,.85);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;animation:fi .4s ease;';

  var card = document.createElement('div');
  card.style.cssText = 'background:linear-gradient(145deg,#1a1400,#0f0d00);border:2px solid #f0d080;border-radius:16px;padding:2.5rem 2rem;max-width:340px;width:90%;text-align:center;box-shadow:0 30px 80px rgba(0,0,0,.8),0 0 60px rgba(201,168,76,.2);';

  var lvIcon = document.createElement('div');
  lvIcon.style.cssText = 'font-size:3.5rem;margin-bottom:.6rem;';
  lvIcon.textContent = '\uD83C\uDD99';
  card.appendChild(lvIcon);

  var lvTitle = document.createElement('div');
  lvTitle.style.cssText = "font-family:'Cinzel Decorative',serif;font-size:.7rem;color:#c9a84c;letter-spacing:3px;margin-bottom:.4rem;";
  lvTitle.textContent = 'LEVEL UP!';
  card.appendChild(lvTitle);

  var lvNum = document.createElement('div');
  lvNum.style.cssText = "font-family:'Cinzel Decorative',serif;font-size:2.5rem;font-weight:900;color:#f0d080;text-shadow:0 0 30px rgba(240,208,128,.7);";
  lvNum.textContent = 'LEVEL ' + lv;
  card.appendChild(lvNum);

  if(avatarUnlock){
    var avBox = document.createElement('div');
    avBox.style.cssText = 'margin-top:1rem;padding:.8rem;background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.3);border-radius:10px;';

    var avLabel = document.createElement('div');
    avLabel.style.cssText = "font-family:'Cinzel',serif;font-size:.6rem;color:#c9a84c;letter-spacing:2px;margin-bottom:.4rem;";
    avLabel.textContent = '\uD83C\uDF81 AVATAR UNLOCKED';
    avBox.appendChild(avLabel);

    var avIcon = document.createElement('div');
    avIcon.style.fontSize = '2rem';
    avIcon.textContent = avatarUnlock.avatar;
    avBox.appendChild(avIcon);

    var avName = document.createElement('div');
    avName.style.cssText = "font-family:'Cinzel Decorative',serif;font-size:.75rem;color:var(--ny);margin-top:.3rem;";
    avName.textContent = avatarUnlock.name;
    avBox.appendChild(avName);

    card.appendChild(avBox);
    if(!UNLOCKED_AVATARS.includes(avatarUnlock.avatar)){
      UNLOCKED_AVATARS.push(avatarUnlock.avatar);
      saveAvatarState();
    }
  }

  if(nametag){
    var ntBox = document.createElement('div');
    ntBox.style.cssText = 'margin-top:.8rem;padding:.6rem;background:rgba(100,200,255,.08);border:1px solid rgba(100,200,255,.2);border-radius:8px;';

    var ntLabel = document.createElement('div');
    ntLabel.style.cssText = "font-family:'Cinzel',serif;font-size:.58rem;color:#61dafb;letter-spacing:2px;margin-bottom:.3rem;";
    ntLabel.textContent = '\uD83C\uDFF7\uFE0F NAMETAG UNLOCKED';
    ntBox.appendChild(ntLabel);

    var ntName = document.createElement('div');
    ntName.style.cssText = "font-family:'Cinzel Decorative',serif;font-size:.75rem;color:#61dafb;";
    ntName.textContent = nametag;
    ntBox.appendChild(ntName);

    card.appendChild(ntBox);
  }

  var btn = document.createElement('button');
  btn.style.cssText = "margin-top:1.2rem;font-family:'Cinzel Decorative',serif;font-size:.75rem;padding:.65rem 2rem;background:linear-gradient(135deg,#c9a84c,#e8c97a);border:none;border-radius:8px;color:#080600;cursor:pointer;font-weight:700;";
  btn.textContent = 'AWESOME! \u2192';
  btn.addEventListener('click', function(){ overlay.remove(); updateProfileIcon(); });
  card.appendChild(btn);

  overlay.appendChild(card);
  document.body.appendChild(overlay);
}

// ── LEVEL REWARDS ──
const LEVEL_REWARDS = {
  2:  {avatar:'🌟', name:'Star Apprentice'},
  3:  {avatar:'⚔️', name:'Code Warrior'},
  4:  {avatar:'🔮', name:'Crystal Mage'},
  5:  {avatar:'🐉', name:'Code Dragon'},
  6:  {avatar:'🌙', name:'Night Coder'},
  7:  {avatar:'🛸', name:'Space Dev'},
  8:  {avatar:'💀', name:'Skull Hacker'},
  9:  {avatar:'🦁', name:'Lion King'},
  10: {avatar:'👾', name:'Pixel God'},
};

const NAMETAG_REWARDS = {
  3:  'Code Apprentice',
  5:  'Digital Knight',
  7:  'Algorithm Master',
  10: 'LearnO Legend',
};

// Unlocked avatars (starts with defaults, more added via level ups)
var UNLOCKED_AVATARS = ['⚡','🔥','🌙','⚔️','🏆','🎮','🌀','🛸','🎯','💎'];

function saveAvatarState(){
  localStorage.setItem('learno-avatars', JSON.stringify(UNLOCKED_AVATARS));
  localStorage.setItem('learno-st-xp', ST.xp);
  localStorage.setItem('learno-st-lv', ST.lv);
  localStorage.setItem('learno-badges', JSON.stringify(ST.ach.map(a=>a.ul)));
}

function saveBadgeState(){
  localStorage.setItem('learno-badges', JSON.stringify(ST.ach.map(a=>a.ul)));
  localStorage.setItem('learno-st-xp', ST.xp);
  localStorage.setItem('learno-st-lv', ST.lv);
}

function loadBadgeState(){
  try {
    const saved = localStorage.getItem('learno-badges');
    if(saved){
      const arr = JSON.parse(saved);
      arr.forEach((ul, i) => { if(ST.ach[i]) ST.ach[i].ul = ul; });
    }
    const savedXP = localStorage.getItem('learno-st-xp');
    if(savedXP){ ST.xp = parseInt(savedXP) || 0; ST.lv = Math.floor(ST.xp/500)+1; _lastLv = ST.lv; updXP(); }
    const savedAv = localStorage.getItem('learno-avatars');
    if(savedAv){ UNLOCKED_AVATARS = JSON.parse(savedAv); }
  } catch(e){}
}

function checkCompletionist(){
  const allExceptLast = ST.ach.slice(0, ST.ach.length - 1);
  if(allExceptLast.every(b => b.ul)){
    unl('completionist');
  }
}

// ── BADGE CHECK FUNCTIONS — called from various game events ──
function checkBadge_firstBlood(allCorrect){
  // All 3 (or more) quizzes in a para answered correctly
  if(allCorrect) unl('first_blood');
}

function checkBadge_streak(streak){
  if(streak >= 5)  unl('on_fire');
  if(streak >= 10) unl('streak_god');
  onCammyStreak(streak);
}

function checkBadge_quizPerfect(pct, elapsed){
  if(pct === 100) unl('perfect');
  if(elapsed < 60) unl('speed_coder');
}

function checkBadge_scholar(completedChapters){
  if(completedChapters >= 1) unl('scholar');
  if(completedChapters >= 3) unl('chapter_master');
}

function checkBadge_puzzle(){
  unl('puzzle_breaker');
}

function checkBadge_snakeLevel(lv){
  if(lv >= 3) unl('snake_charmer');
}

function checkBadge_towerHeight(h){
  if(h >= 10) unl('tower_lord');
}

function checkBadge_memory(moves){
  if(moves <= 20) unl('memory_king');
}
function rAch(){
  const rarityOrder = {legendary:0, epic:1, rare:2, common:3};
  const sorted = [...ST.ach].sort((a,b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);
  const unlocked = ST.ach.filter(a=>a.ul).length;
  const total = ST.ach.length;

  document.getElementById('ag').innerHTML = '';

  // Progress header
  const header = document.createElement('div');
  header.style.cssText = 'text-align:center;margin-bottom:1.5rem;';
  header.innerHTML = `
    <div style="font-family:'Cinzel',serif;font-size:.65rem;color:var(--td);letter-spacing:3px;margin-bottom:.5rem;">${unlocked} / ${total} BADGES UNLOCKED</div>
    <div style="height:6px;background:rgba(255,255,255,.07);border-radius:99px;overflow:hidden;max-width:300px;margin:0 auto;">
      <div style="height:100%;width:${Math.round(unlocked/total*100)}%;background:linear-gradient(90deg,#c9a84c,#f0d080);border-radius:99px;transition:width 1s ease;box-shadow:0 0 10px rgba(201,168,76,.6);"></div>
    </div>
  `;
  document.getElementById('ag').appendChild(header);

  // Badge grid
  const grid = document.createElement('div');
  grid.className = 'ag';
  grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem;';

  sorted.forEach(badge => {
    const rc = rarityColor(badge.rarity);
    const card = document.createElement('div');
    card.className = 'ac ' + (badge.ul ? 'ul' : 'lk');
    card.style.cssText = `
      position:relative;overflow:hidden;cursor:default;
      border-color:${badge.ul ? rc+'60' : 'rgba(255,255,255,.06)'};
      ${badge.ul && badge.rarity === 'legendary' ? 'animation:shimmer 2s infinite;' : ''}
    `;
    if(badge.ul){
      card.style.background = `linear-gradient(145deg,${rc}18,${rc}08)`;
    }

    const rarityLabel = document.createElement('div');
    rarityLabel.style.cssText = `font-family:'Cinzel',serif;font-size:.5rem;letter-spacing:2px;color:${badge.ul?rc:'rgba(255,255,255,.2)'};margin-bottom:.4rem;text-transform:uppercase;`;
    rarityLabel.textContent = badge.rarity;
    card.appendChild(rarityLabel);

    if(badge.ul){
      const check = document.createElement('span');
      check.className = 'ab';
      check.textContent = '✓';
      check.style.color = rc;
      card.appendChild(check);
    }

    const icon = document.createElement('span');
    icon.className = 'ai';
    icon.textContent = badge.icon;
    if(!badge.ul) icon.style.filter = 'grayscale(1) opacity(0.3)';
    else icon.style.filter = `drop-shadow(0 0 10px ${rc}80)`;
    card.appendChild(icon);

    const name = document.createElement('div');
    name.className = 'an';
    name.textContent = badge.name;
    if(badge.ul) name.style.color = rc;
    card.appendChild(name);

    const desc = document.createElement('div');
    desc.className = 'ad';
    desc.textContent = badge.desc;
    card.appendChild(desc);

    const xpRow = document.createElement('div');
    xpRow.style.cssText = `margin-top:.5rem;font-family:'Cinzel',serif;font-size:.58rem;color:${badge.ul?rc:'rgba(255,255,255,.2)'};letter-spacing:1px;`;
    xpRow.textContent = (badge.ul ? '✅ ' : '🔒 ') + '+' + (badge.xp||50) + ' XP reward';
    card.appendChild(xpRow);

    grid.appendChild(card);
  });
  document.getElementById('ag').appendChild(grid);
}

// ── MODAL ──
let _mc=null;
function showM(ic,tl,bd,xp,cb){
  document.getElementById('mi').textContent=ic;document.getElementById('mtl').textContent=tl;
  document.getElementById('mbd').textContent=bd;document.getElementById('mxp').textContent=xp;
  document.getElementById('mo').classList.remove('hid');_mc=cb;
}
function cM(){document.getElementById('mo').classList.add('hid');if(_mc){_mc();_mc=null;}}

// ── SYNTAX HL ──
function sHL(c){
  return c.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/(\/\/.*)/g,'<span class="cm">$1</span>')
    .replace(/\b(let|const|var|function|return|if|else|for|while|new|class|async|await|of|in|true|false|null|undefined)\b/g,'<span class="kw">$1</span>')
    .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g,'<span class="fn">$1</span>')
    .replace(/"([^"]*?)"|'([^']*?)'/g,'<span class="str">"$1$2"</span>')
    .replace(/\b(\d+)\b/g,'<span class="num">$1</span>');
}

// ── CONFETTI ──
function spawnC(){
  const cv=document.getElementById('cfc'),ctx=cv.getContext('2d');
  cv.width=innerWidth;cv.height=innerHeight;
  const ps=Array.from({length:110},()=>({
    x:Math.random()*cv.width,y:-10,r:Math.random()*6+3,
    c:['#c9a84c','#f0d080','#e8c97a','#d4af37','#b8922a'][0|Math.random()*5],
    vy:Math.random()*4+2,vx:(Math.random()-.5)*3,rot:Math.random()*360,rv:(Math.random()-.5)*8,
  }));
  let fr;function draw(){ctx.clearRect(0,0,cv.width,cv.height);
    ps.forEach(p=>{p.y+=p.vy;p.x+=p.vx;p.rot+=p.rv;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot*Math.PI/180);ctx.fillStyle=p.c;ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r);ctx.restore();});
    if(ps.some(p=>p.y<cv.height+50))fr=requestAnimationFrame(draw);else ctx.clearRect(0,0,cv.width,cv.height);}
  draw();setTimeout(()=>{cancelAnimationFrame(fr);ctx.clearRect(0,0,cv.width,cv.height);},3500);
}

// ── STARS ──
(()=>{
  const cv=document.getElementById('sc'),ctx=cv.getContext('2d');
  let W,H,stars=[];
  function resize(){W=cv.width=innerWidth;H=cv.height=innerHeight;}
  addEventListener('resize',resize);resize();
  for(let i=0;i<200;i++)stars.push({
    x:Math.random()*2200-100,y:Math.random()*1400-200,
    r:Math.random()*1.8+.15,
    a:Math.random(),da:(Math.random()-.5)*.006,
    sp:Math.random()*.08+.015,
    gold:Math.random()>.4
  });
  function tick(){ctx.clearRect(0,0,W,H);stars.forEach(s=>{s.y+=s.sp;s.a+=s.da;if(s.a<0){s.a=0;s.da*=-1;}if(s.a>1){s.a=1;s.da*=-1;}if(s.y>H+10)s.y=-10;ctx.globalAlpha=s.a;ctx.fillStyle='#e8c97a';ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();});ctx.globalAlpha=1;requestAnimationFrame(tick);}
  tick();
})();


// ── COUNTERS ──
function cnt(el,n,d=1100){let t=null;(function step(ts){if(!t)t=ts;const p=Math.min((ts-t)/d,1);el.textContent=Math.floor(p*n);if(p<1)requestAnimationFrame(step);else el.textContent=n;})(performance.now());}


// ══════════════════════════════════════════
// GAMES HUB
// ══════════════════════════════════════════
function rGames() {
  const hub = document.getElementById('games-hub');
  hub.innerHTML = `
    <div class="games-hub-wrap">
      <div class="sh" style="padding:1rem 0 1.5rem">
        <h2 class="st">🎮 LEARN THROUGH <span>GAMES</span></h2>
        <p class="ss">Play your way to mastery — every game teaches real concepts</p>
      </div>
      <div class="game-cards-row">
        <div class="game-card" onclick="openSnake()">
          <span class="gc-icon">🐍</span>
          <div class="gc-title">SNAKE QUEST</div>
          <div class="gc-desc">Steer the snake and answer coding questions before hitting the wall. Right answers grow it. Wrong ones shrink it. Too small — BOOM!</div>
          <span class="gc-tag">LIVE ✦ PLAY NOW</span>
        </div>
        <div class="game-card" onclick="openMemory()">
          <span class="gc-icon" style="animation-delay:.5s">🔮</span>
          <div class="gc-title">CODE MEMORY</div>
          <div class="gc-desc">Flip cards and match code snippets to their outputs. Train your visual code memory — 8 pairs to match!</div>
          <span class="gc-tag">LIVE ✦ PLAY NOW</span>
        </div>
        <div class="game-card" onclick="openTower()">
          <span class="gc-icon" style="animation-delay:1s">🏗️</span>
          <div class="gc-title">TOWER BUILD</div>
          <div class="gc-desc">Answer questions to drop blocks. Wrong answers shrink your block. Miss the tower and it collapses!</div>
          <span class="gc-tag">LIVE ✦ PLAY NOW</span>
        </div>
        <div class="game-card" onclick="openTrueFalse()">
          <span class="gc-icon" style="animation-delay:1.5s">⚡</span>
          <div class="gc-title">TRUE OR FALSE BLITZ</div>
          <div class="gc-desc">60 seconds of rapid-fire coding statements. TRUE or FALSE as fast as you can. Streak multiplier for bonuses!</div>
          <span class="gc-tag">LIVE ✦ PLAY NOW</span>
        </div>
        <div class="game-card" onclick="openFillBlank()">
          <span class="gc-icon" style="animation-delay:2s">🔡</span>
          <div class="gc-title">FILL THE BLANK</div>
          <div class="gc-desc">Code snippets with missing words. Type the exact answer before the 15-second timer runs out!</div>
          <span class="gc-tag">LIVE ✦ PLAY NOW</span>
        </div>
        <div class="game-card" onclick="openCodePath()">
          <span class="gc-icon" style="animation-delay:2.5s">🗺️</span>
          <div class="gc-title">CODE PATH</div>
          <div class="gc-desc">Navigate a maze. Hit a junction and answer a coding question. Wrong answer walls you off. Find the exit!</div>
          <span class="gc-tag">LIVE ✦ PLAY NOW</span>
        </div>
      </div>
    </div>`;
  ['snake-screen','memory-screen','tower-screen','tf-screen','ftb-screen','cp-screen'].forEach(function(id){
    var el=document.getElementById(id);if(el)el.style.display='none';
  });
  document.getElementById('games-hub').style.display='block';
}
function openSnake(){
  document.getElementById('games-hub').style.display='none';
  document.getElementById('snake-screen').style.display='block';
  initSnakeUI();
}
function showGamesHub(){
  stopSnake();
  ['snake-screen','memory-screen','tower-screen','tf-screen','ftb-screen','cp-screen'].forEach(function(id){
    var el = document.getElementById(id); if(el) el.style.display='none';
  });
  document.getElementById('games-hub').style.display='block';
}

// ══════════════════════════════════════════
// SNAKE GAME ENGINE
// ══════════════════════════════════════════
const SN = {
  CELL: 23, COLS: 20, ROWS: 20,
  snake: [], dir: {x:1,y:0}, nextDir: {x:1,y:0},
  apples: [], running: false, loop: null, tickMs: 300,
  score: 0, level: 1, xpEarned: 0, streak: 0,
  shrinkCount: 0, currentQ: null,
  particles: [],
};

 // uses full chapter knowledge base

function initSnakeUI(){
  SN.snake=[];SN.dir={x:1,y:0};SN.nextDir={x:1,y:0};
  SN.score=0;SN.level=1;SN.xpEarned=0;SN.streak=0;SN.lives=3;
  SN.running=false;SN.loop=null;SN.particles=[];
  updSnakeUI();
  setOverlay('🐍','SNAKE QUEST','4 answer apples appear on the board. Eat the correct one to grow! Wrong apple or wall = shrink. Too small = 💥 BAMM!','','▶ PLAY NOW');
  document.getElementById('snake-overlay').style.display='flex';
  nextSnakeQ();
}

function startSnake(){
  const cv=document.getElementById('snake-canvas');
  cv.width=SN.COLS*SN.CELL; cv.height=SN.ROWS*SN.CELL;
  SN.snake=[{x:10,y:10},{x:9,y:10},{x:8,y:10},{x:7,y:10},{x:6,y:10}];
  SN.dir={x:1,y:0};SN.nextDir={x:1,y:0};
  SN.score=0;SN.level=1;SN.xpEarned=0;SN.streak=0;SN.shrinkCount=0;
  SN.running=true;SN.particles=[];SN.apples=[];
  document.getElementById('snake-overlay').style.display='none';
  nextSnakeQ();
  updSnakeUI();
  if(SN.loop)clearInterval(SN.loop);
  SN.loop=setInterval(snakeTick,SN.tickMs);
}

function stopSnake(){SN.running=false;if(SN.loop)clearInterval(SN.loop);}

function snakeTick(){
  if(!SN.running)return;
  SN.dir={...SN.nextDir};
  const head={x:SN.snake[0].x+SN.dir.x,y:SN.snake[0].y+SN.dir.y};

  // Wall collision
  if(head.x<0||head.x>=SN.COLS||head.y<0||head.y>=SN.ROWS){
    wallHit(); return;
  }
  // Self collision
  if(SN.snake.some(s=>s.x===head.x&&s.y===head.y)){
    wallHit(); return;
  }

  // Check if head hits any answer apple
  const hitApple=SN.apples.find(a=>a.x===head.x&&a.y===head.y);
  SN.snake.unshift(head);

  if(hitApple){
    SN.apples=[];// remove all apples
    eatApple(hitApple);
  } else {
    SN.snake.pop();
  }
  drawSnake();
}

function wallHit(){
  addParticles(SN.snake[0].x,SN.snake[0].y,'#e05252');
  SN.shrinkCount++;
  shrinkSnake('💥 Hit the wall! Snake shrank!');
}

function shrinkSnake(msg){
  SN.snake.pop();SN.snake.pop();SN.snake.pop();
  if(SN.snake.length<=3){gameOver(false);return;}
  SN.streak=0;
  updSnakeUI();
  drawSnake();
  document.getElementById('sn-hint').textContent=msg||'🤕 Snake shrank!';
  setTimeout(()=>{
    document.getElementById('sn-hint').textContent='🎮 ARROW KEYS or WASD · Eat the correct apple! 🍎';
    if(SN.running)nextSnakeQ();
  },1400);
}

function spawnApples(){
  const q=SN.currentQ;
  SN.apples=[];
  const positions=[];
  const used=new Set(SN.snake.map(s=>s.x+','+s.y));
  q.opts.forEach((opt,i)=>{
    let pos;
    let tries=0;
    do{
      pos={x:Math.floor(Math.random()*SN.COLS),y:Math.floor(Math.random()*SN.ROWS)};
      tries++;
    }while((used.has(pos.x+','+pos.y)||positions.some(p=>p.x===pos.x&&p.y===pos.y)||
      // keep apples spread out
      positions.some(p=>Math.abs(p.x-pos.x)+Math.abs(p.y-pos.y)<4))&&tries<200);
    used.add(pos.x+','+pos.y);
    positions.push(pos);
    // Apple colors per option
    const colors=['#e05252','#c9a84c','#f0d080','#d4af37'];
    SN.apples.push({x:pos.x,y:pos.y,optIdx:i,label:opt,color:colors[i],isCorrect:i===q.ans});
  });
}

function nextSnakeQ(){
  SN.currentQ=rndSnakeQ();
  const q=SN.currentQ;
  // Update side panel question display
  document.getElementById('sq-text').textContent=q.q;
  const labs=['A','B','C','D'];
  const colors=['#e05252','#c9a84c','#f0d080','#d4af37'];
  document.getElementById('sq-opts').innerHTML=q.opts.map((o,i)=>
    `<div class="sq-btn" style="border-color:${colors[i]}40;background:${colors[i]}15;color:${colors[i]};cursor:default;font-size:.74rem">
      <span style="font-size:.9rem">🍎</span> ${labs[i]}: ${o}
    </div>`
  ).join('');
  spawnApples();
  document.getElementById('sn-hint').textContent='🍎 Eat the correct apple to answer! Avoid wrong ones!';
}

function gameOver(won=false){
  stopSnake();
  if(won){
    setOverlay('🏆','YOU WIN!',`Score: ${SN.score} | Level: ${SN.level}`,`+${SN.xpEarned} XP earned!`,'▶ PLAY AGAIN');
  } else {
    const msgs=['💥 BAMM! Snake too smol!','☠️ The snake has left the chat','🪦 RIP tiny danger noodle','💀 Game Over! It got too short!'];
    setOverlay('💥',msgs[Math.floor(Math.random()*msgs.length)],`Score: ${SN.score} | Streak: ${SN.streak}`,`+${SN.xpEarned} XP earned`,'🔄 TRY AGAIN');
    spawnC();
  }
  addXP(SN.xpEarned,'Snake Quest session');
  document.getElementById('snake-overlay').style.display='flex';
}

function setOverlay(icon,title,sub,xp,btn){
  document.getElementById('so-title').textContent=title;
  document.getElementById('so-sub').textContent=sub;
  document.getElementById('so-xp').textContent=xp;
  document.getElementById('so-btn').textContent=btn;
  document.querySelector('.so-icon').textContent=icon;
}

// ── DRAW ──
function drawSnake(){
  const cv=document.getElementById('snake-canvas');
  if(!cv)return;
  const ctx=cv.getContext('2d');
  const C=SN.CELL,COLS=SN.COLS,ROWS=SN.ROWS;
  ctx.clearRect(0,0,cv.width,cv.height);

  // Grid
  ctx.strokeStyle='rgba(201,168,76,.05)';
  ctx.lineWidth=.5;
  for(let x=0;x<COLS;x++){ctx.beginPath();ctx.moveTo(x*C,0);ctx.lineTo(x*C,cv.height);ctx.stroke();}
  for(let y=0;y<ROWS;y++){ctx.beginPath();ctx.moveTo(0,y*C);ctx.lineTo(cv.width,y*C);ctx.stroke();}

  // Answer Apples — 4 colored apples, one per answer option
  const t=Date.now()/600;
  if(SN.apples&&SN.apples.length){
    SN.apples.forEach((a,ai)=>{
      const fx=a.x*C+C/2, fy=a.y*C+C/2;
      const pulse=.88+Math.sin(t+ai*1.2)*0.12;
      const r=C*.42*pulse;
      ctx.save();
      // Outer glow
      const grad=ctx.createRadialGradient(fx,fy,0,fx,fy,r*2);
      grad.addColorStop(0,a.color+'aa');grad.addColorStop(1,a.color+'00');
      ctx.fillStyle=grad;ctx.beginPath();ctx.arc(fx,fy,r*2.2,0,Math.PI*2);ctx.fill();
      // Apple body
      ctx.shadowColor=a.color;ctx.shadowBlur=16;
      ctx.fillStyle=a.color;
      // Draw apple shape (circle + bump)
      ctx.beginPath();ctx.arc(fx,fy,r,0,Math.PI*2);ctx.fill();
      // Shine
      ctx.fillStyle='rgba(255,255,255,0.3)';
      ctx.beginPath();ctx.arc(fx-r*.25,fy-r*.25,r*.3,0,Math.PI*2);ctx.fill();
      // Stem
      ctx.shadowBlur=0;ctx.strokeStyle='#5a3e1b';ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(fx,fy-r);ctx.quadraticCurveTo(fx+r*.4,fy-r*1.5,fx+r*.2,fy-r*1.2);ctx.stroke();
      // Option label on apple
      ctx.shadowBlur=0;
      ctx.fillStyle='rgba(0,0,0,0.75)';
      ctx.font=`bold ${Math.max(8,C*.38)}px Orbitron,monospace`;
      ctx.textAlign='center';ctx.textBaseline='middle';
      const labs=['A','B','C','D'];
      ctx.fillText(labs[ai],fx,fy+1);
      // Answer text below apple
      ctx.fillStyle=a.color;ctx.shadowColor=a.color;ctx.shadowBlur=6;
      ctx.font=`bold ${Math.max(7,C*.28)}px Space Mono,monospace`;
      const shortLabel=a.label.length>12?a.label.substring(0,12)+'..':a.label;
      ctx.fillText(shortLabel,fx,fy+r+C*.55);
      ctx.shadowBlur=0;
      ctx.restore();
    });
  }

  // Snake body
  const len=SN.snake.length;
  SN.snake.forEach((seg,i)=>{
    const x=seg.x*C,y=seg.y*C;
    const t=i/len;
    // color gradient head=cyan tail=purple
    const r=Math.round(201+(90-201)*t),g=Math.round(168+(70-168)*t),b=Math.round(76+(10-76)*t);
    ctx.fillStyle=`rgb(${r},${g},${b})`;
    if(i===0){
      // Head glow
      ctx.shadowColor='rgba(201,168,76,.9)';ctx.shadowBlur=18;
    } else {ctx.shadowBlur=0;}
    const pad=i===0?1:2;
    const rad=i===0?C*.4:C*.3;
    roundRect(ctx,x+pad,y+pad,C-pad*2,C-pad*2,rad);
    ctx.fill();
    // Eyes on head
    if(i===0){
      ctx.shadowBlur=0;
      ctx.fillStyle='#000';
      const ex1={x:x+C*.35,y:y+C*.3},ex2={x:x+C*.65,y:y+C*.3};
      if(SN.dir.x===1){ex1.x=x+C*.6;ex1.y=y+C*.3;ex2.x=x+C*.6;ex2.y=y+C*.6;}
      else if(SN.dir.x===-1){ex1.x=x+C*.4;ex1.y=y+C*.3;ex2.x=x+C*.4;ex2.y=y+C*.6;}
      else if(SN.dir.y===1){ex1.x=x+C*.3;ex1.y=y+C*.6;ex2.x=x+C*.6;ex2.y=y+C*.6;}
      else{ex1.x=x+C*.3;ex1.y=y+C*.35;ex2.x=x+C*.6;ex2.y=y+C*.35;}
      ctx.beginPath();ctx.arc(ex1.x,ex1.y,C*.1,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(ex2.x,ex2.y,C*.1,0,Math.PI*2);ctx.fill();
      // White gleam
      ctx.fillStyle='rgba(255,255,255,.8)';
      ctx.beginPath();ctx.arc(ex1.x-1,ex1.y-1,C*.04,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(ex2.x-1,ex2.y-1,C*.04,0,Math.PI*2);ctx.fill();
    }
  });

  // Particles
  SN.particles=SN.particles.filter(p=>p.life>0);
  SN.particles.forEach(p=>{
    p.x+=p.vx;p.y+=p.vy;p.life-=2;p.vy+=.08;
    ctx.globalAlpha=p.life/60;
    ctx.fillStyle=p.c;
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=1;
  });

  // Length bar
  const maxLen=30,barW=cv.width-20,barH=6;
  ctx.fillStyle='rgba(255,255,255,.05)';ctx.fillRect(10,cv.height-20,barW,barH);
  const pct=Math.min(SN.snake.length/maxLen,1);
  const lg=ctx.createLinearGradient(10,0,10+barW,0);
  lg.addColorStop(0,SN.snake.length<=5?'#e05252':'#c9a84c');
  lg.addColorStop(1,'#f0d080');
  ctx.fillStyle=lg;ctx.fillRect(10,cv.height-20,barW*pct,barH);
  ctx.strokeStyle='rgba(201,168,76,.25)';ctx.lineWidth=1;ctx.strokeRect(10,cv.height-20,barW,barH);
}

function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();
}

function addParticles(gx,gy,color){
  const C=SN.CELL;
  const px=gx*C+C/2,py=gy*C+C/2;
  for(let i=0;i<18;i++)SN.particles.push({x:px,y:py,vx:(Math.random()-0.5)*4,vy:(Math.random()-0.5)*4,life:60,r:Math.random()*3+1,c:color});
}

function updSnakeUI(){
  document.getElementById('sn-score').textContent=SN.score;
  document.getElementById('sn-level').textContent=SN.level;
  document.getElementById('sn-xp').textContent=SN.xpEarned;
  document.getElementById('sn-streak').textContent=SN.streak+' 🔥';
  const bars=['🟢','🟢','🟢','🟡','🟡','🔴'];
  const lifeIcons=SN.snake.length>12?'🟢🟢🟢':SN.snake.length>6?'🟡🟡🟡':'🔴🔴';
  document.getElementById('sn-lives').textContent=SN.snake.length<=3?'☠️':lifeIcons;
}

// ── DRAW LOOP ──
let snakeAnimFrame;
(function snakeRenderLoop(){
  if(document.getElementById('snake-canvas')){
    if(SN.running)drawSnake();
    else if(SN.particles.length>0)drawSnake();
  }
  snakeAnimFrame=requestAnimationFrame(snakeRenderLoop);
})();

// ── KEYBOARD ──
document.addEventListener('keydown',e=>{
  if(!SN.running)return;
  const k={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0},
            w:{x:0,y:-1},s:{x:0,y:1},a:{x:-1,y:0},d:{x:1,y:0},
            W:{x:0,y:-1},S:{x:0,y:1},A:{x:-1,y:0},D:{x:1,y:0}}[e.key];
  if(k&&!(k.x===-SN.dir.x&&k.y===-SN.dir.y)){SN.nextDir=k;e.preventDefault();}
});



// ── PROFILE SYSTEM ──
var USER_PROFILE = { name: '', level: 0, avatar: '⚡', joined: '' };

function initProfile(){
  const saved = localStorage.getItem('learno-profile');
  if(saved){
    try { USER_PROFILE = JSON.parse(saved); USER_LEVEL = USER_PROFILE.level || 0; computeUnlocks(); } catch(e){}
    return true; // profile exists
  }
  return false; // no profile
}

function saveProfile(){
  localStorage.setItem('learno-profile', JSON.stringify(USER_PROFILE));
  localStorage.setItem('learno-level', USER_PROFILE.level);
}

function showProfileSetup(){
  // Show profile setup MODAL over whatever screen is active
  const overlay = document.createElement('div');
  overlay.id = 'profile-setup-overlay';
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:9999;
    background:rgba(0,0,0,.92);backdrop-filter:blur(8px);
    display:flex;align-items:center;justify-content:center;
    animation:fi .4s ease;
  `;

  const lvlData = [
    {lvl:1,icon:'🌱',name:'Newbie',tag:'Starting from zero',desc:'Never written code. Ready to start from absolute scratch.',color:'#27c93f'},
    {lvl:2,icon:'⚙️',name:'Mediocre',tag:'Some experience',desc:'Touched HTML/CSS/JS before. Know basics, want to go deeper.',color:'#c9a84c'},
    {lvl:3,icon:'🔥',name:'Expert',tag:'You know the basics',desc:'Solid fundamentals. Algorithms, data structures, React are the goal.',color:'#e05252'},
  ];

  overlay.innerHTML = `
    <div style="
      background:linear-gradient(145deg,#13110a,#100e07);
      border:1px solid rgba(201,168,76,.3);border-radius:16px;
      padding:2.5rem 2rem;max-width:680px;width:94%;
      box-shadow:0 30px 80px rgba(0,0,0,.8),0 0 60px rgba(201,168,76,.08);
      max-height:90vh;overflow-y:auto;
    ">
      <div style="text-align:center;margin-bottom:2rem;">
        <div style="font-size:2.5rem;margin-bottom:.6rem;filter:drop-shadow(0 0 16px #c9a84c80);">👤</div>
        <div style="font-family:'Cinzel Decorative',serif;font-size:1.3rem;font-weight:900;color:var(--ny);margin-bottom:.3rem;">CREATE YOUR PROFILE</div>
        <div style="font-family:'Cinzel',serif;font-size:.65rem;color:var(--td);letter-spacing:3px;">TELL US WHO YOU ARE</div>
      </div>

      <div style="margin-bottom:1.4rem;">
        <div style="font-family:'Cinzel',serif;font-size:.65rem;color:var(--nc);letter-spacing:2px;margin-bottom:.5rem;">YOUR NAME</div>
        <input id="profile-name-input" type="text" maxlength="20" placeholder="Enter your name..."
          style="
            width:100%;padding:.75rem 1rem;
            background:rgba(201,168,76,.06);
            border:1px solid rgba(201,168,76,.3);border-radius:8px;
            color:var(--tm);font-family:'Crimson Pro',serif;font-size:1rem;
            outline:none;transition:border-color .2s;
          "
          onfocus="this.style.borderColor='#c9a84c'"
          onblur="this.style.borderColor='rgba(201,168,76,.3)'"
          oninput="document.getElementById('avatar-preview').textContent=this.value?this.value[0].toUpperCase():'?'"
        />
      </div>

      <div style="margin-bottom:1.5rem;">
        <div style="font-family:'Cinzel',serif;font-size:.65rem;color:var(--nc);letter-spacing:2px;margin-bottom:.5rem;">CHOOSE AVATAR</div>
        <div style="display:flex;gap:.5rem;flex-wrap:wrap;">
          ${['⚡','🔥','🌙','⚔️','🏆','🎮','🌀','🛸','🎯','💎'].map(a=>`
            <button onclick="selectAvatar('${a}',this)" style="
              font-size:1.3rem;padding:.4rem .6rem;background:rgba(255,255,255,.04);
              border:1.5px solid rgba(255,255,255,.1);border-radius:8px;cursor:pointer;
              transition:all .15s;
            "
            onmouseover="this.style.borderColor='#c9a84c80';this.style.background='rgba(201,168,76,.1)'"
            onmouseout="if(!this.classList.contains('av-sel')){this.style.borderColor='rgba(255,255,255,.1)';this.style.background='rgba(255,255,255,.04)'}"
            >${a}</button>
          `).join('')}
        </div>
      </div>

      <div style="margin-bottom:1.8rem;">
        <div style="font-family:'Cinzel',serif;font-size:.65rem;color:var(--nc);letter-spacing:2px;margin-bottom:.8rem;">SELECT YOUR LEVEL</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.8rem;" id="profile-lvl-grid">
          ${lvlData.map(e=>`
            <div class="pvl-card" data-lvl="${e.lvl}" onclick="selectProfileLevel(${e.lvl},this)" style="
              background:rgba(0,0,0,.3);border:2px solid rgba(255,255,255,.08);
              border-radius:10px;padding:1rem .8rem;text-align:center;cursor:pointer;
              transition:all .2s;
            "
            onmouseover="if(!this.classList.contains('pvl-sel')){this.style.borderColor='${e.color}60';this.style.transform='translateY(-3px)';}"
            onmouseout="if(!this.classList.contains('pvl-sel')){this.style.borderColor='rgba(255,255,255,.08)';this.style.transform='';}"
            >
              <div style="font-size:1.8rem;margin-bottom:.4rem;">${e.icon}</div>
              <div style="font-family:'Cinzel Decorative',serif;font-size:.7rem;font-weight:900;color:${e.color};margin-bottom:.2rem;">${e.name}</div>
              <div style="font-family:'Cinzel',serif;font-size:.55rem;color:rgba(255,255,255,.35);letter-spacing:1px;">${e.tag}</div>
            </div>
          `).join('')}
        </div>
        <div id="profile-lvl-desc" style="margin-top:.7rem;font-size:.78rem;color:var(--td);text-align:center;min-height:1.5rem;"></div>
      </div>

      <div style="text-align:center;">
        <button onclick="submitProfile()" style="
          font-family:'Cinzel Decorative',serif;font-size:.8rem;font-weight:700;letter-spacing:1.5px;
          padding:.85rem 2.5rem;
          background:linear-gradient(135deg,#c9a84c,#e8c97a,#b8922a);
          border:none;border-radius:8px;color:#080600;cursor:pointer;
          box-shadow:0 4px 20px rgba(201,168,76,.35);transition:all .2s;
        "
        onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 35px rgba(201,168,76,.55)';"
        onmouseout="this.style.transform='';this.style.boxShadow='0 4px 20px rgba(201,168,76,.35)';"
        >✦ START YOUR JOURNEY ✦</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // Auto-select first avatar
  setTimeout(()=>{
    const firstAv = overlay.querySelector('button');
    if(firstAv) selectAvatar('⚡', firstAv);
  }, 50);
}

var _selectedLvl = 0;
var _selectedAv = '⚡';

function selectAvatar(av, btn){
  _selectedAv = av;
  document.querySelectorAll('#profile-setup-overlay button[onclick^="selectAvatar"]').forEach(b=>{
    b.classList.remove('av-sel');
    b.style.borderColor='rgba(255,255,255,.1)';
    b.style.background='rgba(255,255,255,.04)';
  });
  btn.classList.add('av-sel');
  btn.style.borderColor='#c9a84c';
  btn.style.background='rgba(201,168,76,.18)';
  btn.style.transform='scale(1.15)';
}

const _lvlDescs = ['','Never written code. Chapters 1–3 unlocked — your journey starts fresh.','Some HTML/CSS/JS experience. Chapters 1–6 unlocked from the start.','Solid fundamentals. All 9 chapters unlocked. Chapter 10 awaits.'];

function selectProfileLevel(lvl, card){
  _selectedLvl = lvl;
  document.querySelectorAll('.pvl-card').forEach(c=>{
    c.classList.remove('pvl-sel');
    c.style.borderColor='rgba(255,255,255,.08)';
    c.style.transform='';
  });
  const colors = ['','#27c93f','#c9a84c','#e05252'];
  card.classList.add('pvl-sel');
  card.style.borderColor = colors[lvl];
  card.style.background = colors[lvl]+'18';
  card.style.transform = 'translateY(-3px)';
  const desc = document.getElementById('profile-lvl-desc');
  if(desc) desc.textContent = _lvlDescs[lvl];
}

function submitProfile(){
  const nameEl = document.getElementById('profile-name-input');
  const name = nameEl ? nameEl.value.trim() : '';
  if(!name){ nameEl.style.borderColor='#e05252'; nameEl.placeholder='Please enter your name!'; return; }
  if(!_selectedLvl){ 
    const desc = document.getElementById('profile-lvl-desc');
    if(desc){ desc.style.color='#e05252'; desc.textContent='Please select your experience level!'; }
    return;
  }
  USER_PROFILE = { name, level:_selectedLvl, avatar:_selectedAv, joined: new Date().toLocaleDateString('en-US',{month:'short',year:'numeric'}) };
  USER_LEVEL = _selectedLvl;
  saveProfile();
  computeUnlocks();
  // Remove overlay
  const ov = document.getElementById('profile-setup-overlay');
  if(ov){ ov.style.opacity='0'; ov.style.transition='opacity .4s'; setTimeout(()=>ov.remove(),400); }
  // Update profile icon
  updateProfileIcon();
  // Show welcome
  const lvlNames=['','Newbie','Mediocre','Expert'];
  const lvlIcons=['','🌱','⚙️','🔥'];
  setTimeout(()=>{
    showM(lvlIcons[_selectedLvl], 'Welcome, ' + name + '!',
      lvlNames[_selectedLvl]+' mode activated. '+(_selectedLvl===1?'Chapters 1–3 are open.':_selectedLvl===2?'Chapters 1–6 are unlocked.':'All 9 chapters are unlocked!'),
      'Your journey begins now.', ()=>{ gS('learn'); });
    // Save full profile to Supabase now that we have name + level + avatar
    if(SUPA_USER) supaUpsertProfile(name);
  }, 500);
}

// updateProfileIcon defined in backend
// showProfileCard → see marketplace


// ══════════════════════════════════════════
// CODE MEMORY GAME
// ══════════════════════════════════════════

const MEMORY_PAIRS = [
  { code: 'console.log()',   output: 'Prints to console' },
  { code: 'typeof "hi"',     output: '"string"' },
  { code: 'arr.push(x)',     output: 'Adds x to end' },
  { code: 'arr.pop()',       output: 'Removes last item' },
  { code: 'arr.length',      output: 'Count of items' },
  { code: 'str.toUpperCase()',output: 'ALL CAPS string' },
  { code: 'Math.floor(4.9)', output: '4' },
  { code: 'Math.random()',    output: '0 to 0.999...' },
  { code: 'parseInt("42")',  output: '42 (number)' },
  { code: 'arr.map(fn)',     output: 'New transformed array' },
  { code: 'arr.filter(fn)',  output: 'New filtered array' },
  { code: 'obj.keys()',      output: 'Array of key names' },
  { code: 'str.split(",")',  output: 'Array of substrings' },
  { code: 'arr.join("-")',   output: 'Joined string' },
  { code: 'str.includes(x)',  output: 'true or false' },
  { code: '=== operator',    output: 'Strict equality check' },
];

const MEM = {
  cards: [],
  flipped: [],
  matched: new Set(),
  moves: 0,
  startTime: null,
  timer: null,
  locked: false,
  pairsCount: 8,
};

function openMemory() {
  document.getElementById('games-hub').style.display = 'none';
  document.getElementById('memory-screen').style.display = 'block';
  initMemory();
}

function showMemoryHub() {
  clearInterval(MEM.timer);
  document.getElementById('memory-screen').style.display = 'none';
  document.getElementById('games-hub').style.display = 'block';
}

function initMemory() {
  MEM.moves = 0;
  MEM.matched = new Set();
  MEM.flipped = [];
  MEM.locked = false;
  MEM.startTime = null;
  clearInterval(MEM.timer);

  // Pick N random pairs and shuffle
  const shuffledPairs = [...MEMORY_PAIRS].sort(() => Math.random() - 0.5).slice(0, MEM.pairsCount);
  const deck = [];
  shuffledPairs.forEach((pair, i) => {
    deck.push({ id: i, pairId: i, type: 'code',   text: pair.code,   matched: false });
    deck.push({ id: i + MEM.pairsCount, pairId: i, type: 'output', text: pair.output, matched: false });
  });
  MEM.cards = deck.sort(() => Math.random() - 0.5);

  renderMemoryBoard();
  updateMemoryUI();
}

function renderMemoryBoard() {
  const board = document.getElementById('mem-board');
  board.innerHTML = '';
  MEM.cards.forEach((card, idx) => {
    const el = document.createElement('div');
    el.className = 'mem-card';
    el.dataset.idx = idx;
    el.innerHTML = `
      <div class="mem-card-inner">
        <div class="mem-card-front">
          <span style="font-size:1.4rem">💻</span>
        </div>
        <div class="mem-card-back ${card.type === 'code' ? 'mem-code' : 'mem-output'}">
          <span class="mem-type-label">${card.type === 'code' ? 'CODE' : 'OUTPUT'}</span>
          <span class="mem-card-text"></span>
        </div>
      </div>`;
    // Set text via textContent to avoid HTML parsing issues
    el.querySelector('.mem-card-text').textContent = card.text;
    el.addEventListener('click', () => flipMemCard(idx));
    board.appendChild(el);
  });
}

function flipMemCard(idx) {
  if (MEM.locked) return;
  if (MEM.matched.has(idx)) return;
  if (MEM.flipped.includes(idx)) return;
  if (MEM.flipped.length >= 2) return;

  // Start timer on first flip
  if (!MEM.startTime) {
    MEM.startTime = Date.now();
    MEM.timer = setInterval(updateMemoryTimer, 1000);
  }

  const el = document.getElementById('mem-board').children[idx];
  el.classList.add('flipped');
  MEM.flipped.push(idx);

  if (MEM.flipped.length === 2) {
    MEM.moves++;
    MEM.locked = true;
    updateMemoryUI();
    checkMemMatch();
  }
}

function checkMemMatch() {
  const [i1, i2] = MEM.flipped;
  const c1 = MEM.cards[i1];
  const c2 = MEM.cards[i2];
  const board = document.getElementById('mem-board');

  if (c1.pairId === c2.pairId && c1.type !== c2.type) {
    // MATCH
    setTimeout(() => {
      board.children[i1].classList.add('mem-matched');
      board.children[i2].classList.add('mem-matched');
      MEM.matched.add(i1);
      MEM.matched.add(i2);
      MEM.flipped = [];
      MEM.locked = false;
      addXP(25, 'Memory match!');
      updateMemoryUI();

      if (MEM.matched.size === MEM.cards.length) {
        memoryWin();
      }
    }, 500);
  } else {
    // NO MATCH
    setTimeout(() => {
      board.children[i1].classList.remove('flipped');
      board.children[i2].classList.remove('flipped');
      MEM.flipped = [];
      MEM.locked = false;
    }, 900);
  }
}

function memoryWin() {
  clearInterval(MEM.timer);
  const elapsed = MEM.startTime ? Math.round((Date.now() - MEM.startTime) / 1000) : 0;
  const xpBonus = Math.max(50, 300 - MEM.moves * 5);
  addXP(xpBonus, 'Memory game complete!');
  checkBadge_memory(MEM.moves);
  setTimeout(() => {
    showM('🏆', 'Memory Master!',
      `Matched all ${MEM.pairsCount} pairs in ${MEM.moves} moves and ${elapsed}s!`,
      `+${xpBonus} XP bonus!`,
      () => initMemory());
  }, 400);
}

function updateMemoryTimer() {
  if (!MEM.startTime) return;
  const el = document.getElementById('mem-time');
  if (el) el.textContent = Math.round((Date.now() - MEM.startTime) / 1000) + 's';
}

function updateMemoryUI() {
  const movesEl = document.getElementById('mem-moves');
  const matchesEl = document.getElementById('mem-matches');
  if (movesEl) movesEl.textContent = MEM.moves;
  if (matchesEl) matchesEl.textContent = (MEM.matched.size / 2) + ' / ' + MEM.pairsCount;
}


// ══════════════════════════════════════════
// TOWER BUILD GAME
// ══════════════════════════════════════════
// Drop blocks by answering correctly. Wrong = block smaller. Pile falls = game over.

const TB = {
  canvas: null,
  ctx: null,
  animFrame: null,
  running: false,
  blocks: [],          // stacked blocks [{x, y, w, h, color, label}]
  fallingBlock: null,  // the block currently falling
  swingBlock: null,    // the swinging block at the top
  swing: { x: 0, dir: 1, speed: 3, range: 0 },
  currentQ: null,
  score: 0,
  xpEarned: 0,
  streak: 0,
  phase: 'idle',      // 'idle' | 'question' | 'falling' | 'gameover' | 'win'
  dropY: 0,
  CANVAS_W: 340,
  CANVAS_H: 520,
  BASE_W: 180,
  BLOCK_H: 28,
  colors: ['#c9a84c','#e8c97a','#f0d080','#d4af37','#b8922a','#a07020','#e8c97a','#f0d080'],
  maxBlocks: 15,
  bgParticles: [],
};

function openTower() {
  document.getElementById('games-hub').style.display = 'none';
  document.getElementById('tower-screen').style.display = 'block';
  initTower();
}

function showTowerHub() {
  TB.running = false;
  if (TB.animFrame) cancelAnimationFrame(TB.animFrame);
  document.getElementById('tower-screen').style.display = 'none';
  document.getElementById('games-hub').style.display = 'block';
}

function initTower() {
  TB.canvas = document.getElementById('tower-canvas');
  TB.ctx = TB.canvas.getContext('2d');
  TB.canvas.width = TB.CANVAS_W;
  TB.canvas.height = TB.CANVAS_H;
  TB.blocks = [];
  TB.score = 0;
  TB.xpEarned = 0;
  TB.streak = 0;
  TB.phase = 'idle';
  TB.running = true;
  TB.currentQ = null;
  TB.fallingBlock = null;

  // Spawn background particles
  TB.bgParticles = [];
  for (let i = 0; i < 30; i++) {
    TB.bgParticles.push({
      x: Math.random() * TB.CANVAS_W,
      y: Math.random() * TB.CANVAS_H,
      r: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.4 + 0.1,
    });
  }

  // Place a base block
  TB.blocks.push({
    x: (TB.CANVAS_W - TB.BASE_W) / 2,
    y: TB.CANVAS_H - TB.BLOCK_H - 10,
    w: TB.BASE_W,
    h: TB.BLOCK_H,
    color: '#c9a84c',
    label: 'BASE',
    isBase: true,
  });

  updateTowerUI();
  document.getElementById('tower-overlay').style.display = 'flex';
  document.getElementById('tower-q-area').style.display = 'none';

  if (TB.animFrame) cancelAnimationFrame(TB.animFrame);
  TB.animFrame = requestAnimationFrame(towerLoop);
}

function startTower() {
  document.getElementById('tower-overlay').style.display = 'none';
  TB.phase = 'question';
  loadNextTowerQ();
}

function loadNextTowerQ() {
  if (!TB.running) return;
  TB.currentQ = rndSnakeQ();
  TB.phase = 'question';

  // Setup swinging block at top
  const topBlock = TB.blocks[TB.blocks.length - 1];
  const prevW = topBlock ? topBlock.w : TB.BASE_W;
  const newW = Math.max(40, prevW - (TB.blocks.length > 3 ? 4 : 0));

  TB.swingBlock = {
    w: newW,
    h: TB.BLOCK_H,
    y: 60,
    color: TB.colors[TB.blocks.length % TB.colors.length],
  };

  // Swing range narrows as tower gets taller (harder)
  const difficulty = Math.min(TB.blocks.length * 4, 80);
  TB.swing.range = (TB.CANVAS_W / 2) - (newW / 2) - 10 + difficulty;
  TB.swing.x = TB.CANVAS_W / 2 - newW / 2;
  TB.swing.speed = 2.5 + TB.blocks.length * 0.25;
  TB.swing.dir = 1;

  // Show question
  renderTowerQuestion();
  document.getElementById('tower-q-area').style.display = 'block';
}

function renderTowerQuestion() {
  const q = TB.currentQ;
  const area = document.getElementById('tower-q-area');
  area.innerHTML = '';

  const qText = document.createElement('div');
  qText.style.cssText = 'font-size:.82rem;font-weight:700;margin-bottom:.7rem;line-height:1.4;color:var(--tm);';
  qText.textContent = q.q;
  area.appendChild(qText);

  const grid = document.createElement('div');
  grid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:.4rem;';

  const colors = ['#e05252', '#c9a84c', '#f0d080', '#27c93f'];
  const labs = ['A', 'B', 'C', 'D'];

  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.style.cssText = `
      padding:.5rem .6rem;border-radius:7px;cursor:pointer;
      border:1px solid ${colors[i]}50;background:${colors[i]}12;
      color:var(--tm);font-family:'Crimson Pro',serif;font-size:.78rem;
      text-align:left;transition:all .15s;display:flex;align-items:center;gap:.4rem;
    `;
    btn.addEventListener('mouseover', () => { btn.style.background = colors[i] + '25'; btn.style.borderColor = colors[i] + '90'; });
    btn.addEventListener('mouseout', () => { btn.style.background = colors[i] + '12'; btn.style.borderColor = colors[i] + '50'; });

    const lbl = document.createElement('span');
    lbl.style.cssText = `font-family:'Cinzel',serif;font-size:.6rem;color:${colors[i]};flex-shrink:0;`;
    lbl.textContent = labs[i];
    btn.appendChild(lbl);

    const txt = document.createElement('span');
    txt.textContent = opt; // textContent - safe
    btn.appendChild(txt);

    btn.addEventListener('click', () => answerTower(i));
    grid.appendChild(btn);
  });
  area.appendChild(grid);
}

function answerTower(chosen) {
  if (TB.phase !== 'question') return;
  const q = TB.currentQ;
  const correct = chosen === q.ans;

  // Disable all buttons
  const btns = document.querySelectorAll('#tower-q-area button');
  btns.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.ans) {
      btn.style.background = 'rgba(39,201,63,.25)';
      btn.style.borderColor = '#27c93f';
      btn.style.color = '#27c93f';
    } else if (i === chosen && !correct) {
      btn.style.background = 'rgba(224,82,82,.2)';
      btn.style.borderColor = '#e05252';
      btn.style.color = '#e05252';
    }
  });

  // Show feedback text
  const fb = document.createElement('div');
  fb.style.cssText = `margin-top:.5rem;font-size:.75rem;padding:.4rem .6rem;border-radius:6px;
    ${correct ? 'background:rgba(39,201,63,.1);border:1px solid #27c93f40;color:#27c93f;'
              : 'background:rgba(224,82,82,.1);border:1px solid #e0525240;color:#e88f8f;'}`;
  fb.textContent = (correct ? '✅ ' : '❌ ') + q.exp;
  document.getElementById('tower-q-area').appendChild(fb);

  setTimeout(() => {
    document.getElementById('tower-q-area').style.display = 'none';
    if (correct) {
      TB.streak++;
      const xpGain = 20 + TB.streak * 5;
      TB.xpEarned += xpGain;
      TB.score += 100;
      addXP(xpGain, 'Tower answer!');
      dropTowerBlock(true);
    } else {
      TB.streak = 0;
      // Wrong: block falls but is narrower (penalised)
      TB.swingBlock.w = Math.max(25, TB.swingBlock.w - 30);
      dropTowerBlock(false);
    }
    updateTowerUI();
  }, 1200);
}

function dropTowerBlock(correct) {
  if (!TB.swingBlock) return;
  TB.phase = 'falling';

  // The block lands centred-ish on the swing position
  const topBlock = TB.blocks[TB.blocks.length - 1];
  const targetY = topBlock.y - TB.BLOCK_H - 2;

  TB.fallingBlock = {
    x: TB.swing.x,
    y: TB.swingBlock.y,
    w: TB.swingBlock.w,
    h: TB.BLOCK_H,
    color: TB.swingBlock.color,
    targetY: targetY,
    correct: correct,
    speed: 0,
  };
}

function updateFallingBlock() {
  if (!TB.fallingBlock) return;
  const fb = TB.fallingBlock;

  fb.speed += 0.6; // gravity
  fb.y += fb.speed;

  if (fb.y >= fb.targetY) {
    fb.y = fb.targetY;

    // Check if it lands on the tower
    const topBlock = TB.blocks[TB.blocks.length - 1];
    const overlapLeft = Math.max(fb.x, topBlock.x);
    const overlapRight = Math.min(fb.x + fb.w, topBlock.x + topBlock.w);
    const overlap = overlapRight - overlapLeft;

    if (overlap < 20) {
      // Missed entirely
      TB.fallingBlock = null;
      TB.phase = 'gameover';
      towerGameOver(false, 'Block missed the tower!');
      return;
    }

    // Trim the block to overlap (Tetris-style)
    const trimmedBlock = {
      x: overlapLeft,
      y: fb.targetY,
      w: overlap,
      h: TB.BLOCK_H,
      color: fb.color,
    };

    TB.blocks.push(trimmedBlock);
    TB.fallingBlock = null;
    checkBadge_towerHeight(TB.blocks.length - 1);

    // Check win
    if (TB.blocks.length - 1 >= TB.maxBlocks) { // -1 for base
      TB.phase = 'win';
      towerGameOver(true, '');
      return;
    }

    TB.phase = 'question';
    setTimeout(loadNextTowerQ, 300);
  }
}

function towerGameOver(won, reason) {
  TB.running = false;
  addXP(TB.xpEarned, 'Tower Build session');

  const height = TB.blocks.length - 1;
  setTimeout(() => {
    if (won) {
      showM('🏗️', 'TOWER COMPLETE!',
        `You built a ${height}-block tower! Master builder!`,
        `+${TB.xpEarned} XP earned!`,
        () => { TB.running = true; initTower(); });
    } else {
      showM('💥', 'TOWER COLLAPSED!',
        `${reason} Your tower was ${height} blocks tall. Score: ${TB.score}`,
        `+${TB.xpEarned} XP earned`,
        () => { TB.running = true; initTower(); });
    }
  }, 600);
}

function updateTowerUI() {
  const scoreEl = document.getElementById('tb-score');
  const heightEl = document.getElementById('tb-height');
  const streakEl = document.getElementById('tb-streak');
  const xpEl = document.getElementById('tb-xp');
  if (scoreEl) scoreEl.textContent = TB.score;
  if (heightEl) heightEl.textContent = (TB.blocks.length - 1);
  if (streakEl) streakEl.textContent = TB.streak + ' 🔥';
  if (xpEl) xpEl.textContent = TB.xpEarned;
}

// ── TOWER DRAW LOOP ──
function towerLoop() {
  if (!TB.running) return;
  drawTower();
  if (TB.phase === 'question' && TB.swingBlock) {
    // Swing the block left and right
    TB.swing.x += TB.swing.dir * TB.swing.speed;
    const minX = 10;
    const maxX = TB.CANVAS_W - TB.swingBlock.w - 10;
    if (TB.swing.x <= minX) { TB.swing.x = minX; TB.swing.dir = 1; }
    if (TB.swing.x >= maxX) { TB.swing.x = maxX; TB.swing.dir = -1; }
  }
  if (TB.phase === 'falling') {
    updateFallingBlock();
  }
  TB.animFrame = requestAnimationFrame(towerLoop);
}

function drawTower() {
  const cv = TB.canvas;
  const ctx = TB.ctx;
  if (!ctx) return;
  const W = TB.CANVAS_W, H = TB.CANVAS_H;

  // Background
  ctx.fillStyle = '#0a0800';
  ctx.fillRect(0, 0, W, H);

  // Grid lines
  ctx.strokeStyle = 'rgba(201,168,76,.04)';
  ctx.lineWidth = 0.5;
  for (let x = 0; x < W; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  // Background particles
  TB.bgParticles.forEach(p => {
    p.y -= p.speed;
    if (p.y < 0) p.y = H;
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = '#c9a84c';
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  // Tower height guide lines
  const totalHeight = TB.maxBlocks * (TB.BLOCK_H + 2);
  for (let i = 1; i <= TB.maxBlocks; i++) {
    const lineY = H - 10 - TB.BLOCK_H - (i * (TB.BLOCK_H + 2));
    ctx.strokeStyle = 'rgba(201,168,76,.08)';
    ctx.lineWidth = 0.5;
    ctx.setLineDash([3, 6]);
    ctx.beginPath();
    ctx.moveTo(0, lineY);
    ctx.lineTo(W, lineY);
    ctx.stroke();
    // Level number
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(201,168,76,.2)';
    ctx.font = '9px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(i, 4, lineY - 2);
  }
  ctx.setLineDash([]);

  // Draw stacked blocks
  TB.blocks.forEach((block, i) => {
    const isBase = block.isBase;
    const grd = ctx.createLinearGradient(block.x, block.y, block.x, block.y + block.h);
    grd.addColorStop(0, isBase ? '#d4af37' : block.color + 'ee');
    grd.addColorStop(1, isBase ? '#a07020' : block.color + '99');
    ctx.fillStyle = grd;
    ctx.shadowColor = block.color;
    ctx.shadowBlur = i === TB.blocks.length - 1 ? 12 : 4;
    roundedRectTB(ctx, block.x, block.y, block.w, block.h, 4);
    ctx.fill();

    // Top highlight
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    roundedRectTB(ctx, block.x + 2, block.y + 1, block.w - 4, 5, 2);
    ctx.fill();

    // Block number
    if (!isBase) {
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.font = `bold ${Math.min(11, block.h * 0.4)}px 'Cinzel', serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(i, block.x + block.w / 2, block.y + block.h / 2);
    }
  });
  ctx.shadowBlur = 0;

  // Swinging block at top
  if (TB.phase === 'question' && TB.swingBlock) {
    const sx = TB.swing.x;
    const sy = TB.swingBlock.y;
    const sw = TB.swingBlock.w;
    const sh = TB.BLOCK_H;
    const col = TB.swingBlock.color;

    // Rope
    ctx.strokeStyle = 'rgba(201,168,76,.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(W / 2, 0);
    ctx.lineTo(sx + sw / 2, sy);
    ctx.stroke();

    // Block glow + body
    ctx.shadowColor = col;
    ctx.shadowBlur = 16;
    const bgrd = ctx.createLinearGradient(sx, sy, sx, sy + sh);
    bgrd.addColorStop(0, col + 'ff');
    bgrd.addColorStop(1, col + 'aa');
    ctx.fillStyle = bgrd;
    roundedRectTB(ctx, sx, sy, sw, sh, 4);
    ctx.fill();
    // Highlight
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,255,255,.22)';
    roundedRectTB(ctx, sx + 2, sy + 1, sw - 4, 5, 2);
    ctx.fill();

    // Drop zone indicator on top of tower
    const top = TB.blocks[TB.blocks.length - 1];
    ctx.strokeStyle = col + '60';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(top.x, top.y - TB.BLOCK_H - 4, top.w, TB.BLOCK_H);
    ctx.setLineDash([]);
  }

  // Falling block
  if (TB.fallingBlock) {
    const fb = TB.fallingBlock;
    ctx.shadowColor = fb.color;
    ctx.shadowBlur = 12;
    const fgrd = ctx.createLinearGradient(fb.x, fb.y, fb.x, fb.y + fb.h);
    fgrd.addColorStop(0, fb.color + 'ff');
    fgrd.addColorStop(1, fb.color + '99');
    ctx.fillStyle = fgrd;
    roundedRectTB(ctx, fb.x, fb.y, fb.w, fb.h, 4);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Tower height indicator (right side)
  const blocksBuilt = TB.blocks.length - 1;
  const pct = blocksBuilt / TB.maxBlocks;
  const barH = H - 30;
  const barX = W - 14;
  ctx.fillStyle = 'rgba(255,255,255,.05)';
  ctx.fillRect(barX, 15, 6, barH);
  const fillH = barH * pct;
  const barGrd = ctx.createLinearGradient(0, 15 + barH - fillH, 0, 15 + barH);
  barGrd.addColorStop(0, '#f0d080');
  barGrd.addColorStop(1, '#c9a84c');
  ctx.fillStyle = barGrd;
  ctx.fillRect(barX, 15 + barH - fillH, 6, fillH);
  ctx.strokeStyle = 'rgba(201,168,76,.25)';
  ctx.lineWidth = 1;
  ctx.strokeRect(barX, 15, 6, barH);

  // "MAX" label at top of bar
  ctx.fillStyle = 'rgba(201,168,76,.5)';
  ctx.font = '8px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('MAX', barX + 3, 12);
}

function roundedRectTB(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}



// toggleAvatarPicker → see marketplace

// ════════════════════════════════════════
// SHOP / MARKETPLACE SYSTEM
// ════════════════════════════════════════

// Shop inventory — avatars and nametags purchasable with XP
var SHOP_ITEMS = [
  // AVATARS
  {id:'av_robot',    type:'avatar', icon:'🤖', name:'The Bot',        desc:'Cold. Calculated. Correct.',        price:100,  owned:false},
  {id:'av_ninja',    type:'avatar', icon:'🥷', name:'Code Ninja',     desc:'Strikes fast, leaves no bugs.',     price:150,  owned:false},
  {id:'av_wizard',   type:'avatar', icon:'🧙', name:'Wizard',         desc:'Magic is just good code.',          price:200,  owned:false},
  {id:'av_alien',    type:'avatar', icon:'👽', name:'Alien Dev',      desc:'Your code is not from this world.', price:200,  owned:false},
  {id:'av_skull',    type:'avatar', icon:'💀', name:'Skull',          desc:'Debugging till death.',             price:250,  owned:false},
  {id:'av_crown',    type:'avatar', icon:'👑', name:'King',           desc:'The leaderboard is your throne.',   price:300,  owned:false},
  {id:'av_ghost',    type:'avatar', icon:'👻', name:'Ghost Coder',    desc:'Vanishes from meetings.',           price:300,  owned:false},
  {id:'av_devil',    type:'avatar', icon:'😈', name:'Dark Mode',      desc:'Chaos-driven development.',         price:350,  owned:false},
  {id:'av_dragon',   type:'avatar', icon:'🐲', name:'Dragon',         desc:'Burns every bug to ash.',           price:400,  owned:false},
  {id:'av_samurai',  type:'avatar', icon:'⛩️', name:'Samurai',        desc:'One function. One purpose.',        price:400,  owned:false},
  {id:'av_cyborg',   type:'avatar', icon:'🦾', name:'Cyborg',         desc:'Half human. All dev.',              price:500,  owned:false},
  {id:'av_phoenix',  type:'avatar', icon:'🦅', name:'Phoenix Dev',    desc:'Rises from every failed build.',    price:600,  owned:false},
  // NAMETAGS
  {id:'nt_rookie',   type:'nametag', icon:'🏷️', name:'Rookie Coder',  desc:'Everyone starts somewhere.',        price:80,   owned:false},
  {id:'nt_hacker',   type:'nametag', icon:'💻', name:'Hacker',         desc:'I hack, therefore I am.',           price:150,  owned:false},
  {id:'nt_debug',    type:'nametag', icon:'🐛', name:'Bug Hunter',     desc:'404: bugs not found.',              price:200,  owned:false},
  {id:'nt_fullstack',type:'nametag', icon:'📦', name:'Full Stack',     desc:'I do everything and hate it.',      price:250,  owned:false},
  {id:'nt_10x',      type:'nametag', icon:'⚡', name:'10x Dev',        desc:'Myth. Legend. Real.',               price:300,  owned:false},
  {id:'nt_lord',     type:'nametag', icon:'🏰', name:'Code Lord',      desc:'My repo, my rules.',                price:350,  owned:false},
  {id:'nt_sigma',    type:'nametag', icon:'🔱', name:'Sigma Dev',      desc:'Grindset: 24/7.',                   price:400,  owned:false},
  {id:'nt_legend',   type:'nametag', icon:'👾', name:'LearnO Legend',  desc:'Born in the quiz. Tempered by fire.',price:600, owned:false},
];

// Currently equipped nametag (bought from shop or unlocked by level)
var EQUIPPED_NAMETAG = '';

function saveShopState(){
  try {
    localStorage.setItem('learno-shop', JSON.stringify(SHOP_ITEMS.map(function(i){ return i.owned; })));
    localStorage.setItem('learno-nametag', EQUIPPED_NAMETAG);
  } catch(e){}
}

function loadShopState(){
  try {
    var s = localStorage.getItem('learno-shop');
    if(s){
      var arr = JSON.parse(s);
      arr.forEach(function(owned, i){ if(SHOP_ITEMS[i]) SHOP_ITEMS[i].owned = owned; });
    }
    var nt = localStorage.getItem('learno-nametag');
    if(nt) EQUIPPED_NAMETAG = nt;
  } catch(e){}
}

function openShop(){
  // Remove any existing overlay
  var ex = document.getElementById('shop-overlay');
  if(ex) ex.remove();

  var overlay = document.createElement('div');
  overlay.id = 'shop-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:9995;background:rgba(0,0,0,.88);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;animation:fi .3s ease;';
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });

  var modal = document.createElement('div');
  modal.style.cssText = 'background:linear-gradient(145deg,#13110a,#0a0800);border:1px solid rgba(201,168,76,.3);border-radius:16px;width:min(680px,95vw);max-height:88vh;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 40px 100px rgba(0,0,0,.9),0 0 60px rgba(201,168,76,.08);';

  // Header
  var header = document.createElement('div');
  header.style.cssText = 'padding:1.4rem 1.6rem 1rem;border-bottom:1px solid rgba(201,168,76,.15);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;';

  var titleWrap = document.createElement('div');
  var title = document.createElement('div');
  title.style.cssText = "font-family:'Cinzel Decorative',serif;font-size:1.1rem;font-weight:900;color:var(--ny);";
  title.textContent = '🛒 MARKETPLACE';
  var sub = document.createElement('div');
  sub.style.cssText = "font-family:'Cinzel',serif;font-size:.6rem;color:var(--td);letter-spacing:2px;margin-top:.2rem;";
  sub.textContent = 'SPEND XP · EQUIP AVATARS & NAMETAGS';
  titleWrap.appendChild(title);
  titleWrap.appendChild(sub);

  var balanceWrap = document.createElement('div');
  balanceWrap.style.cssText = 'text-align:right;';
  var balLabel = document.createElement('div');
  balLabel.style.cssText = "font-family:'Cinzel',serif;font-size:.55rem;color:var(--td);letter-spacing:2px;";
  balLabel.textContent = 'YOUR BALANCE';
  var balVal = document.createElement('div');
  balVal.id = 'shop-balance';
  balVal.style.cssText = "font-family:'Cinzel Decorative',serif;font-size:1.1rem;font-weight:900;color:#f0d080;";
  balVal.textContent = ST.xp + ' XP';
  balanceWrap.appendChild(balLabel);
  balanceWrap.appendChild(balVal);

  var closeBtn = document.createElement('button');
  closeBtn.style.cssText = 'background:none;border:none;color:var(--td);font-size:1.3rem;cursor:pointer;margin-left:1rem;';
  closeBtn.textContent = '✕';
  closeBtn.addEventListener('click', function(){ overlay.remove(); });

  header.appendChild(titleWrap);
  header.appendChild(balanceWrap);
  header.appendChild(closeBtn);
  modal.appendChild(header);

  // Tab bar
  var tabs = document.createElement('div');
  tabs.style.cssText = 'display:flex;gap:.4rem;padding:.8rem 1.4rem .4rem;flex-shrink:0;';
  var tabData = [{id:'all',label:'ALL'},{id:'avatar',label:'AVATARS'},{id:'nametag',label:'NAMETAGS'}];
  var activeTab = 'all';

  function renderShopItems(filter){
    grid.innerHTML = '';
    var items = SHOP_ITEMS.filter(function(i){ return filter==='all' || i.type===filter; });
    items.forEach(function(item){
      var card = buildShopCard(item, overlay);
      grid.appendChild(card);
    });
  }

  tabData.forEach(function(t){
    var btn = document.createElement('button');
    btn.dataset.tab = t.id;
    btn.style.cssText = "font-family:'Cinzel',serif;font-size:.62rem;padding:.35rem .9rem;border-radius:6px;cursor:pointer;letter-spacing:1px;transition:all .2s;border:1px solid " + (t.id==='all'?'rgba(201,168,76,.5);background:rgba(201,168,76,.12);color:var(--ny);':'rgba(255,255,255,.1);background:none;color:var(--td);');
    btn.textContent = t.label;
    btn.addEventListener('click', function(){
      tabs.querySelectorAll('button').forEach(function(b){
        b.style.borderColor='rgba(255,255,255,.1)';b.style.background='none';b.style.color='var(--td)';
      });
      btn.style.borderColor='rgba(201,168,76,.5)';btn.style.background='rgba(201,168,76,.12)';btn.style.color='var(--ny)';
      activeTab = t.id;
      renderShopItems(activeTab);
    });
    tabs.appendChild(btn);
  });
  modal.appendChild(tabs);

  // Grid
  var grid = document.createElement('div');
  grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:.8rem;padding:1rem 1.4rem 1.4rem;overflow-y:auto;flex:1;';
  modal.appendChild(grid);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  renderShopItems('all');
}

function buildShopCard(item, overlay){
  var card = document.createElement('div');
  var isOwned = item.owned;
  var isEquipped = (item.type==='avatar' && USER_PROFILE.avatar===item.icon) ||
                   (item.type==='nametag' && EQUIPPED_NAMETAG===item.name);
  var canAfford = ST.xp >= item.price;

  card.style.cssText = 'background:linear-gradient(145deg,#13110a,#0f0d00);border:1px solid ' +
    (isEquipped ? 'rgba(201,168,76,.7)' : isOwned ? 'rgba(201,168,76,.3)' : 'rgba(255,255,255,.08)') +
    ';border-radius:12px;padding:1rem;text-align:center;transition:all .2s;position:relative;';

  if(isEquipped){
    var eqBadge = document.createElement('div');
    eqBadge.style.cssText = "position:absolute;top:.5rem;right:.5rem;font-family:'Cinzel',serif;font-size:.45rem;color:#c9a84c;letter-spacing:1px;background:rgba(201,168,76,.15);border:1px solid rgba(201,168,76,.3);border-radius:4px;padding:.15rem .4rem;";
    eqBadge.textContent = 'EQUIPPED';
    card.appendChild(eqBadge);
  }

  var iconDiv = document.createElement('div');
  iconDiv.style.cssText = 'font-size:2.2rem;margin-bottom:.5rem;' + (!isOwned && !canAfford ? 'filter:grayscale(.7) opacity(.5);' : '');
  iconDiv.textContent = item.icon;
  card.appendChild(iconDiv);

  var typeLabel = document.createElement('div');
  typeLabel.style.cssText = "font-family:'Cinzel',serif;font-size:.48rem;letter-spacing:2px;color:" + (item.type==='avatar'?'#c9a84c':'#61dafb') + ";margin-bottom:.2rem;";
  typeLabel.textContent = item.type.toUpperCase();
  card.appendChild(typeLabel);

  var nameDiv = document.createElement('div');
  nameDiv.style.cssText = "font-family:'Cinzel Decorative',serif;font-size:.72rem;font-weight:700;color:var(--ny);margin-bottom:.25rem;";
  nameDiv.textContent = item.name;
  card.appendChild(nameDiv);

  var descDiv = document.createElement('div');
  descDiv.style.cssText = "font-size:.65rem;color:var(--td);line-height:1.4;margin-bottom:.7rem;";
  descDiv.textContent = item.desc;
  card.appendChild(descDiv);

  var actionBtn = document.createElement('button');
  actionBtn.style.cssText = "font-family:'Cinzel',serif;font-size:.58rem;width:100%;padding:.4rem .6rem;border-radius:7px;cursor:pointer;letter-spacing:1px;transition:all .15s;font-weight:700;";

  if(isEquipped){
    actionBtn.textContent = '✓ EQUIPPED';
    actionBtn.style.cssText += 'background:rgba(201,168,76,.15);border:1px solid rgba(201,168,76,.4);color:#c9a84c;cursor:default;';
  } else if(isOwned){
    actionBtn.textContent = item.type==='avatar' ? '👆 EQUIP' : '🏷️ EQUIP';
    actionBtn.style.cssText += 'background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.35);color:var(--ny);';
    actionBtn.addEventListener('mouseenter', function(){ actionBtn.style.background='rgba(201,168,76,.2)'; });
    actionBtn.addEventListener('mouseleave', function(){ actionBtn.style.background='rgba(201,168,76,.1)'; });
    actionBtn.addEventListener('click', function(){
      equipShopItem(item);
      overlay.remove();
      openShop();
    });
  } else {
    actionBtn.textContent = '⚡ ' + item.price + ' XP';
    if(canAfford){
      actionBtn.style.cssText += 'background:linear-gradient(135deg,#c9a84c,#e8c97a);border:none;color:#080600;';
      actionBtn.addEventListener('mouseenter', function(){ actionBtn.style.transform='translateY(-2px)';actionBtn.style.boxShadow='0 4px 16px rgba(201,168,76,.4)'; });
      actionBtn.addEventListener('mouseleave', function(){ actionBtn.style.transform='';actionBtn.style.boxShadow=''; });
      actionBtn.addEventListener('click', function(){
        buyShopItem(item);
        overlay.remove();
        openShop();
      });
    } else {
      actionBtn.style.cssText += 'background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.25);cursor:not-allowed;';
      actionBtn.title = 'Need ' + (item.price - ST.xp) + ' more XP';
    }
  }
  card.appendChild(actionBtn);
  return card;
}

function buyShopItem(item){
  if(item.owned) return;
  if(ST.xp < item.price){ showM('❌','Not Enough XP','You need ' + item.price + ' XP to buy this.','Keep playing to earn more!',function(){}); return; }
  // Deduct XP
  ST.xp -= item.price;
  ST.lv = Math.floor(ST.xp/500)+1;
  updXP(); updLB();
  item.owned = true;
  saveShopState(); saveBadgeState();
  // Auto-equip
  equipShopItem(item);
  showM('🎉', 'Purchased!', item.icon + ' ' + item.name + ' is now yours!', 'XP spent: ' + item.price, function(){});
}

function equipShopItem(item){
  if(!item.owned) return;
  if(item.type==='avatar'){
    USER_PROFILE.avatar = item.icon;
    saveProfile();
    updateProfileIcon();
  } else {
    EQUIPPED_NAMETAG = item.name;
    saveShopState();
  }
}

// ════════════════════════════════════════
// UPDATED showProfileCard — badges count + shop button
// ════════════════════════════════════════
function showProfileCard(){
  if(!USER_PROFILE.name){ showProfileSetup(); return; }

  var ex = document.getElementById('profile-card-overlay');
  if(ex) ex.remove();

  var lvlColors=['','#27c93f','#c9a84c','#e05252'];
  var lvlNames=['','🌱 NEWBIE','⚙️ MEDIOCRE','🔥 EXPERT'];
  var lc = lvlColors[USER_PROFILE.level] || '#c9a84c';
  var badgesUnlocked = ST.ach.filter(function(a){ return a.ul; }).length;
  var nametag = EQUIPPED_NAMETAG || getCurrentNametag();
  var xpToNext = 500 - (ST.xp % 500);
  var xpPct = ((ST.xp % 500) / 500 * 100).toFixed(0);

  var overlay = document.createElement('div');
  overlay.id = 'profile-card-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,.8);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;animation:fi .3s ease;';
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });

  var card = document.createElement('div');
  card.style.cssText = 'background:linear-gradient(145deg,#13110a,#0f0d02);border:1px solid '+lc+'50;border-radius:16px;padding:1.8rem;max-width:360px;width:92%;box-shadow:0 30px 80px rgba(0,0,0,.8),0 0 40px '+lc+'15;position:relative;max-height:90vh;overflow-y:auto;';

  // Close button
  var closeBtn = document.createElement('button');
  closeBtn.style.cssText = 'position:absolute;top:.8rem;right:.8rem;background:none;border:none;color:var(--td);font-size:1.2rem;cursor:pointer;';
  closeBtn.textContent = '✕';
  closeBtn.addEventListener('click', function(){ overlay.remove(); });
  card.appendChild(closeBtn);

  // Avatar (clickable to open picker)
  var avWrap = document.createElement('div');
  avWrap.style.cssText = 'text-align:center;margin-bottom:1.2rem;';

  var avEl = document.createElement('div');
  avEl.style.cssText = 'font-size:3.5rem;margin-bottom:.4rem;filter:drop-shadow(0 0 20px '+lc+'80);cursor:pointer;display:inline-block;transition:transform .2s;';
  avEl.textContent = USER_PROFILE.avatar;
  avEl.title = 'Click to change avatar';
  avEl.addEventListener('mouseenter', function(){ avEl.style.transform='scale(1.1)'; });
  avEl.addEventListener('mouseleave', function(){ avEl.style.transform=''; });
  avEl.addEventListener('click', function(){ toggleAvatarPicker(avEl); });
  avWrap.appendChild(avEl);

  // Avatar picker container
  var avPicker = document.createElement('div');
  avPicker.id = 'profile-avatar-picker';
  avPicker.style.display = 'none';
  avWrap.appendChild(avPicker);

  var nameEl = document.createElement('div');
  nameEl.style.cssText = "font-family:'Cinzel Decorative',serif;font-size:1.15rem;font-weight:900;color:var(--ny);";
  nameEl.textContent = USER_PROFILE.name;
  avWrap.appendChild(nameEl);

  if(nametag){
    var ntEl = document.createElement('div');
    ntEl.style.cssText = "font-family:'Cinzel',serif;font-size:.62rem;color:#61dafb;letter-spacing:1px;margin-top:.25rem;background:rgba(97,218,251,.08);border:1px solid rgba(97,218,251,.2);border-radius:4px;display:inline-block;padding:.15rem .5rem;";
    ntEl.textContent = '🏷️ ' + nametag;
    avWrap.appendChild(ntEl);
  }

  var lvlEl = document.createElement('div');
  lvlEl.style.cssText = "font-family:'Cinzel',serif;font-size:.62rem;color:"+lc+";letter-spacing:2px;margin-top:.3rem;";
  lvlEl.textContent = lvlNames[USER_PROFILE.level] || '';
  avWrap.appendChild(lvlEl);

  var joinEl = document.createElement('div');
  joinEl.style.cssText = "font-family:'Cinzel',serif;font-size:.55rem;color:var(--td);margin-top:.2rem;letter-spacing:1px;";
  joinEl.textContent = 'JOINED ' + (USER_PROFILE.joined || 'RECENTLY');
  avWrap.appendChild(joinEl);

  card.appendChild(avWrap);

  // Stats grid — XP, Chapters, Badges (replaces Sections)
  var statsGrid = document.createElement('div');
  statsGrid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr 1fr;gap:.6rem;margin-bottom:1.1rem;';
  [
    {icon:'⚡', label:'TOTAL XP',  val:ST.xp},
    {icon:'📚', label:'CHAPTERS',  val:CH_STATE.completedChapters.size+'/10'},
    {icon:'🏅', label:'BADGES',    val:badgesUnlocked+'/'+ST.ach.length},
  ].forEach(function(s){
    var cell = document.createElement('div');
    cell.style.cssText = 'text-align:center;background:rgba(201,168,76,.06);border:1px solid rgba(201,168,76,.15);border-radius:10px;padding:.7rem .3rem;';
    var ico = document.createElement('div');
    ico.style.fontSize='1.1rem'; ico.textContent=s.icon;
    var val = document.createElement('div');
    val.style.cssText = "font-family:'Cinzel Decorative',serif;font-size:.9rem;font-weight:900;color:var(--ny);";
    val.textContent = s.val;
    var lbl = document.createElement('div');
    lbl.style.cssText = "font-family:'Cinzel',serif;font-size:.48rem;color:var(--td);letter-spacing:1px;margin-top:.15rem;";
    lbl.textContent = s.label;
    cell.appendChild(ico); cell.appendChild(val); cell.appendChild(lbl);
    statsGrid.appendChild(cell);
  });
  card.appendChild(statsGrid);

  // Level bar
  var lvBar = document.createElement('div');
  lvBar.style.cssText = 'margin-bottom:1.1rem;';
  var lvBarLabel = document.createElement('div');
  lvBarLabel.style.cssText = "display:flex;justify-content:space-between;font-family:'Cinzel',serif;font-size:.55rem;color:var(--td);letter-spacing:2px;margin-bottom:.4rem;";
  lvBarLabel.innerHTML = '<span>LEVEL ' + ST.lv + '</span><span style="color:'+lc+'">' + ST.xp + ' XP · ' + xpToNext + ' to next</span>';
  var lvBarBg = document.createElement('div');
  lvBarBg.style.cssText = 'height:7px;background:rgba(255,255,255,.07);border-radius:99px;overflow:hidden;';
  var lvBarFill = document.createElement('div');
  lvBarFill.style.cssText = 'height:100%;width:'+xpPct+'%;background:'+lc+';border-radius:99px;box-shadow:0 0 10px '+lc+'80;transition:width 1s ease;';
  lvBarBg.appendChild(lvBarFill);
  lvBar.appendChild(lvBarLabel);
  lvBar.appendChild(lvBarBg);
  card.appendChild(lvBar);

  // Action buttons row
  var btnRow = document.createElement('div');
  btnRow.style.cssText = 'display:flex;gap:.5rem;flex-wrap:wrap;';

  var shopBtn = document.createElement('button');
  shopBtn.style.cssText = "flex:1;font-family:'Cinzel Decorative',serif;font-size:.65rem;padding:.55rem .8rem;background:linear-gradient(135deg,#c9a84c,#e8c97a);border:none;border-radius:8px;color:#080600;cursor:pointer;font-weight:700;letter-spacing:.5px;";
  shopBtn.textContent = '🛒 SHOP';
  shopBtn.addEventListener('click', function(){ overlay.remove(); openShop(); });
  btnRow.appendChild(shopBtn);

  var badgesBtn = document.createElement('button');
  badgesBtn.style.cssText = "flex:1;font-family:'Cinzel',serif;font-size:.6rem;padding:.55rem .8rem;background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.3);color:var(--ny);border-radius:8px;cursor:pointer;letter-spacing:.5px;";
  badgesBtn.textContent = '🏅 BADGES';
  badgesBtn.addEventListener('click', function(){ overlay.remove(); gS('ach'); });
  btnRow.appendChild(badgesBtn);

  var resetBtn = document.createElement('button');
  resetBtn.style.cssText = "font-family:'Cinzel',serif;font-size:.55rem;padding:.55rem .7rem;background:none;border:1px solid rgba(255,255,255,.1);color:var(--td);border-radius:8px;cursor:pointer;";
  resetBtn.textContent = '↺';
  resetBtn.title = 'Reset profile';
  resetBtn.addEventListener('click', function(){
    overlay.remove();
    USER_PROFILE={name:'',level:0,avatar:'⚡',joined:''};
    USER_LEVEL=0;
    localStorage.removeItem('learno-profile');
    localStorage.removeItem('learno-level');
    updateProfileIcon();
    showProfileSetup();
  });
  btnRow.appendChild(resetBtn);

  // Logout button if logged in
  if(SUPA_USER){
    var logoutBtn = document.createElement('button');
    logoutBtn.style.cssText = "font-family:'Cinzel',serif;font-size:.55rem;padding:.55rem .7rem;background:rgba(224,82,82,.08);border:1px solid rgba(224,82,82,.2);color:#e88f8f;border-radius:8px;cursor:pointer;";
    logoutBtn.textContent = '⏻';
    logoutBtn.title = 'Sign out';
    logoutBtn.addEventListener('click', function(){
      overlay.remove();
      dbSignOut().then(function(){
        // Clear ALL local state
        ST.xp=0; ST.lv=1; ST.streak=0;
        ST.ach.forEach(function(a){ a.ul=false; });
        SHOP_ITEMS.forEach(function(i){ i.owned=false; });
        CH_STATE.completedChapters.clear();
        CH_STATE.completedParas.clear();
        EQUIPPED_NAMETAG='';
        UNLOCKED_AVATARS=['⚡','🔥','🌙','⚔️','🏆','🎮','🌀','🛸','🎯','💎'];
        USER_PROFILE={name:'',level:0,avatar:'⚡',joined:''};
        USER_LEVEL=0;
        // Clear all localStorage
        localStorage.removeItem('learno-profile');
        localStorage.removeItem('learno-level');
        localStorage.removeItem('learno-badges');
        localStorage.removeItem('learno-shop');
        localStorage.removeItem('learno-nametag');
        localStorage.removeItem('learno-avatars');
        localStorage.removeItem('learno-st-xp');
        localStorage.removeItem('learno-st-lv');
        localStorage.removeItem('learno_session');
        // Full page reload — cleanest way to reset everything
        window.location.reload();
      });
    });
    btnRow.appendChild(logoutBtn);
  }

  card.appendChild(btnRow);
  overlay.appendChild(card);
  document.body.appendChild(overlay);
}

// ════════════════════════════════════════
// UPDATED rLB — show nametag under player name
// ════════════════════════════════════════
function rLB(){
  updLB();
  var s=[...LBDATA].sort(function(a,b){return b.sc-a.sc;});
  var html = s.map(function(r,i){
    var isYou = r.name==='YOU';
    var av = isYou ? (USER_PROFILE.avatar||'⚡') : r.av;
    var nt = isYou ? (EQUIPPED_NAMETAG || getCurrentNametag()) : '';
    var medal = i===0?'🥇':i===1?'🥈':i===2?'🥉':(i+1);
    return '<div class="lr r'+Math.min(i+1,4)+'" style="animation-delay:'+(i*.07)+'s">' +
      '<div class="lrk">'+medal+'</div>' +
      '<div class="la" style="font-size:1.2rem">'+av+'</div>' +
      '<div style="flex:1">' +
        '<div class="ln" style="'+(isYou?'color:var(--nc)':'')+'">'+r.name+(isYou?' (You)':'')+'</div>' +
        (nt ? '<div style="font-family:\'Cinzel\',serif;font-size:.52rem;color:#61dafb;letter-spacing:1px;margin-top:.15rem;background:rgba(97,218,251,.08);border:1px solid rgba(97,218,251,.15);border-radius:3px;display:inline-block;padding:.1rem .35rem;">🏷️ '+nt+'</div>' : '') +
      '</div>' +
      '<div class="lsc">'+r.sc.toLocaleString()+' pts</div>' +
      '</div>';
  }).join('');
  document.getElementById('lbl').innerHTML = html;
  if(s.findIndex(function(r){return r.name==='YOU';})<=2) unl('top3');
}

// ════════════════════════════════════════
// UPDATED toggleAvatarPicker — shows all owned/unlocked avatars
// ════════════════════════════════════════
function toggleAvatarPicker(iconEl){
  var picker = document.getElementById('profile-avatar-picker');
  if(!picker) return;
  if(picker.style.display !== 'none'){ picker.style.display='none'; return; }
  picker.innerHTML = '';

  var label = document.createElement('div');
  label.style.cssText = "font-family:'Cinzel',serif;font-size:.52rem;color:var(--td);letter-spacing:2px;margin-bottom:.5rem;text-align:center;";
  label.textContent = 'YOUR AVATARS';
  picker.appendChild(label);

  // Combine level-unlocked + shop-owned avatars
  var allOwned = [...UNLOCKED_AVATARS];
  SHOP_ITEMS.forEach(function(item){
    if(item.type==='avatar' && item.owned && !allOwned.includes(item.icon)){
      allOwned.push(item.icon);
    }
  });

  var grid = document.createElement('div');
  grid.style.cssText = 'display:flex;flex-wrap:wrap;gap:.35rem;justify-content:center;margin-bottom:.5rem;';
  allOwned.forEach(function(av){
    var btn = document.createElement('button');
    var isActive = USER_PROFILE.avatar === av;
    btn.style.cssText = 'font-size:1.2rem;padding:.3rem .45rem;border-radius:7px;cursor:pointer;transition:all .15s;border:1.5px solid '+(isActive?'#c9a84c':'rgba(255,255,255,.1)')+';background:'+(isActive?'rgba(201,168,76,.2)':'rgba(255,255,255,.04)')+';';
    btn.textContent = av;
    btn.addEventListener('click', function(){
      USER_PROFILE.avatar = av;
      saveProfile(); updateProfileIcon();
      if(iconEl) iconEl.textContent = av;
      picker.style.display = 'none';
    });
    grid.appendChild(btn);
  });
  picker.appendChild(grid);

  var hint = document.createElement('div');
  hint.style.cssText = "font-family:'Cinzel',serif;font-size:.5rem;color:rgba(255,255,255,.2);text-align:center;letter-spacing:1px;";
  hint.textContent = 'MORE IN THE SHOP · LEVEL UP FOR FREE AVATARS';
  picker.appendChild(hint);
  picker.style.display = 'block';
}




// ════════════════════════════════════════
// TRUE OR FALSE BLITZ
// ════════════════════════════════════════
// 10 seconds, rapid fire T/F statements, streak multiplier

var TF_STATEMENTS = [
  // HTML
  {s:'HTML stands for HyperText Markup Language',ans:true},
  {s:'The &lt;div&gt; tag is a semantic HTML element',ans:false,exp:'div has no semantic meaning. Use header, main, section etc.'},
  {s:'An &lt;img&gt; tag requires a closing &lt;/img&gt; tag',ans:false,exp:'img is self-closing: &lt;img src="" alt=""&gt;'},
  {s:'The &lt;head&gt; section contains content visible to the user',ans:false,exp:'head holds metadata. body holds visible content.'},
  {s:'&lt;h1&gt; is the largest heading in HTML',ans:true},
  {s:'You can have multiple &lt;main&gt; elements per page',ans:false,exp:'Only ONE &lt;main&gt; per page is allowed.'},
  {s:'The alt attribute on img helps screen readers',ans:true},
  {s:'&lt;strong&gt; and &lt;b&gt; are exactly the same',ans:false,exp:'strong has semantic meaning (important), b is just visual bold.'},
  {s:'CSS stands for Cascading Style Sheets',ans:true},
  {s:'inline CSS has lower priority than external CSS',ans:false,exp:'Inline CSS has the HIGHEST specificity.'},
  {s:'display:flex makes an element a flex container',ans:true},
  {s:'margin adds space INSIDE the border',ans:false,exp:'padding adds space inside. margin adds space outside.'},
  {s:'grid-template-columns defines column sizes in CSS Grid',ans:true},
  {s:'CSS variables are declared with a single dash prefix',ans:false,exp:'CSS variables use double dash: --my-var'},
  {s:'const variables can be reassigned after declaration',ans:false,exp:'const cannot be reassigned. Use let for that.'},
  {s:'typeof "hello" returns "string"',ans:true},
  {s:'arr.map() modifies the original array',ans:false,exp:'map() returns a NEW array. The original is unchanged.'},
  {s:'arr.filter() returns elements where the callback returns true',ans:true},
  {s:'async functions always return a Promise',ans:true},
  {s:'=== checks value only, not type',ans:false,exp:'=== checks both value AND type. == checks value only.'},
  {s:'O(1) means constant time complexity',ans:true},
  {s:'Bubble Sort is the most efficient sorting algorithm',ans:false,exp:'Merge Sort and Quick Sort are far more efficient at O(n log n).'},
  {s:'A Stack follows FIFO — First In First Out',ans:false,exp:'Stack is LIFO. Queue is FIFO.'},
  {s:'Binary Search requires a sorted array',ans:true},
  {s:'In a BST, left child values are greater than the parent',ans:false,exp:'Left child is LESS than parent. Right child is greater.'},
  {s:'useEffect with [] runs once after the component mounts',ans:true},
  {s:'JSX uses className instead of class',ans:true},
  {s:'React props can be modified inside a component',ans:false,exp:'Props are read-only. Use state for mutable data.'},
  {s:'document.getElementById returns all matching elements',ans:false,exp:'getElementById returns ONE element by its unique ID.'},
  {s:'Recursion always requires a base case to stop',ans:true},
  {s:'O(n²) is more efficient than O(n log n)',ans:false,exp:'O(n log n) is much better. O(n²) grows much faster.'},
  {s:'Hash maps provide O(1) average lookup time',ans:true},
  {s:'The DOM stands for Document Object Model',ans:true},
  {s:'flex-wrap:wrap prevents items from wrapping to new lines',ans:false,exp:'flex-wrap:wrap ALLOWS wrapping. nowrap prevents it.'},
  {s:'Promises can be in pending, fulfilled, or rejected state',ans:true},
];

var TFG = {
  timer: null,
  timeLeft: 0,
  score: 0,
  streak: 0,
  bestStreak: 0,
  xpEarned: 0,
  current: null,
  answered: false,
  totalAnswered: 0,
  correct: 0,
  running: false,
  GAME_TIME: 60,
};

function openTrueFalse() {
  document.getElementById('games-hub').style.display = 'none';
  document.getElementById('tf-screen').style.display = 'block';
  initTrueFalse();
}

function showTFHub() {
  clearInterval(TFG.timer);
  TFG.running = false;
  document.getElementById('tf-screen').style.display = 'none';
  document.getElementById('games-hub').style.display = 'block';
}

function initTrueFalse() {
  TFG.score = 0; TFG.streak = 0; TFG.bestStreak = 0;
  TFG.xpEarned = 0; TFG.totalAnswered = 0; TFG.correct = 0;
  TFG.running = false; TFG.answered = false;
  clearInterval(TFG.timer);
  document.getElementById('tf-game-area').style.display = 'none';
  document.getElementById('tf-start-screen').style.display = 'flex';
  document.getElementById('tf-result-screen').style.display = 'none';
}

function startTrueFalse() {
  TFG.running = true;
  TFG.timeLeft = TFG.GAME_TIME;
  document.getElementById('tf-start-screen').style.display = 'none';
  document.getElementById('tf-result-screen').style.display = 'none';
  document.getElementById('tf-game-area').style.display = 'block';
  TFG.usedIndices = new Set();
  nextTFQuestion();
  TFG.timer = setInterval(function() {
    TFG.timeLeft--;
    updateTFUI();
    if (TFG.timeLeft <= 0) {
      clearInterval(TFG.timer);
      TFG.running = false;
      endTrueFalse();
    }
  }, 1000);
}

function nextTFQuestion() {
  // Pick random unused statement
  var pool = TF_STATEMENTS.map(function(_, i){ return i; })
    .filter(function(i){ return !TFG.usedIndices || !TFG.usedIndices.has(i); });
  if (!pool.length) { TFG.usedIndices = new Set(); pool = TF_STATEMENTS.map(function(_, i){ return i; }); }
  var idx = pool[Math.floor(Math.random() * pool.length)];
  if (TFG.usedIndices) TFG.usedIndices.add(idx);
  TFG.current = TF_STATEMENTS[idx];
  TFG.answered = false;

  var stEl = document.getElementById('tf-statement');
  if (stEl) stEl.innerHTML = TFG.current.s;

  // Reset button styles
  var trueBtn = document.getElementById('tf-true-btn');
  var falseBtn = document.getElementById('tf-false-btn');
  var fbEl = document.getElementById('tf-feedback');
  if (trueBtn) { trueBtn.style.background = 'rgba(39,201,63,.12)'; trueBtn.style.borderColor = 'rgba(39,201,63,.4)'; trueBtn.style.transform = ''; trueBtn.disabled = false; }
  if (falseBtn) { falseBtn.style.background = 'rgba(224,82,82,.12)'; falseBtn.style.borderColor = 'rgba(224,82,82,.4)'; falseBtn.style.transform = ''; falseBtn.disabled = false; }
  if (fbEl) { fbEl.style.opacity = '0'; fbEl.textContent = ''; }
  updateTFUI();
}

function answerTF(answer) {
  if (!TFG.running || TFG.answered) return;
  TFG.answered = true;
  TFG.totalAnswered++;

  var correct = answer === TFG.current.ans;
  var trueBtn = document.getElementById('tf-true-btn');
  var falseBtn = document.getElementById('tf-false-btn');
  var fbEl = document.getElementById('tf-feedback');

  if (trueBtn) trueBtn.disabled = true;
  if (falseBtn) falseBtn.disabled = true;

  if (correct) {
    TFG.correct++;
    TFG.streak++;
    if (TFG.streak > TFG.bestStreak) TFG.bestStreak = TFG.streak;
    var mult = Math.min(TFG.streak, 5);
    var xp = 10 * mult;
    TFG.xpEarned += xp;
    TFG.score += 100 * mult;
    if (fbEl) { fbEl.style.color = '#27c93f'; fbEl.textContent = '✅ Correct! +' + xp + ' XP' + (mult > 1 ? ' ×' + mult + ' streak!' : ''); fbEl.style.opacity = '1'; }
    // Flash correct button green
    var hitBtn = answer ? trueBtn : falseBtn;
    if (hitBtn) { hitBtn.style.background = 'rgba(39,201,63,.35)'; hitBtn.style.borderColor = '#27c93f'; hitBtn.style.transform = 'scale(1.05)'; }
  } else {
    TFG.streak = 0;
    if (fbEl) {
      var expText = TFG.current.exp ? ' — ' + TFG.current.exp : '';
      fbEl.style.color = '#e05252';
      fbEl.textContent = '❌ Wrong!' + expText;
      fbEl.style.opacity = '1';
    }
    // Show correct answer highlight
    var correctBtn = TFG.current.ans ? trueBtn : falseBtn;
    var wrongBtn = TFG.current.ans ? falseBtn : trueBtn;
    if (correctBtn) { correctBtn.style.background = 'rgba(39,201,63,.25)'; correctBtn.style.borderColor = '#27c93f'; }
    if (wrongBtn) { wrongBtn.style.background = 'rgba(224,82,82,.3)'; wrongBtn.style.borderColor = '#e05252'; }
  }

  updateTFUI();
  // Auto-advance after short delay
  setTimeout(function() {
    if (TFG.running) nextTFQuestion();
  }, correct ? 600 : 1000);
}

function endTrueFalse() {
  var acc = TFG.totalAnswered > 0 ? Math.round(TFG.correct / TFG.totalAnswered * 100) : 0;
  addXP(TFG.xpEarned, 'True/False Blitz!');
  if (TFG.bestStreak >= 5) checkBadge_streak(TFG.bestStreak);
  document.getElementById('tf-game-area').style.display = 'none';
  document.getElementById('tf-result-screen').style.display = 'flex';
  document.getElementById('tf-res-score').textContent = TFG.score;
  document.getElementById('tf-res-acc').textContent = acc + '%';
  document.getElementById('tf-res-streak').textContent = TFG.bestStreak;
  document.getElementById('tf-res-xp').textContent = '+' + TFG.xpEarned + ' XP';
}

function updateTFUI() {
  var timeEl = document.getElementById('tf-timer');
  var scoreEl = document.getElementById('tf-score');
  var streakEl = document.getElementById('tf-streak');
  if (timeEl) {
    timeEl.textContent = TFG.timeLeft + 's';
    timeEl.style.color = TFG.timeLeft <= 10 ? '#e05252' : TFG.timeLeft <= 20 ? '#f0d080' : '#27c93f';
  }
  if (scoreEl) scoreEl.textContent = TFG.score;
  if (streakEl) streakEl.textContent = TFG.streak + (TFG.streak >= 3 ? ' 🔥' : '');
}

// ════════════════════════════════════════
// FILL THE BLANK
// ════════════════════════════════════════
// Type the missing word in a code snippet before time runs out

var FTB_QUESTIONS = [
  {code:'_____ stands for HyperText Markup Language', ans:'HTML', hint:'The language of the web'},
  {code:'&lt;___&gt; is the largest heading tag', ans:'h1', hint:'h1 through h6, this is the biggest'},
  {code:'function add(a, b) { _____ a + b; }', ans:'return', hint:'Sends a value back to the caller'},
  {code:'const x = _____("42");', ans:'parseInt', hint:'Converts a string to a whole number'},
  {code:'arr._____(x) adds x to the end of an array', ans:'push', hint:'Opposite of pop'},
  {code:'arr._____(fn) returns a new filtered array', ans:'filter', hint:'Keeps elements where fn returns true'},
  {code:'arr._____(fn) transforms each element', ans:'map', hint:'Returns a new array of same length'},
  {code:'typeof "hello" === "_____"', ans:'string', hint:'Text values have this type'},
  {code:'display: _____ activates flexbox', ans:'flex', hint:'The CSS value for flex container'},
  {code:'_____ creates space inside the border', ans:'padding', hint:'Inside. Margin is outside.'},
  {code:'CSS variables start with _____ dashes', ans:'two', hint:'Like --my-color: red'},
  {code:'const [count, _____] = useState(0)', ans:'setCount', hint:'The setter function from useState'},
  {code:'useEffect with _____ runs once on mount', ans:'[]', hint:'An empty dependency array'},
  {code:'O(_____) is constant time complexity', ans:'1', hint:'The fastest — array index access'},
  {code:'Stack follows _____ — Last In First Out', ans:'LIFO', hint:'Like a stack of plates'},
  {code:'Queue follows _____ — First In First Out', ans:'FIFO', hint:'Like a queue at a store'},
  {code:'Binary search requires a _____ array', ans:'sorted', hint:'Must be in order to work'},
  {code:'str.split("").reverse().___("") reverses a string', ans:'join', hint:'Joins array elements back into a string'},
  {code:'In JSX, use _____ instead of class', ans:'className', hint:'class is a reserved JS keyword'},
  {code:'React _____ are read-only inputs to a component', ans:'props', hint:'Short for properties'},
  {code:'The _____ tag wraps all visible page content', ans:'body', hint:'head is invisible, this is visible'},
  {code:'_____ adds element to start of array', ans:'unshift', hint:'Opposite of shift'},
  {code:'O(n²) has _____ nested loops', ans:'two', hint:'n × n = n squared'},
  {code:'Hash maps provide O(_____) average lookup', ans:'1', hint:'Constant time — same as array index'},
  {code:'async functions return a _____', ans:'Promise', hint:'Represents a future value'},
];

var FTB = {
  timer: null,
  timeLeft: 0,
  score: 0,
  xpEarned: 0,
  streak: 0,
  bestStreak: 0,
  current: null,
  qIndex: 0,
  shuffled: [],
  running: false,
  QUESTION_TIME: 15,
  totalCorrect: 0,
};

function openFillBlank() {
  document.getElementById('games-hub').style.display = 'none';
  document.getElementById('ftb-screen').style.display = 'block';
  initFillBlank();
}

function showFTBHub() {
  clearInterval(FTB.timer);
  FTB.running = false;
  document.getElementById('ftb-screen').style.display = 'none';
  document.getElementById('games-hub').style.display = 'block';
}

function initFillBlank() {
  FTB.score = 0; FTB.xpEarned = 0; FTB.streak = 0; FTB.bestStreak = 0;
  FTB.qIndex = 0; FTB.totalCorrect = 0; FTB.running = false;
  clearInterval(FTB.timer);
  FTB.shuffled = [...FTB_QUESTIONS].sort(function(){ return Math.random() - 0.5; });
  document.getElementById('ftb-start-screen').style.display = 'flex';
  document.getElementById('ftb-game-area').style.display = 'none';
  document.getElementById('ftb-result-screen').style.display = 'none';
}

function startFillBlank() {
  FTB.running = true;
  FTB.qIndex = 0;
  document.getElementById('ftb-start-screen').style.display = 'none';
  document.getElementById('ftb-result-screen').style.display = 'none';
  document.getElementById('ftb-game-area').style.display = 'block';
  loadFTBQuestion();
}

function loadFTBQuestion() {
  if (FTB.qIndex >= FTB.shuffled.length) { endFillBlank(); return; }
  FTB.current = FTB.shuffled[FTB.qIndex];
  FTB.timeLeft = FTB.QUESTION_TIME;

  var codeEl = document.getElementById('ftb-code');
  if (codeEl) codeEl.innerHTML = FTB.current.code;

  var hintEl = document.getElementById('ftb-hint');
  if (hintEl) hintEl.textContent = '💡 ' + FTB.current.hint;

  var inp = document.getElementById('ftb-input');
  if (inp) { inp.value = ''; inp.style.borderColor = 'rgba(201,168,76,.4)'; inp.focus(); }

  var fbEl = document.getElementById('ftb-feedback');
  if (fbEl) { fbEl.textContent = ''; fbEl.style.opacity = '0'; }

  var progEl = document.getElementById('ftb-progress');
  if (progEl) progEl.textContent = (FTB.qIndex + 1) + ' / ' + FTB.shuffled.length;

  updateFTBTimer();
  clearInterval(FTB.timer);
  FTB.timer = setInterval(function() {
    FTB.timeLeft--;
    updateFTBTimer();
    if (FTB.timeLeft <= 0) {
      clearInterval(FTB.timer);
      // Time up — show answer and move on
      var fb = document.getElementById('ftb-feedback');
      if (fb) { fb.style.color = '#e05252'; fb.textContent = '⏱️ Time up! Answer: ' + FTB.current.ans; fb.style.opacity = '1'; }
      var i = document.getElementById('ftb-input');
      if (i) { i.disabled = true; i.style.borderColor = '#e05252'; }
      FTB.streak = 0;
      updateFTBScoreUI();
      setTimeout(function() { if (FTB.running) { FTB.qIndex++; loadFTBQuestion(); } }, 1500);
    }
  }, 1000);
}

function submitFTB() {
  if (!FTB.running || !FTB.current) return;
  var inp = document.getElementById('ftb-input');
  if (!inp) return;
  var userAns = inp.value.trim().toLowerCase();
  var correct = userAns === FTB.current.ans.toLowerCase();
  clearInterval(FTB.timer);

  var fbEl = document.getElementById('ftb-feedback');
  inp.disabled = true;

  if (correct) {
    FTB.streak++;
    if (FTB.streak > FTB.bestStreak) FTB.bestStreak = FTB.streak;
    FTB.totalCorrect++;
    var xp = 20 + FTB.streak * 5;
    FTB.xpEarned += xp;
    FTB.score += 150 + FTB.timeLeft * 5;
    inp.style.borderColor = '#27c93f';
    if (fbEl) { fbEl.style.color = '#27c93f'; fbEl.textContent = '✅ Correct! +' + xp + ' XP'; fbEl.style.opacity = '1'; }
  } else {
    FTB.streak = 0;
    inp.style.borderColor = '#e05252';
    if (fbEl) { fbEl.style.color = '#e05252'; fbEl.textContent = '❌ Answer: ' + FTB.current.ans; fbEl.style.opacity = '1'; }
  }
  updateFTBScoreUI();
  setTimeout(function() {
    if (FTB.running) { inp.disabled = false; FTB.qIndex++; loadFTBQuestion(); }
  }, correct ? 800 : 1400);
}

function updateFTBTimer() {
  var tEl = document.getElementById('ftb-timer-bar-fill');
  var tNum = document.getElementById('ftb-timer-num');
  var pct = (FTB.timeLeft / FTB.QUESTION_TIME) * 100;
  if (tEl) {
    tEl.style.width = pct + '%';
    tEl.style.background = FTB.timeLeft <= 5 ? '#e05252' : FTB.timeLeft <= 8 ? '#f0d080' : '#27c93f';
  }
  if (tNum) { tNum.textContent = FTB.timeLeft + 's'; tNum.style.color = FTB.timeLeft <= 5 ? '#e05252' : 'var(--ny)'; }
}

function updateFTBScoreUI() {
  var sEl = document.getElementById('ftb-score'); if (sEl) sEl.textContent = FTB.score;
  var stEl = document.getElementById('ftb-streak-display'); if (stEl) stEl.textContent = FTB.streak + (FTB.streak >= 3 ? ' 🔥' : '');
}

function endFillBlank() {
  FTB.running = false;
  clearInterval(FTB.timer);
  addXP(FTB.xpEarned, 'Fill the Blank!');
  document.getElementById('ftb-game-area').style.display = 'none';
  document.getElementById('ftb-result-screen').style.display = 'flex';
  document.getElementById('ftb-res-score').textContent = FTB.score;
  document.getElementById('ftb-res-correct').textContent = FTB.totalCorrect + '/' + FTB.shuffled.length;
  document.getElementById('ftb-res-streak').textContent = FTB.bestStreak;
  document.getElementById('ftb-res-xp').textContent = '+' + FTB.xpEarned + ' XP';
}

// ════════════════════════════════════════
// CODE PATH
// ════════════════════════════════════════
// Navigate a maze. Each junction = a question. Wrong = wall. Reach the exit.

var CP = {
  grid: [],       // 2D array of cells
  player: {r:0, c:0},
  exit: {r:0, c:0},
  ROWS: 7,
  COLS: 9,
  score: 0,
  xpEarned: 0,
  moves: 0,
  wrongAnswers: 0,
  running: false,
  currentJunction: null,  // {r, c} of the junction being answered
  pendingDir: null,        // direction player was trying to move
  level: 1,
};

// Cell types
var CP_EMPTY = 0, CP_WALL = 1, CP_JUNCTION = 2, CP_EXIT = 3, CP_PLAYER = 4, CP_VISITED = 5;

function openCodePath() {
  document.getElementById('games-hub').style.display = 'none';
  document.getElementById('cp-screen').style.display = 'block';
  initCodePath(1);
}

function showCPHub() {
  CP.running = false;
  document.getElementById('cp-screen').style.display = 'none';
  document.getElementById('games-hub').style.display = 'block';
}

function initCodePath(level) {
  CP.level = level;
  CP.score = level === 1 ? 0 : CP.score;
  CP.xpEarned = level === 1 ? 0 : CP.xpEarned;
  CP.moves = 0;
  CP.wrongAnswers = 0;
  CP.running = true;
  CP.currentJunction = null;
  CP.pendingDir = null;

  // Build maze grid
  CP.ROWS = 7;
  CP.COLS = 9 + (level - 1) * 2;
  generateCPMaze();

  document.getElementById('cp-start-screen').style.display = 'none';
  document.getElementById('cp-result-screen').style.display = 'none';
  document.getElementById('cp-q-panel').style.display = 'none';
  document.getElementById('cp-game-area').style.display = 'block';
  renderCPMaze();
  updateCPUI();
}

function generateCPMaze() {
  var R = CP.ROWS, C = CP.COLS;
  CP.grid = [];
  for (var r = 0; r < R; r++) {
    CP.grid[r] = [];
    for (var c = 0; c < C; c++) {
      CP.grid[r][c] = CP_WALL;
    }
  }

  // Carve passages using recursive backtracker from (0,0)
  function carve(r, c) {
    CP.grid[r][c] = CP_EMPTY;
    var dirs = [{dr:-2,dc:0},{dr:2,dc:0},{dr:0,dc:-2},{dr:0,dc:2}]
      .sort(function(){ return Math.random() - 0.5; });
    dirs.forEach(function(d) {
      var nr = r + d.dr, nc = c + d.dc;
      if (nr >= 0 && nr < R && nc >= 0 && nc < C && CP.grid[nr][nc] === CP_WALL) {
        CP.grid[r + d.dr/2][c + d.dc/2] = CP_EMPTY;
        carve(nr, nc);
      }
    });
  }
  carve(0, 0);

  // Place player at top-left
  CP.player = { r: 0, c: 0 };
  // Place exit at bottom-right (find nearest open cell)
  CP.exit = { r: R-1, c: C-1 };
  if (CP.grid[R-1][C-1] === CP_WALL) {
    // find nearest open cell to bottom-right
    outer: for (var rr = R-1; rr >= 0; rr--) {
      for (var cc = C-1; cc >= 0; cc--) {
        if (CP.grid[rr][cc] === CP_EMPTY) { CP.exit = {r:rr, c:cc}; break outer; }
      }
    }
  }
  CP.grid[CP.exit.r][CP.exit.c] = CP_EXIT;

  // Place junctions at open cells (not player start, not exit)
  // About 30% of open cells become junctions
  var junctionCount = 0;
  for (var r2 = 0; r2 < R; r2++) {
    for (var c2 = 0; c2 < C; c2++) {
      if (CP.grid[r2][c2] === CP_EMPTY && !(r2 === 0 && c2 === 0)) {
        if (Math.random() < 0.28) {
          CP.grid[r2][c2] = CP_JUNCTION;
          junctionCount++;
        }
      }
    }
  }
  // Ensure at least 4 junctions
  if (junctionCount < 4) {
    for (var r3 = 0; r3 < R; r3++) {
      for (var c3 = 0; c3 < C; c3++) {
        if (CP.grid[r3][c3] === CP_EMPTY && !(r3 === 0 && c3 === 0) && junctionCount < 6) {
          CP.grid[r3][c3] = CP_JUNCTION;
          junctionCount++;
        }
      }
    }
  }
}

function renderCPMaze() {
  var board = document.getElementById('cp-board');
  if (!board) return;
  board.innerHTML = '';
  board.style.gridTemplateColumns = 'repeat(' + CP.COLS + ', 1fr)';
  board.style.gridTemplateRows = 'repeat(' + CP.ROWS + ', 1fr)';

  var cellSize = Math.min(44, Math.floor(440 / CP.COLS));
  board.style.width = (cellSize * CP.COLS) + 'px';
  board.style.height = (cellSize * CP.ROWS) + 'px';

  for (var r = 0; r < CP.ROWS; r++) {
    for (var c = 0; c < CP.COLS; c++) {
      var cell = document.createElement('div');
      cell.style.cssText = 'width:' + cellSize + 'px;height:' + cellSize + 'px;display:flex;align-items:center;justify-content:center;font-size:' + Math.floor(cellSize * 0.55) + 'px;transition:background .15s;border-radius:3px;';
      var type = CP.grid[r][c];
      var isPlayer = (r === CP.player.r && c === CP.player.c);

      if (isPlayer) {
        cell.textContent = '😎';
        cell.style.background = 'rgba(201,168,76,.25)';
        cell.style.boxShadow = '0 0 12px rgba(201,168,76,.6)';
      } else if (type === CP_WALL) {
        cell.style.background = 'rgba(255,255,255,.06)';
        cell.style.boxShadow = 'inset 0 0 4px rgba(0,0,0,.4)';
      } else if (type === CP_EXIT) {
        cell.textContent = '🏁';
        cell.style.background = 'rgba(39,201,63,.15)';
        cell.style.boxShadow = '0 0 16px rgba(39,201,63,.5)';
        cell.style.animation = 'pb 1.5s infinite';
      } else if (type === CP_JUNCTION) {
        cell.textContent = '❓';
        cell.style.background = 'rgba(97,218,251,.1)';
        cell.style.border = '1px solid rgba(97,218,251,.3)';
        cell.style.cursor = 'pointer';
      } else if (type === CP_VISITED) {
        cell.style.background = 'rgba(201,168,76,.08)';
      } else {
        cell.style.background = 'rgba(255,255,255,.03)';
      }

      board.appendChild(cell);
    }
  }
}

function moveCPPlayer(dr, dc) {
  if (!CP.running) return;
  if (CP.currentJunction) return; // waiting for answer

  var nr = CP.player.r + dr;
  var nc = CP.player.c + dc;

  if (nr < 0 || nr >= CP.ROWS || nc < 0 || nc >= CP.COLS) return;
  var cellType = CP.grid[nr][nc];
  if (cellType === CP_WALL) {
    // Flash wall
    flashCPWall(nr, nc);
    return;
  }

  // Mark current cell visited
  if (CP.grid[CP.player.r][CP.player.c] === CP_EMPTY) {
    CP.grid[CP.player.r][CP.player.c] = CP_VISITED;
  }

  if (cellType === CP_JUNCTION) {
    // Ask a question before allowing entry
    CP.currentJunction = { r: nr, c: nc };
    CP.pendingDir = { dr, dc };
    showCPQuestion(nr, nc);
    return;
  }

  // Move
  CP.player.r = nr;
  CP.player.c = nc;
  CP.moves++;

  if (cellType === CP_EXIT) {
    cpLevelComplete();
    return;
  }

  renderCPMaze();
  updateCPUI();
}

function flashCPWall(r, c) {
  var board = document.getElementById('cp-board');
  if (!board) return;
  var idx = r * CP.COLS + c;
  var cell = board.children[idx];
  if (!cell) return;
  cell.style.background = 'rgba(224,82,82,.4)';
  cell.style.transition = 'none';
  setTimeout(function(){ cell.style.background = 'rgba(255,255,255,.06)'; cell.style.transition = 'background .15s'; }, 200);
}

function showCPQuestion(r, c) {
  var q = rndSnakeQ();
  CP._cpCurrentQ = q;
  var panel = document.getElementById('cp-q-panel');
  if (!panel) return;
  panel.style.display = 'block';

  var qEl = document.getElementById('cp-q-text');
  if (qEl) qEl.textContent = q.q;

  var optsEl = document.getElementById('cp-q-opts');
  if (!optsEl) return;
  optsEl.innerHTML = '';
  var labs = ['A','B','C','D'];
  var colors = ['#e05252','#c9a84c','#f0d080','#27c93f'];
  q.opts.forEach(function(opt, i) {
    var btn = document.createElement('button');
    btn.style.cssText = 'padding:.5rem .7rem;border-radius:7px;cursor:pointer;border:1px solid ' + colors[i] + '40;background:' + colors[i] + '12;color:var(--tm);font-family:\'Crimson Pro\',serif;font-size:.78rem;text-align:left;transition:all .15s;display:flex;align-items:center;gap:.4rem;width:100%;';
    btn.addEventListener('mouseover', function(){ btn.style.background = colors[i] + '25'; });
    btn.addEventListener('mouseout', function(){ btn.style.background = colors[i] + '12'; });
    var lbl = document.createElement('span');
    lbl.style.cssText = 'font-family:\'Cinzel\',serif;font-size:.6rem;color:' + colors[i] + ';flex-shrink:0;';
    lbl.textContent = labs[i];
    btn.appendChild(lbl);
    var txt = document.createElement('span');
    txt.textContent = opt;
    btn.appendChild(txt);
    btn.addEventListener('click', function(){ answerCPQuestion(i); });
    optsEl.appendChild(btn);
  });
}

function answerCPQuestion(chosen) {
  var q = CP._cpCurrentQ;
  if (!q) return;
  var correct = chosen === q.ans;
  var panel = document.getElementById('cp-q-panel');
  var optsEl = document.getElementById('cp-q-opts');

  // Disable buttons, show result
  if (optsEl) {
    Array.from(optsEl.children).forEach(function(btn, i) {
      btn.disabled = true;
      if (i === q.ans) { btn.style.background = 'rgba(39,201,63,.25)'; btn.style.borderColor = '#27c93f'; btn.style.color = '#27c93f'; }
      else if (i === chosen && !correct) { btn.style.background = 'rgba(224,82,82,.2)'; btn.style.borderColor = '#e05252'; btn.style.color = '#e05252'; }
    });
  }

  var fbEl = document.getElementById('cp-q-feedback');
  if (fbEl) {
    fbEl.style.cssText = 'margin-top:.5rem;font-size:.75rem;padding:.4rem .7rem;border-radius:6px;' + (correct ? 'background:rgba(39,201,63,.1);border:1px solid #27c93f40;color:#27c93f;' : 'background:rgba(224,82,82,.1);border:1px solid #e0525240;color:#e88f8f;');
    fbEl.textContent = (correct ? '✅ Path opens! ' : '❌ Wrong! ') + q.exp;
    fbEl.style.display = 'block';
  }

  setTimeout(function() {
    if (fbEl) fbEl.style.display = 'none';
    if (panel) panel.style.display = 'none';

    if (correct) {
      // Allow movement — mark junction as visited and move
      CP.grid[CP.currentJunction.r][CP.currentJunction.c] = CP_VISITED;
      CP.player.r = CP.currentJunction.r;
      CP.player.c = CP.currentJunction.c;
      CP.moves++;
      var xp = 30;
      CP.xpEarned += xp;
      CP.score += 200;
    } else {
      // Wrong — junction becomes a wall, must find another path
      CP.grid[CP.currentJunction.r][CP.currentJunction.c] = CP_WALL;
      CP.wrongAnswers++;
      CP.score = Math.max(0, CP.score - 50);
    }

    CP.currentJunction = null;
    CP.pendingDir = null;
    CP._cpCurrentQ = null;
    renderCPMaze();
    updateCPUI();

    // Check if no path to exit remains (all junctions blocking)
    if (!correct && cpCheckNoPath()) {
      setTimeout(function(){
        showM('💡', 'Path Blocked!', 'Wrong answers blocked all paths. Regenerating maze...', '', function(){ initCodePath(CP.level); });
      }, 300);
    }
  }, correct ? 700 : 1300);
}

function cpCheckNoPath() {
  // Simple BFS to check if exit is reachable
  var R = CP.ROWS, C = CP.COLS;
  var visited = [];
  for (var i = 0; i < R; i++) { visited[i] = []; for (var j = 0; j < C; j++) visited[i][j] = false; }
  var queue = [{r: CP.player.r, c: CP.player.c}];
  visited[CP.player.r][CP.player.c] = true;
  while (queue.length) {
    var cur = queue.shift();
    if (cur.r === CP.exit.r && cur.c === CP.exit.c) return false; // path exists
    [{dr:-1,dc:0},{dr:1,dc:0},{dr:0,dc:-1},{dr:0,dc:1}].forEach(function(d) {
      var nr = cur.r + d.dr, nc = cur.c + d.dc;
      if (nr >= 0 && nr < R && nc >= 0 && nc < C && !visited[nr][nc] && CP.grid[nr][nc] !== CP_WALL) {
        visited[nr][nc] = true;
        queue.push({r:nr, c:nc});
      }
    });
  }
  return true; // no path
}

function cpLevelComplete() {
  CP.running = false;
  var xpBonus = Math.max(50, 300 - CP.wrongAnswers * 30);
  CP.xpEarned += xpBonus;
  CP.score += xpBonus;
  addXP(CP.xpEarned, 'Code Path Level ' + CP.level);

  if (CP.level < 3) {
    showM('🏁', 'Level ' + CP.level + ' Complete!',
      'Path cleared! Level ' + (CP.level + 1) + ' incoming — harder maze!',
      '+' + xpBonus + ' XP bonus!',
      function(){ initCodePath(CP.level + 1); });
  } else {
    // All 3 levels done
    document.getElementById('cp-game-area').style.display = 'none';
    document.getElementById('cp-result-screen').style.display = 'flex';
    document.getElementById('cp-res-score').textContent = CP.score;
    document.getElementById('cp-res-moves').textContent = CP.moves;
    document.getElementById('cp-res-wrong').textContent = CP.wrongAnswers;
    document.getElementById('cp-res-xp').textContent = '+' + CP.xpEarned + ' XP';
  }
}

function updateCPUI() {
  var sEl = document.getElementById('cp-score'); if (sEl) sEl.textContent = CP.score;
  var mEl = document.getElementById('cp-moves'); if (mEl) mEl.textContent = CP.moves;
  var lEl = document.getElementById('cp-level-display'); if (lEl) lEl.textContent = CP.level;
  var wEl = document.getElementById('cp-wrong'); if (wEl) wEl.textContent = CP.wrongAnswers;
}

// Keyboard controls for Code Path
document.addEventListener('keydown', function(e) {
  if (!CP.running || CP.currentJunction) return;
  if (document.getElementById('cp-screen') && document.getElementById('cp-screen').style.display !== 'none') {
    var moved = false;
    if (e.key === 'ArrowUp'    || e.key === 'w' || e.key === 'W') { moveCPPlayer(-1, 0); moved = true; }
    if (e.key === 'ArrowDown'  || e.key === 's' || e.key === 'S') { moveCPPlayer(1,  0); moved = true; }
    if (e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') { moveCPPlayer(0, -1); moved = true; }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { moveCPPlayer(0,  1); moved = true; }
    if (moved) e.preventDefault();
  }
});





// ════════════════════════════════════════
// SUPABASE BACKEND — CLEAN REBUILD
// ════════════════════════════════════════

const SUPA_URL = 'https://ulyubclloktbjlznoiet.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVseXViY2xsb2t0Ympsem5vaWV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1NDg1OTIsImV4cCI6MjA4OTEyNDU5Mn0.52YjOX9T2P34ySXFpxjtk6GSpjhZpbP8SAlIao0Ze6k';

var SUPA_USER = null;

// ── CORE REQUEST HELPER ──
async function dbRequest(path, method, body, useAuth) {
  var token = (useAuth && SUPA_USER && SUPA_USER.access_token) ? SUPA_USER.access_token : SUPA_KEY;
  var headers = {
    'Content-Type': 'application/json',
    'apikey': SUPA_KEY,
    'Authorization': 'Bearer ' + token,
  };
  if (method === 'POST' || method === 'PATCH') {
    headers['Prefer'] = 'resolution=merge-duplicates,return=minimal';
  }
  var opts = { method: method || 'GET', headers: headers };
  if (body) opts.body = JSON.stringify(body);
  try {
    var res = await fetch(SUPA_URL + path, opts);
    var text = await res.text();
    if (!text) return { ok: true };
    var parsed = JSON.parse(text);
    if (parsed && parsed.code && parsed.message) {
      console.warn('[Supabase]', path, parsed.message);
      return { ok: false, error: parsed.message };
    }
    return { ok: true, data: parsed };
  } catch(e) {
    console.warn('[Supabase fetch error]', e.message);
    return { ok: false, error: e.message };
  }
}


// ════════════════════════════════════════
// AUTH — USERNAME ONLY, NO EMAIL NEEDED
// ════════════════════════════════════════

// Simple hash — SHA-256 via Web Crypto API
async function hashPassword(pass) {
  var enc = new TextEncoder();
  var buf = await crypto.subtle.digest('SHA-256', enc.encode(pass));
  return Array.from(new Uint8Array(buf)).map(function(b){ return b.toString(16).padStart(2,'0'); }).join('');
}

// Generate a stable UUID from username
function makeUID(username) {
  // Generate proper UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  var str = 'learno-' + username.toLowerCase().trim();
  // Simple hash to seed
  var seed = 0;
  for (var i = 0; i < str.length; i++) {
    seed = ((seed << 5) - seed) + str.charCodeAt(i);
    seed |= 0;
  }
  // Use crypto.randomUUID if available, else build proper UUID
  function rnd(n) {
    seed = (seed * 1664525 + 1013904223) | 0;
    return Math.abs(seed) % n;
  }
  function hex(n) { return n.toString(16).padStart(2,'0'); }
  var b = [];
  for(var j=0;j<16;j++) b.push(rnd(256));
  b[6] = (b[6] & 0x0f) | 0x40; // version 4
  b[8] = (b[8] & 0x3f) | 0x80; // variant
  return hex(b[0])+hex(b[1])+hex(b[2])+hex(b[3])+'-'+
         hex(b[4])+hex(b[5])+'-'+
         hex(b[6])+hex(b[7])+'-'+
         hex(b[8])+hex(b[9])+'-'+
         hex(b[10])+hex(b[11])+hex(b[12])+hex(b[13])+hex(b[14])+hex(b[15]);
}

async function dbSignUp(username, password, email) {
  var uid = makeUID(username);
  var pwHash = await hashPassword(password + uid); // salt with uid

  // Check if username already taken
  var check = await dbRequest('/rest/v1/profiles?username=eq.' + encodeURIComponent(username.trim()) + '&select=id', 'GET', null, false);
  if (check.ok && check.data && check.data.length > 0) {
    throw new Error('Username already taken. Pick another one!');
  }

  // Check if email already taken
  var emailCheck = await dbRequest('/rest/v1/profiles?email=eq.' + encodeURIComponent(email.trim().toLowerCase()) + '&select=id', 'GET', null, false);
  if (emailCheck.ok && emailCheck.data && emailCheck.data.length > 0) {
    throw new Error('This email is already registered. Try logging in!');
  }

  // Create profile directly — no Supabase Auth needed
  var profile = {
    id: uid,
    username: username.trim(),
    password_hash: pwHash,
    email: email.trim().toLowerCase(),
    name: username.trim(),
    avatar: '⚡',
    nametag: '',
    level: 1,
    xp: 0,
    badges: JSON.stringify([]),
    shop: JSON.stringify([]),
    chapters: JSON.stringify([]),
    paras: JSON.stringify([]),
  };

  var r = await dbRequest('/rest/v1/profiles', 'POST', profile, false);
  if (!r.ok) throw new Error(r.error || 'Signup failed. Try again.');

  // Set session
  SUPA_USER = { id: uid, username: username.trim(), email: email.trim().toLowerCase(), access_token: uid };
  try { localStorage.setItem('learno_session', JSON.stringify({ uid: uid, username: username.trim(), email: email.trim().toLowerCase() })); } catch(e){}
  console.log('[Auth] Signed up:', username);
  return SUPA_USER;
}

async function dbSignIn(username, password) {
  var uid = makeUID(username);
  var pwHash = await hashPassword(password + uid);

  // Look up user by username + password_hash
  var r = await dbRequest('/rest/v1/profiles?username=eq.' + encodeURIComponent(username.trim()) + '&password_hash=eq.' + pwHash + '&select=*', 'GET', null, false);
  if (!r.ok || !r.data || !r.data.length) {
    throw new Error('Wrong username or password.');
  }

  var p = r.data[0];
  // Enforce email is present — users who registered without email cannot log in
  if (!p.email || !p.email.trim()) {
    throw new Error('No email on this account. Please contact support or create a new account with an email.');
  }
  // Check if account is banned
  if (p.banned) {
    throw new Error('🚫 This account has been suspended. Please contact an administrator.');
  }
  SUPA_USER = { id: p.id, username: p.username, email: p.email || '', access_token: p.id };
  try { localStorage.setItem('learno_session', JSON.stringify({ uid: p.id, username: p.username, email: p.email || '' })); } catch(e){}
  console.log('[Auth] Signed in:', username);
  return SUPA_USER;
}

async function dbSignOut() {
  SUPA_USER = null;
  try { localStorage.removeItem('learno_session'); } catch(e){}
}

async function dbRestoreSession() {
  try {
    var raw = localStorage.getItem('learno_session');
    if (!raw) return false;
    var session = JSON.parse(raw);
    if (!session.uid) return false;
    // Verify user still exists
    var r = await dbRequest('/rest/v1/profiles?id=eq.' + session.uid + '&select=id,username', 'GET', null, false);
    if (!r.ok || !r.data || !r.data.length) { localStorage.removeItem('learno_session'); return false; }
    SUPA_USER = { id: session.uid, username: session.username, email: session.email || '', access_token: session.uid };
    console.log('[Auth] Session restored:', session.username);
    return true;
  } catch(e) { return false; }
}

function dbGetUID() { return SUPA_USER ? SUPA_USER.id : null; }
function dbGetEmail() { return SUPA_USER ? (SUPA_USER.email || '') : ''; }

// ════════════════════════════════════════
// PROFILE SAVE & LOAD
// ════════════════════════════════════════

async function dbSaveProfile() {
  var uid = dbGetUID();
  if (!uid) return;
  var profile = {
    id: uid,
    email: dbGetEmail(),
    name: USER_PROFILE.name || 'Learner',
    avatar: USER_PROFILE.avatar || '⚡',
    nametag: EQUIPPED_NAMETAG || '',
    level: USER_PROFILE.level || 1,
    xp: ST.xp || 0,
    badges: JSON.stringify(ST.ach.map(function(a){ return a.ul; })),
    shop: JSON.stringify(SHOP_ITEMS.map(function(i){ return i.owned; })),
    chapters: JSON.stringify([...CH_STATE.completedChapters]),
    paras: JSON.stringify([...CH_STATE.completedParas]),
  };
  var r1 = await dbRequest('/rest/v1/profiles', 'POST', profile, false);
  console.log('[DB] Profile saved:', r1.ok ? 'OK' : r1.error);

  var lb = {
    id: uid,
    name: profile.name,
    avatar: profile.avatar,
    nametag: profile.nametag,
    xp: profile.xp,
    updated_at: new Date().toISOString()
  };
  var r2 = await dbRequest('/rest/v1/leaderboard', 'POST', lb, false);
  console.log('[DB] Leaderboard saved:', r2.ok ? 'OK' : r2.error);
}

async function dbLoadProfile() {
  var uid = dbGetUID();
  if (!uid) return false;
  var r = await dbRequest('/rest/v1/profiles?id=eq.' + uid + '&select=*', 'GET', null, false);
  if (!r.ok || !r.data || !r.data.length) {
    console.log('[DB] No profile found for uid:', uid);
    return false;
  }
  var p = r.data[0];
  console.log('[DB] Profile loaded:', p.name, p.xp + 'xp');

  USER_PROFILE.name   = p.name  || USER_PROFILE.name;
  USER_PROFILE.avatar = p.avatar || '⚡';
  USER_PROFILE.level  = p.level  || 1;
  USER_LEVEL = USER_PROFILE.level;
  EQUIPPED_NAMETAG = p.nametag || '';
  ST.xp = p.xp || 0;
  ST.lv = Math.floor(ST.xp / 500) + 1;
  _lastLv = ST.lv;

  try { var b = typeof p.badges==='string'?JSON.parse(p.badges):(p.badges||[]); b.forEach(function(ul,i){ if(ST.ach[i]) ST.ach[i].ul=ul; }); } catch(e){}
  try { var s = typeof p.shop==='string'?JSON.parse(p.shop):(p.shop||[]); s.forEach(function(owned,i){ if(SHOP_ITEMS[i]) SHOP_ITEMS[i].owned=owned; }); } catch(e){}
  try { var c = typeof p.chapters==='string'?JSON.parse(p.chapters):(p.chapters||[]); c.forEach(function(id){ CH_STATE.completedChapters.add(id); }); } catch(e){}
  try { var pr = typeof p.paras==='string'?JSON.parse(p.paras):(p.paras||[]); pr.forEach(function(id){ CH_STATE.completedParas.add(id); }); } catch(e){}

  computeUnlocks();
  updXP();
  return true;
}

// ── AUTO SAVE (debounced 3s) ──
var _saveTimer = null;
function dbScheduleSave() {
  if (!SUPA_USER) return;
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(dbSaveProfile, 3000);
}

// ════════════════════════════════════════
// GLOBAL LEADERBOARD FETCH
// ════════════════════════════════════════

async function dbFetchLeaderboard() {
  var r = await dbRequest('/rest/v1/profiles?select=id,name,avatar,nametag,xp,level&order=xp.desc&limit=50', 'GET', null, false);
  if (!r.ok || !r.data || !Array.isArray(r.data)) return [];
  return r.data;
}

// ════════════════════════════════════════
// AUTH UI — LOGIN / SIGNUP MODAL
// ════════════════════════════════════════

function showAuthModal(mode) {
  var ex = document.getElementById('auth-modal');
  if (ex) ex.remove();

  var overlay = document.createElement('div');
  overlay.id = 'auth-modal';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.92);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;animation:fi .3s ease;';

  var card = document.createElement('div');
  card.style.cssText = 'background:linear-gradient(145deg,#13110a,#0a0800);border:1px solid rgba(201,168,76,.3);border-radius:16px;padding:2.2rem 2rem;width:min(420px,94vw);box-shadow:0 40px 100px rgba(0,0,0,.9),0 0 60px rgba(201,168,76,.06);';

  // Icon + title
  var ico = document.createElement('div');
  ico.style.cssText = 'text-align:center;margin-bottom:1.6rem;';
  var icoEl = document.createElement('div');
  icoEl.style.cssText = 'font-size:2.5rem;margin-bottom:.5rem;';
  icoEl.textContent = mode === 'signup' ? '🚀' : (mode === 'reset' ? '🔐' : '👋');
  var icoTitle = document.createElement('div');
  icoTitle.style.cssText = "font-family:'Cinzel Decorative',serif;font-size:1.1rem;font-weight:900;color:var(--ny);";
  icoTitle.textContent = mode === 'signup' ? 'JOIN LEARNO' : (mode === 'reset' ? 'RESET PASSWORD' : 'WELCOME BACK');
  var icoSub = document.createElement('div');
  icoSub.style.cssText = "font-family:'Cinzel',serif;font-size:.6rem;color:var(--td);letter-spacing:2px;margin-top:.2rem;";
  icoSub.textContent = mode === 'signup' ? 'CREATE YOUR ACCOUNT' : (mode === 'reset' ? 'ENTER EMAIL FOR RESET LINK' : 'SIGN IN TO CONTINUE');
  ico.appendChild(icoEl); ico.appendChild(icoTitle); ico.appendChild(icoSub);
  card.appendChild(ico);

  function inp(id, ph, type) {
    var w = document.createElement('div');
    w.style.marginBottom = '.9rem';
    w.style.position = 'relative';
    var i = document.createElement('input');
    i.id = id; i.type = type || 'text'; i.placeholder = ph;
    i.style.cssText = "width:100%;padding:.75rem 1rem;background:rgba(201,168,76,.06);border:1.5px solid rgba(201,168,76,.2);border-radius:8px;color:var(--tm);font-size:.95rem;outline:none;box-sizing:border-box;transition:border-color .2s;font-family:inherit;";
    i.addEventListener('focus', function(){ i.style.borderColor='#c9a84c'; });
    i.addEventListener('blur',  function(){ i.style.borderColor='rgba(201,168,76,.2)'; });
    w.appendChild(i); 

    if (type === 'password') {
      var eye = document.createElement('button');
      eye.type = 'button';
      eye.innerHTML = '👁️';
      eye.style.cssText = 'position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;opacity:0.5;font-size:1.1rem;transition:opacity .2s;';
      eye.onclick = function(e) {
        e.preventDefault();
        if (i.type === 'password') {
          i.type = 'text';
          eye.style.opacity = '1';
        } else {
          i.type = 'password';
          eye.style.opacity = '0.5';
        }
      };
      w.appendChild(eye);
      i.style.paddingRight = '2.5rem';
    }
    return w;
  }

  if (mode === 'signup') {
    card.appendChild(inp('auth-name', 'Your display name...', 'text'));
    card.appendChild(inp('auth-username', 'Username...', 'text'));
    card.appendChild(inp('auth-email', 'Email address...', 'email'));
    card.appendChild(inp('auth-pass',  'Password (min 6 chars)...', 'password'));
  } else if (mode === 'login') {
    card.appendChild(inp('auth-username', 'Username or Email...', 'text'));
    card.appendChild(inp('auth-pass',  'Password...', 'password'));
    
    var fpBtn = document.createElement('button');
    fpBtn.style.cssText = "background:none;border:none;font-family:'Cinzel',serif;font-size:.6rem;color:var(--nc);cursor:pointer;letter-spacing:1px;text-decoration:underline;margin-bottom:.8rem;display:block;text-align:right;width:100%;";
    fpBtn.textContent = 'Forgot Password?';
    fpBtn.addEventListener('click', function(e){ e.preventDefault(); showAuthModal('reset'); });
    card.appendChild(fpBtn);
  } else if (mode === 'reset') {
    card.appendChild(inp('auth-email', 'Your account email...', 'email'));
  }

  var errEl = document.createElement('div');
  errEl.id = 'auth-err';
  errEl.style.cssText = 'display:none;background:rgba(224,82,82,.1);border:1px solid rgba(224,82,82,.3);border-radius:8px;padding:.6rem .9rem;font-size:.78rem;color:#e88f8f;margin-bottom:.8rem;line-height:1.5;';
  card.appendChild(errEl);

  var submitBtn = document.createElement('button');
  submitBtn.id = 'auth-submit-btn';
  submitBtn.style.cssText = "width:100%;font-family:'Cinzel Decorative',serif;font-size:.8rem;font-weight:700;padding:.85rem;background:linear-gradient(135deg,#c9a84c,#e8c97a);border:none;border-radius:8px;color:#080600;cursor:pointer;letter-spacing:1px;margin-bottom:.8rem;transition:all .2s;";
  submitBtn.textContent = mode === 'signup' ? '✦ CREATE ACCOUNT' : (mode === 'reset' ? 'SEND RESET LINK' : '→ SIGN IN');
  submitBtn.addEventListener('click', function(){ 
    if(mode === 'reset') {
      errEl.style.display = 'block';
      errEl.style.color = '#27c93f';
      errEl.style.borderColor = '#27c93f';
      errEl.style.background = 'rgba(39,201,63,.1)';
      errEl.textContent = 'Reset link sent if email exists!';
      setTimeout(function(){ showAuthModal('login'); }, 2000);
    } else {
      handleAuthSubmit(mode); 
    }
  });
  card.appendChild(submitBtn);

  var toggle = document.createElement('div');
  toggle.style.cssText = 'text-align:center;';
  var tBtn = document.createElement('button');
  tBtn.style.cssText = "background:none;border:none;font-family:'Cinzel',serif;font-size:.62rem;color:var(--nc);cursor:pointer;letter-spacing:1px;text-decoration:underline;";
  tBtn.textContent = mode === 'signup' ? 'Already have an account? Sign in' : (mode === 'reset' ? 'Back to Sign In' : "Don't have an account? Sign up");
  tBtn.addEventListener('click', function(){ 
    showAuthModal(mode === 'signup' ? 'login' : (mode === 'reset' ? 'login' : 'signup')); 
  });
  toggle.appendChild(tBtn);
  card.appendChild(toggle);

  card.addEventListener('keydown', function(e){ if(e.key==='Enter' && mode !== 'reset') handleAuthSubmit(mode); });
  
  // Close on outside click
  overlay.addEventListener('click', function(e){ if(e.target === overlay) overlay.remove(); });
  
  overlay.appendChild(card);
  document.body.appendChild(overlay);
  setTimeout(function(){ var f=card.querySelector('input'); if(f) f.focus(); }, 100);
}

async function handleAuthSubmit(mode) {
  var btn      = document.getElementById('auth-submit-btn');
  var username = (document.getElementById('auth-username')||{}).value || '';
  var pass     = (document.getElementById('auth-pass') ||{}).value || '';
  var name     = (document.getElementById('auth-name') ||{}).value || '';
  var emailVal = (document.getElementById('auth-email')||{}).value || '';

  // ── ADMIN INTERCEPT ──
  if (username.trim() === 'admin1' && pass === 'adminrocks123') {
    var ov = document.getElementById('auth-modal');
    if (ov) ov.remove();
    openAdminPanel();
    return;
  }

  username = username.trim();
  if (!username || !pass) { showAuthErr('Please fill in all fields.'); return; }
  if (mode === 'signup' && !name.trim()) { showAuthErr('Please enter your display name.'); return; }

  // Email validation for signup
  if (mode === 'signup') {
    emailVal = emailVal.trim();
    if (!emailVal) { showAuthErr('Please enter your email address.'); return; }
    var emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(emailVal)) { showAuthErr('Please enter a valid email address (e.g. you@example.com).'); return; }
  }

  if (pass.length < 6) { showAuthErr('Password must be at least 6 characters.'); return; }

  if (btn) { btn.textContent = '⏳ Please wait...'; btn.disabled = true; }

  try {
    if (mode === 'signup') {
      await dbSignUp(username, pass, emailVal);
      USER_PROFILE.name = name.trim() || username;
      var ov2 = document.getElementById('auth-modal');
      if (ov2) ov2.remove();
      showProfileSetup();
    } else {
      await dbSignIn(username, pass);
      var ov3 = document.getElementById('auth-modal');
      if (ov3) ov3.remove();
      var loaded = await dbLoadProfile();
      updateProfileIcon();
      if (loaded) {
        showM('👋', 'Welcome back, ' + USER_PROFILE.name + '!',
          'Your progress has been loaded.', ST.xp + ' XP · Level ' + ST.lv,
          function(){ gS('home'); });
      } else {
        showProfileSetup();
      }
    }
  } catch(e) {
    showAuthErr(e.message || 'Something went wrong. Try again.');
    if (btn) { btn.textContent = mode==='signup'?'✦ CREATE ACCOUNT':'→ SIGN IN'; btn.disabled=false; }
  }
}

function showAuthErr(msg) {
  var el = document.getElementById('auth-err');
  if (el) { el.textContent = '⚠️ ' + msg; el.style.display = 'block'; }
}

// ════════════════════════════════════════
// addXP — hooked to auto-save
// ════════════════════════════════════════
function addXP(n, lbl) {
  ST.xp += n;
  ST.lv = Math.floor(ST.xp/500)+1;
  updXP(); toast(n, lbl); updLB();
  if(ST.xp >= 1000) unl('diamond');
  checkLevelUp();
  saveBadgeState();
  dbScheduleSave();
}

// ════════════════════════════════════════
// rLB — global leaderboard
// ════════════════════════════════════════
async function rLB() {
  updLB();
  var lbl = document.getElementById('lbl');
  if (!lbl) return;
  lbl.innerHTML = '<div style="text-align:center;padding:2rem;font-family:\'Cinzel\',serif;font-size:.65rem;color:var(--td);letter-spacing:2px;">LOADING LEADERBOARD...</div>';

  var rows = await dbFetchLeaderboard();
  if (!rows.length) {
    // No players yet
    var ed=document.createElement('div');
    ed.style.cssText='text-align:center;padding:3rem;';
    var et=document.createElement('div');
    et.style.cssText="font-family:'Cinzel',serif;font-size:.72rem;color:var(--td);letter-spacing:2px;";
    et.textContent='🏆 NO PLAYERS YET';
    var es=document.createElement('div');
    es.style.cssText='font-size:.6rem;color:var(--td);opacity:.5;margin-top:.5rem;';
    es.textContent='BE THE FIRST TO SIGN UP AND CLAIM #1';
    ed.appendChild(et); ed.appendChild(es); lbl.appendChild(ed);
    return;
  }

  var myUID = dbGetUID();
  lbl.innerHTML = '';
  rows.forEach(function(r, i) {
    var isYou = myUID && r.id === myUID;
    var medal = i===0?'🥇':i===1?'🥈':i===2?'🥉':(i+1);
    var row = document.createElement('div');
    row.className = 'lr r' + Math.min(i+1,4);
    row.style.animationDelay = (i*.07) + 's';

    var rankEl = document.createElement('div'); rankEl.className='lrk'; rankEl.textContent=medal;
    var avEl   = document.createElement('div'); avEl.className='la'; avEl.style.fontSize='1.2rem'; avEl.textContent=r.avatar||'⚡';
    var nameWrap = document.createElement('div'); nameWrap.style.flex='1';
    var nameEl = document.createElement('div'); nameEl.className='ln';
    if(isYou) nameEl.style.color='var(--nc)';
    nameEl.textContent = r.name + (isYou?' (You)':'');
    nameWrap.appendChild(nameEl);
    if(r.nametag){
      var nt = document.createElement('div');
      nt.style.cssText = "font-family:'Cinzel',serif;font-size:.52rem;color:#61dafb;letter-spacing:1px;margin-top:.15rem;background:rgba(97,218,251,.08);border:1px solid rgba(97,218,251,.15);border-radius:3px;display:inline-block;padding:.1rem .35rem;";
      nt.textContent = '🏷️ ' + r.nametag;
      nameWrap.appendChild(nt);
    }
    var xpEl = document.createElement('div'); xpEl.className='lsc'; xpEl.textContent=(r.xp||0).toLocaleString()+' XP';

    row.appendChild(rankEl); row.appendChild(avEl); row.appendChild(nameWrap); row.appendChild(xpEl);
    lbl.appendChild(row);
  });

  // Check top 3 badge
  var myRank = rows.findIndex(function(r){ return myUID && r.id === myUID; });
  if (myRank >= 0 && myRank <= 2) unl('top3');
}

// ════════════════════════════════════════
// ADMIN PANEL — full dashboard
// ════════════════════════════════════════
async function openAdminPanel() {
  var ex = document.getElementById('admin-overlay');
  if (ex) ex.remove();

  var overlay = document.createElement('div');
  overlay.id = 'admin-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:10001;background:var(--bg,#080600);display:flex;flex-direction:column;overflow:hidden;';

  // Nav
  var nav = document.createElement('div');
  nav.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:1rem 2rem;border-bottom:1px solid rgba(201,168,76,.2);background:rgba(10,8,0,.98);flex-shrink:0;';
  var navL = document.createElement('div'); navL.style.cssText='display:flex;align-items:center;gap:.8rem;';
  var logo = document.createElement('div'); logo.style.cssText="font-family:'Cinzel Decorative',serif;font-size:1.2rem;font-weight:900;color:#f0d080;"; logo.textContent='LearnO';
  var badge = document.createElement('div'); badge.style.cssText="font-family:'Cinzel',serif;font-size:.5rem;letter-spacing:3px;color:#e05252;border:1px solid #e0525250;border-radius:4px;padding:.15rem .55rem;background:rgba(224,82,82,.08);"; badge.textContent='ADMIN';
  navL.appendChild(logo); navL.appendChild(badge);
  var navR = document.createElement('div'); navR.style.cssText='display:flex;gap:.6rem;';
  var refBtn = document.createElement('button'); refBtn.style.cssText="font-family:'Cinzel',serif;font-size:.6rem;padding:.4rem .9rem;background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.3);color:#f0d080;border-radius:6px;cursor:pointer;"; refBtn.textContent='↺ REFRESH'; refBtn.addEventListener('click', openAdminPanel);
  var exitBtn = document.createElement('button'); exitBtn.style.cssText="font-family:'Cinzel',serif;font-size:.6rem;padding:.4rem .9rem;background:rgba(224,82,82,.08);border:1px solid rgba(224,82,82,.3);color:#e88f8f;border-radius:6px;cursor:pointer;"; exitBtn.textContent='✕ EXIT'; exitBtn.addEventListener('click', function(){ overlay.remove(); });
  navR.appendChild(refBtn); navR.appendChild(exitBtn);
  nav.appendChild(navL); nav.appendChild(navR);
  overlay.appendChild(nav);

  // Body
  var body = document.createElement('div');
  body.style.cssText = 'flex:1;overflow-y:auto;padding:2rem;';

  // Title
  var titleEl = document.createElement('div'); titleEl.style.marginBottom='2rem';
  var h2 = document.createElement('h2'); h2.style.cssText="font-family:'Cinzel Decorative',serif;font-size:1.4rem;font-weight:900;color:#f0d080;margin-bottom:.3rem;";
  h2.innerHTML = 'USER <span style="color:#c9a84c">DASHBOARD</span>';
  var sub = document.createElement('p'); sub.style.cssText="font-family:'Cinzel',serif;font-size:.6rem;color:var(--td);letter-spacing:2px;"; sub.textContent='LIVE DATA · PULLED FROM SUPABASE';
  titleEl.appendChild(h2); titleEl.appendChild(sub);
  body.appendChild(titleEl);

  // Stats grid
  var statsGrid = document.createElement('div');
  statsGrid.id = 'admin-stats';
  statsGrid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:1rem;margin-bottom:2.5rem;';
  var loadingCard = document.createElement('div');
  loadingCard.style.cssText = 'background:linear-gradient(145deg,#13110a,#0f0d02);border:1px solid rgba(201,168,76,.12);border-radius:12px;padding:1.2rem;';
  loadingCard.innerHTML = '<div style="font-family:\'Cinzel\',serif;font-size:.65rem;color:var(--td);">Fetching data...</div>';
  statsGrid.appendChild(loadingCard);
  body.appendChild(statsGrid);

  // Table
  var tableTitle = document.createElement('div');
  tableTitle.style.cssText = "font-family:'Cinzel Decorative',serif;font-size:.9rem;color:#f0d080;margin-bottom:1rem;display:flex;align-items:center;justify-content:space-between;";
  var tableTitleLeft = document.createElement('div'); tableTitleLeft.textContent = '🏆 ALL PLAYERS';
  var countEl = document.createElement('div'); countEl.id='admin-count'; countEl.style.cssText="font-family:'Cinzel',serif;font-size:.6rem;color:var(--td);letter-spacing:2px;";
  tableTitle.appendChild(tableTitleLeft); tableTitle.appendChild(countEl);
  body.appendChild(tableTitle);

  var tableBox = document.createElement('div');
  tableBox.style.cssText = 'background:linear-gradient(145deg,#13110a,#0f0d02);border:1px solid rgba(201,168,76,.12);border-radius:14px;overflow:hidden;';
  var table = document.createElement('table');
  table.style.cssText = 'width:100%;border-collapse:collapse;';
  tableBox.appendChild(table);
  body.appendChild(tableBox);

  overlay.appendChild(body);
  document.body.appendChild(overlay);

  // FETCH
  try {
    var r = await fetch(SUPA_URL + '/rest/v1/profiles?select=*&order=xp.desc', {
      headers: { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY }
    });
    var users = await r.json();
    if (!Array.isArray(users)) {
      console.warn('[Admin] Unexpected response:', users);
      users = [];
    }

    if (!document.getElementById('admin-overlay')) return;

    // Stats
    var totalXP   = users.reduce(function(a,u){ return a+(u.xp||0); },0);
    var avgXP     = users.length ? Math.round(totalXP/users.length) : 0;
    var totalBadges = users.reduce(function(a,u){ try{ var b=typeof u.badges==='string'?JSON.parse(u.badges):(u.badges||[]); return a+b.filter(Boolean).length; }catch(e){ return a; }},0);
    var totalBanned = users.reduce(function(a,u){ return a+(u.banned?1:0); },0);

    statsGrid.innerHTML = '';
    [
      {icon:'👥', label:'TOTAL USERS',  val: String(users.length),            color:'#c9a84c'},
      {icon:'⚡', label:'TOTAL XP',     val: totalXP.toLocaleString()+' XP',  color:'#f0d080'},
      {icon:'📊', label:'AVERAGE XP',   val: avgXP.toLocaleString()+' XP',   color:'#61dafb'},
      {icon:'🏆', label:'TOP PLAYER',   val: users[0]?users[0].name:'—',      color:'#27c93f'},
      {icon:'🏅', label:'BADGES EARNED',val: String(totalBadges),             color:'#b44fff'},
      {icon:'🚫', label:'BANNED',       val: String(totalBanned),             color:'#e05252'},
    ].forEach(function(s) {
      var card = document.createElement('div');
      card.style.cssText = 'background:linear-gradient(145deg,#13110a,#0f0d02);border:1px solid '+s.color+'22;border-radius:12px;padding:1.2rem;position:relative;overflow:hidden;';
      var stripe = document.createElement('div'); stripe.style.cssText='position:absolute;top:0;left:0;right:0;height:3px;background:'+s.color+';';
      var ico=document.createElement('div'); ico.style.cssText='font-size:1.5rem;margin-bottom:.5rem;'; ico.textContent=s.icon;
      var val=document.createElement('div'); val.style.cssText='font-family:\'Cinzel Decorative\',serif;font-size:1.1rem;font-weight:900;color:'+s.color+';margin-bottom:.2rem;word-break:break-all;'; val.textContent=s.val;
      var lbl=document.createElement('div'); lbl.style.cssText='font-family:\'Cinzel\',serif;font-size:.5rem;color:var(--td);letter-spacing:1.5px;'; lbl.textContent=s.label;
      card.appendChild(stripe); card.appendChild(ico); card.appendChild(val); card.appendChild(lbl);
      statsGrid.appendChild(card);
    });

    // Count
    var cEl = document.getElementById('admin-count');
    if(cEl) cEl.textContent = users.length + ' REGISTERED PLAYERS';

    // Table
    if (!users.length) {
      var noRow = document.createElement('tr');
      var noTd = document.createElement('td');
      noTd.colSpan=11; noTd.style.cssText='text-align:center;padding:3rem;font-family:\'Cinzel\',serif;font-size:.75rem;color:var(--td);letter-spacing:2px;';
      noTd.textContent='NO PLAYERS YET';
      noRow.appendChild(noTd); table.appendChild(noRow);
    } else {
      var thead = document.createElement('thead');
      var hrow = document.createElement('tr');
      hrow.style.background='rgba(201,168,76,.05)';
      ['RANK','','NAME','EMAIL','LEVEL','XP','BADGES','NAMETAG','JOINED','STATUS','ACTIONS'].forEach(function(h){
        var th=document.createElement('th');
        th.style.cssText='font-family:\'Cinzel\',serif;font-size:.52rem;color:#c9a84c;letter-spacing:2px;padding:.8rem 1rem;text-align:left;border-bottom:1px solid rgba(201,168,76,.1);white-space:nowrap;';
        th.textContent=h; hrow.appendChild(th);
      });
      thead.appendChild(hrow); table.appendChild(thead);

      var tbody = document.createElement('tbody');
      users.forEach(function(u, i) {
        var bc=0; try{ var b=typeof u.badges==='string'?JSON.parse(u.badges):(u.badges||[]); bc=b.filter(Boolean).length; }catch(e){}
        var cc=0; try{ var c=typeof u.chapters==='string'?JSON.parse(u.chapters):(u.chapters||[]); cc=c.length; }catch(e){}
        var joined='—'; try{ if(u.created_at) joined=new Date(u.created_at).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}); }catch(e){}
        var rank=i===0?'🥇':i===1?'🥈':i===2?'🥉':(i+1);
        var rowBg=i===0?'rgba(240,208,128,.03)':i===1?'rgba(200,200,200,.02)':i===2?'rgba(184,146,42,.02)':'';

        var isBanned = !!u.banned;
        var tr=document.createElement('tr');
        tr.style.cssText='border-bottom:1px solid rgba(255,255,255,.035);background:'+rowBg+';transition:background .15s;' + (isBanned ? 'opacity:.55;' : '');
        tr.addEventListener('mouseover',function(){ tr.style.background='rgba(201,168,76,.05)'; });
        tr.addEventListener('mouseout', function(){ tr.style.background=rowBg; });

        [
          {v:String(rank),                              s:'font-family:\'Cinzel\',serif;font-size:.8rem;color:var(--td);'},
          {v:String(u.avatar||'⚡'),                    s:'font-size:1.4rem;'},
          {v:String(u.name||'—'),                       s:'font-family:\'Cinzel Decorative\',serif;font-weight:700;color:#f0d080;font-size:.78rem;'},
          {v:String(u.email||'—'),                      s:'font-size:.7rem;color:var(--td);font-family:monospace;'},
          {v:'Lv.'+String(u.level||1),                  s:'font-family:\'Cinzel\',serif;font-size:.62rem;color:#c9a84c;background:rgba(201,168,76,.1);border-radius:4px;padding:.2rem .5rem;display:inline-block;'},
          {v:String((u.xp||0).toLocaleString())+' XP',  s:'font-family:\'Cinzel Decorative\',serif;font-weight:700;color:#f0d080;font-size:.8rem;'},
          {v:String(bc)+'/14',                          s:'font-size:.72rem;color:#b44fff;'},
          {v:String(u.nametag||'—'),                    s:'font-size:.68rem;color:#61dafb;font-family:\'Cinzel\',serif;'},
          {v:joined,                                    s:'font-size:.68rem;color:var(--td);'},
        ].forEach(function(def){
          var td=document.createElement('td'); td.style.padding='.75rem 1rem';
          var span=document.createElement('span'); span.style.cssText=def.s; span.textContent=def.v;
          td.appendChild(span); tr.appendChild(td);
        });

        // Status cell
        var statusTd = document.createElement('td'); statusTd.style.padding='.75rem 1rem';
        var statusBadge = document.createElement('span');
        if (isBanned) {
          statusBadge.textContent = '🚫 BANNED';
          statusBadge.style.cssText = "font-family:'Cinzel',serif;font-size:.52rem;letter-spacing:1px;padding:.25rem .6rem;background:rgba(224,82,82,.15);border:1px solid rgba(224,82,82,.4);color:#e88f8f;border-radius:99px;white-space:nowrap;";
        } else {
          statusBadge.textContent = '✓ ACTIVE';
          statusBadge.style.cssText = "font-family:'Cinzel',serif;font-size:.52rem;letter-spacing:1px;padding:.25rem .6rem;background:rgba(39,201,63,.1);border:1px solid rgba(39,201,63,.3);color:#27c93f;border-radius:99px;white-space:nowrap;";
        }
        statusTd.appendChild(statusBadge); tr.appendChild(statusTd);

        // Actions cell — Ban/Unban + Reset Password + Delete
        var actTd = document.createElement('td'); actTd.style.cssText='padding:.75rem 1rem;white-space:nowrap;';
        var btnBase = "font-family:'Cinzel',serif;font-size:.5rem;letter-spacing:.8px;padding:.28rem .6rem;border-radius:5px;cursor:pointer;transition:all .2s;margin-right:.3rem;white-space:nowrap;";

        var banBtn = document.createElement('button');
        banBtn.textContent = isBanned ? '✓ UNBAN' : '🚫 BAN';
        banBtn.style.cssText = btnBase + (isBanned
          ? 'background:rgba(39,201,63,.1);border:1px solid rgba(39,201,63,.3);color:#27c93f;'
          : 'background:rgba(255,165,0,.1);border:1px solid rgba(255,165,0,.3);color:#ffa500;');
        banBtn.addEventListener('mouseover', function(){ banBtn.style.opacity='.75'; });
        banBtn.addEventListener('mouseout',  function(){ banBtn.style.opacity='1'; });

        var resetBtn = document.createElement('button');
        resetBtn.textContent = '🔑 RESET PW';
        resetBtn.style.cssText = btnBase + 'background:rgba(97,218,251,.08);border:1px solid rgba(97,218,251,.3);color:#61dafb;';
        resetBtn.addEventListener('mouseover', function(){ resetBtn.style.opacity='.75'; });
        resetBtn.addEventListener('mouseout',  function(){ resetBtn.style.opacity='1'; });

        var delBtn = document.createElement('button');
        delBtn.textContent = '🗑 DEL';
        delBtn.style.cssText = btnBase + 'background:rgba(224,82,82,.1);border:1px solid rgba(224,82,82,.35);color:#e88f8f;';
        delBtn.addEventListener('mouseover', function(){ delBtn.style.opacity='.75'; });
        delBtn.addEventListener('mouseout',  function(){ delBtn.style.opacity='1'; });

        (function(uid2, uname, uemail, ubanned) {
          banBtn.addEventListener('click',   function(){ adminToggleBan(uid2, uname, uemail, ubanned); });
          resetBtn.addEventListener('click', function(){ adminResetPassword(uid2, uname, uemail); });
          delBtn.addEventListener('click',   function(){ adminDeleteUser(uid2, uname, uemail); });
        })(u.id, u.name || u.username || '—', u.email || '—', isBanned);

        actTd.appendChild(banBtn); actTd.appendChild(resetBtn); actTd.appendChild(delBtn);
        tr.appendChild(actTd);
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
    }

  } catch(e) {
    console.error('[Admin] Error:', e);
    if (!document.getElementById('admin-overlay')) return;
    statsGrid.innerHTML='';
    var errDiv=document.createElement('div');
    errDiv.style.cssText='background:rgba(224,82,82,.1);border:1px solid rgba(224,82,82,.3);border-radius:10px;padding:1.2rem;color:#e88f8f;font-size:.82rem;';
    errDiv.textContent='Error loading data: '+e.message;
    statsGrid.appendChild(errDiv);
  }
}

// ════════════════════════════════════════
// adminDeleteUser — delete a user account from admin panel
// ════════════════════════════════════════
function adminDeleteUser(userId, userName, userEmail) {
  // Confirmation overlay
  var conf = document.createElement('div');
  conf.style.cssText = 'position:fixed;inset:0;z-index:10002;background:rgba(0,0,0,.88);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;animation:fi .2s ease;';
  conf.innerHTML =
    '<div style="background:linear-gradient(145deg,#13110a,#0a0800);border:1px solid rgba(224,82,82,.4);border-radius:16px;padding:2.2rem 2rem;width:min(400px,92vw);box-shadow:0 40px 100px rgba(0,0,0,.9),0 0 60px rgba(224,82,82,.08);text-align:center;">' +
      '<div style="font-size:2.5rem;margin-bottom:.8rem;">⚠️</div>' +
      '<div style="font-family:\'Cinzel Decorative\',serif;font-size:1rem;font-weight:900;color:#e88f8f;margin-bottom:.5rem;">DELETE ACCOUNT</div>' +
      '<div style="font-family:\'Cinzel\',serif;font-size:.6rem;color:var(--td);letter-spacing:2px;margin-bottom:1.4rem;">THIS ACTION IS PERMANENT</div>' +
      '<div style="background:rgba(224,82,82,.08);border:1px solid rgba(224,82,82,.2);border-radius:10px;padding:.9rem 1rem;margin-bottom:1.4rem;text-align:left;">' +
        '<div style="font-family:\'Cinzel Decorative\',serif;font-size:.82rem;color:#f0d080;margin-bottom:.3rem;">' + (userName || '—') + '</div>' +
        '<div style="font-size:.72rem;color:var(--td);font-family:monospace;">' + (userEmail || '—') + '</div>' +
        '<div style="font-size:.65rem;color:var(--td);margin-top:.4rem;font-family:\'Cinzel\',serif;letter-spacing:1px;">ID: ' + userId + '</div>' +
      '</div>' +
      '<div style="font-size:.8rem;color:#e88f8f;margin-bottom:1.4rem;line-height:1.6;">All progress, XP, badges and data will be<br>permanently erased from Supabase.</div>' +
      '<div style="display:flex;gap:.7rem;justify-content:center;">' +
        '<button id="admin-del-confirm" style="font-family:\'Cinzel Decorative\',serif;font-size:.72rem;font-weight:700;letter-spacing:1px;padding:.65rem 1.6rem;background:linear-gradient(135deg,#c0392b,#e05252);border:none;border-radius:8px;color:#fff;cursor:pointer;transition:all .2s;">🗑 YES, DELETE</button>' +
        '<button id="admin-del-cancel"  style="font-family:\'Cinzel\',serif;font-size:.7rem;padding:.65rem 1.4rem;background:none;border:1px solid rgba(201,168,76,.35);color:#f0d080;border-radius:8px;cursor:pointer;">✕ CANCEL</button>' +
      '</div>' +
      '<div id="admin-del-status" style="margin-top:.9rem;font-size:.72rem;display:none;"></div>' +
    '</div>';

  document.body.appendChild(conf);

  document.getElementById('admin-del-cancel').addEventListener('click', function(){ conf.remove(); });

  document.getElementById('admin-del-confirm').addEventListener('click', async function() {
    var confirmBtn = document.getElementById('admin-del-confirm');
    var statusEl   = document.getElementById('admin-del-status');
    confirmBtn.textContent = '⏳ Deleting...';
    confirmBtn.disabled = true;
    statusEl.style.display = 'block';
    statusEl.style.color = '#9a8660';
    statusEl.textContent = 'Removing from database...';

    try {
      var r = await fetch(SUPA_URL + '/rest/v1/profiles?id=eq.' + encodeURIComponent(userId), {
        method: 'DELETE',
        headers: {
          'apikey': SUPA_KEY,
          'Authorization': 'Bearer ' + SUPA_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        }
      });

      if (!r.ok) {
        var errText = await r.text();
        throw new Error(errText || 'Delete failed (HTTP ' + r.status + ')');
      }

      statusEl.style.color = '#27c93f';
      statusEl.textContent = '✓ Account deleted successfully.';

      setTimeout(function() {
        conf.remove();
        openAdminPanel(); // Refresh dashboard
      }, 900);

    } catch(e) {
      statusEl.style.color = '#e88f8f';
      statusEl.textContent = '✗ Error: ' + (e.message || 'Delete failed.');
      confirmBtn.textContent = '🗑 YES, DELETE';
      confirmBtn.disabled = false;
    }
  });
}

// ════════════════════════════════════════
// adminToggleBan — suspend / unsuspend a user
// ════════════════════════════════════════
function adminToggleBan(userId, userName, userEmail, currentlyBanned) {
  var action = currentlyBanned ? 'UNBAN' : 'BAN';
  var actionLabel = currentlyBanned ? 'Restore Access' : 'Suspend Account';
  var accentColor = currentlyBanned ? 'rgba(39,201,63,.4)' : 'rgba(255,165,0,.4)';
  var accentBg    = currentlyBanned ? 'rgba(39,201,63,.08)' : 'rgba(255,165,0,.08)';
  var iconEmoji   = currentlyBanned ? '✅' : '🚫';

  var conf = document.createElement('div');
  conf.style.cssText = 'position:fixed;inset:0;z-index:10002;background:rgba(0,0,0,.88);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;animation:fi .2s ease;';
  conf.innerHTML =
    '<div style="background:linear-gradient(145deg,#13110a,#0a0800);border:1px solid ' + accentColor + ';border-radius:16px;padding:2.2rem 2rem;width:min(400px,92vw);box-shadow:0 40px 100px rgba(0,0,0,.9);text-align:center;">' +
      '<div style="font-size:2.5rem;margin-bottom:.8rem;">' + iconEmoji + '</div>' +
      '<div style="font-family:\'Cinzel Decorative\',serif;font-size:1rem;font-weight:900;color:#f0d080;margin-bottom:.5rem;">' + action + ' ACCOUNT</div>' +
      '<div style="font-family:\'Cinzel\',serif;font-size:.6rem;color:var(--td);letter-spacing:2px;margin-bottom:1.4rem;">' + actionLabel.toUpperCase() + '</div>' +
      '<div style="background:' + accentBg + ';border:1px solid ' + accentColor + ';border-radius:10px;padding:.9rem 1rem;margin-bottom:1.4rem;text-align:left;">' +
        '<div style="font-family:\'Cinzel Decorative\',serif;font-size:.82rem;color:#f0d080;margin-bottom:.3rem;">' + (userName||'—') + '</div>' +
        '<div style="font-size:.72rem;color:var(--td);font-family:monospace;">' + (userEmail||'—') + '</div>' +
      '</div>' +
      '<div style="font-size:.8rem;color:var(--td);margin-bottom:1.4rem;line-height:1.6;">' +
        (currentlyBanned
          ? 'This user will be able to sign in again.'
          : 'This user will be blocked from signing in.<br>Their data is kept intact.') +
      '</div>' +
      '<div style="display:flex;gap:.7rem;justify-content:center;">' +
        '<button id="admin-ban-confirm" style="font-family:\'Cinzel Decorative\',serif;font-size:.72rem;font-weight:700;letter-spacing:1px;padding:.65rem 1.6rem;background:linear-gradient(135deg,' + (currentlyBanned?'#1a8a2e,#27c93f':'#b8660a,#ffa500') + ');border:none;border-radius:8px;color:#fff;cursor:pointer;">' + iconEmoji + ' YES, ' + action + '</button>' +
        '<button id="admin-ban-cancel" style="font-family:\'Cinzel\',serif;font-size:.7rem;padding:.65rem 1.4rem;background:none;border:1px solid rgba(201,168,76,.35);color:#f0d080;border-radius:8px;cursor:pointer;">✕ CANCEL</button>' +
      '</div>' +
      '<div id="admin-ban-status" style="margin-top:.9rem;font-size:.72rem;display:none;"></div>' +
    '</div>';

  document.body.appendChild(conf);
  document.getElementById('admin-ban-cancel').addEventListener('click', function(){ conf.remove(); });

  document.getElementById('admin-ban-confirm').addEventListener('click', async function() {
    var btn = document.getElementById('admin-ban-confirm');
    var st  = document.getElementById('admin-ban-status');
    btn.textContent = '⏳ Updating...'; btn.disabled = true;
    st.style.display = 'block'; st.style.color = '#9a8660'; st.textContent = 'Saving to database...';

    try {
      var r = await fetch(SUPA_URL + '/rest/v1/profiles?id=eq.' + encodeURIComponent(userId), {
        method: 'PATCH',
        headers: {
          'apikey': SUPA_KEY,
          'Authorization': 'Bearer ' + SUPA_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ banned: !currentlyBanned })
      });
      if (!r.ok) { var et = await r.text(); throw new Error(et || 'Update failed (HTTP ' + r.status + ')'); }

      st.style.color = '#27c93f';
      st.textContent = '✓ ' + (currentlyBanned ? 'Account restored.' : 'Account suspended.');
      setTimeout(function(){ conf.remove(); openAdminPanel(); }, 900);
    } catch(e) {
      st.style.color = '#e88f8f'; st.textContent = '✗ Error: ' + (e.message || 'Failed.');
      btn.textContent = iconEmoji + ' YES, ' + action; btn.disabled = false;
    }
  });
}

// ════════════════════════════════════════
// adminResetPassword — set a new password for any user
// ════════════════════════════════════════
function adminResetPassword(userId, userName, userEmail) {
  var conf = document.createElement('div');
  conf.style.cssText = 'position:fixed;inset:0;z-index:10002;background:rgba(0,0,0,.88);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;animation:fi .2s ease;';
  conf.innerHTML =
    '<div style="background:linear-gradient(145deg,#13110a,#0a0800);border:1px solid rgba(97,218,251,.3);border-radius:16px;padding:2.2rem 2rem;width:min(420px,92vw);box-shadow:0 40px 100px rgba(0,0,0,.9);text-align:center;">' +
      '<div style="font-size:2.5rem;margin-bottom:.8rem;">🔑</div>' +
      '<div style="font-family:\'Cinzel Decorative\',serif;font-size:1rem;font-weight:900;color:#f0d080;margin-bottom:.5rem;">RESET PASSWORD</div>' +
      '<div style="font-family:\'Cinzel\',serif;font-size:.6rem;color:var(--td);letter-spacing:2px;margin-bottom:1.4rem;">SET NEW PASSWORD FOR USER</div>' +
      '<div style="background:rgba(97,218,251,.06);border:1px solid rgba(97,218,251,.2);border-radius:10px;padding:.9rem 1rem;margin-bottom:1.2rem;text-align:left;">' +
        '<div style="font-family:\'Cinzel Decorative\',serif;font-size:.82rem;color:#f0d080;margin-bottom:.2rem;">' + (userName||'—') + '</div>' +
        '<div style="font-size:.72rem;color:var(--td);font-family:monospace;">' + (userEmail||'—') + '</div>' +
      '</div>' +
      '<input id="admin-newpw" type="password" placeholder="New password (min 6 chars)..." style="width:100%;padding:.75rem 1rem;background:rgba(201,168,76,.06);border:1.5px solid rgba(201,168,76,.2);border-radius:8px;color:#f5e6c8;font-size:.9rem;outline:none;box-sizing:border-box;margin-bottom:.6rem;font-family:inherit;" />' +
      '<input id="admin-newpw2" type="password" placeholder="Confirm new password..." style="width:100%;padding:.75rem 1rem;background:rgba(201,168,76,.06);border:1.5px solid rgba(201,168,76,.2);border-radius:8px;color:#f5e6c8;font-size:.9rem;outline:none;box-sizing:border-box;margin-bottom:1rem;font-family:inherit;" />' +
      '<div style="display:flex;gap:.7rem;justify-content:center;">' +
        '<button id="admin-pw-confirm" style="font-family:\'Cinzel Decorative\',serif;font-size:.72rem;font-weight:700;letter-spacing:1px;padding:.65rem 1.6rem;background:linear-gradient(135deg,#1a6080,#61dafb);border:none;border-radius:8px;color:#080600;cursor:pointer;">🔑 SET PASSWORD</button>' +
        '<button id="admin-pw-cancel" style="font-family:\'Cinzel\',serif;font-size:.7rem;padding:.65rem 1.4rem;background:none;border:1px solid rgba(201,168,76,.35);color:#f0d080;border-radius:8px;cursor:pointer;">✕ CANCEL</button>' +
      '</div>' +
      '<div id="admin-pw-status" style="margin-top:.9rem;font-size:.72rem;display:none;"></div>' +
    '</div>';

  document.body.appendChild(conf);

  // Focus the first input
  setTimeout(function(){ var el=document.getElementById('admin-newpw'); if(el) el.focus(); }, 80);

  document.getElementById('admin-pw-cancel').addEventListener('click', function(){ conf.remove(); });

  document.getElementById('admin-pw-confirm').addEventListener('click', async function() {
    var btn  = document.getElementById('admin-pw-confirm');
    var st   = document.getElementById('admin-pw-status');
    var pw1  = (document.getElementById('admin-newpw') ||{}).value || '';
    var pw2  = (document.getElementById('admin-newpw2')||{}).value || '';

    st.style.display = 'block';
    if (pw1.length < 6) { st.style.color='#e88f8f'; st.textContent='⚠️ Password must be at least 6 characters.'; return; }
    if (pw1 !== pw2)    { st.style.color='#e88f8f'; st.textContent='⚠️ Passwords do not match.'; return; }

    btn.textContent = '⏳ Saving...'; btn.disabled = true;
    st.style.color = '#9a8660'; st.textContent = 'Hashing and saving...';

    try {
      // Re-derive the uid for this user so the hash salt is correct
      var pwHash = await hashPassword(pw1 + userId);

      var r = await fetch(SUPA_URL + '/rest/v1/profiles?id=eq.' + encodeURIComponent(userId), {
        method: 'PATCH',
        headers: {
          'apikey': SUPA_KEY,
          'Authorization': 'Bearer ' + SUPA_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ password_hash: pwHash })
      });
      if (!r.ok) { var et = await r.text(); throw new Error(et || 'Update failed (HTTP ' + r.status + ')'); }

      st.style.color = '#27c93f';
      st.textContent = '✓ Password updated successfully. User must use new password next login.';
      btn.style.display = 'none';
      setTimeout(function(){ conf.remove(); }, 2000);
    } catch(e) {
      st.style.color = '#e88f8f'; st.textContent = '✗ Error: ' + (e.message || 'Failed.');
      btn.textContent = '🔑 SET PASSWORD'; btn.disabled = false;
    }
  });
}

// ════════════════════════════════════════
// updateProfileIcon — show auth state
// ════════════════════════════════════════
function updateProfileIcon() {
  var btn = document.getElementById('profile-nav-btn');
  if (!btn) return;
  if (SUPA_USER && USER_PROFILE.name) {
    btn.textContent = USER_PROFILE.avatar || '⚡';
    btn.title = USER_PROFILE.name + ' · click for profile';
    btn.style.background = 'rgba(201,168,76,.15)';
    btn.style.borderColor = 'rgba(201,168,76,.45)';
    btn.style.color = 'inherit';
  } else {
    btn.textContent = '🔐';
    btn.title = 'Sign in · click to login';
    btn.style.background = 'rgba(97,218,251,.06)';
    btn.style.borderColor = 'rgba(97,218,251,.25)';
    btn.style.color = '#61dafb';
  }
}

// ════════════════════════════════════════
// WINDOW LOAD — full init sequence
// ════════════════════════════════════════
window.addEventListener('load', async function() {
  rebuildSnakeQs();

  // Initialize animated counters
  setTimeout(function() {
    ['cm', 'sp-cm'].forEach(function(id){ var el = document.getElementById(id); if (el) cnt(el, typeof CHAPTERS !== 'undefined' ? CHAPTERS.length : 10, 1500); });
    ['cp2', 'sp-cp2'].forEach(function(id){ var el = document.getElementById(id); if (el) cnt(el, typeof PUZZLES !== 'undefined' ? PUZZLES.length : 12, 1500); });
    ['cq', 'sp-cq'].forEach(function(id){ var el = document.getElementById(id); if (el) cnt(el, typeof SNAKE_QS_ALL !== 'undefined' ? SNAKE_QS_ALL.length : 60, 1500); });
  }, 300);
  // Theme
  var savedTheme = localStorage.getItem('learno-theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light');
    var chk = document.getElementById('theme-chk');
    if (chk) chk.checked = true;
    applyLightModeInlineOverrides(true);
  }

  // Local state
  loadBadgeState();
  loadShopState();
  _lastLv = ST.lv;
  var hasLocalProfile = initProfile();
  updateProfileIcon();

  // Try restore cloud session
  var restored = await dbRestoreSession();
  if (restored) {
    console.log('[Init] Session restored — loading cloud profile');
    var loaded = await dbLoadProfile();
    updateProfileIcon();
    if (!loaded && !hasLocalProfile) {
      setTimeout(showProfileSetup, 400);
    }
  } else {
    console.log('[Init] No session — clearing local data and showing auth modal');
    // Clear any stale local data so nothing shows until logged in
    ST.xp=0; ST.lv=1; _lastLv=1;
    ST.ach.forEach(function(a){ a.ul=false; });
    USER_PROFILE={name:'',level:0,avatar:'⚡',joined:''};
    USER_LEVEL=0;
    updXP();
    updateProfileIcon();
    setTimeout(function() { showAuthModal('signup'); }, 500);
  }
});

