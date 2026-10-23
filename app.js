import { createState, navigate, back, agreedTerms, defaultTerms, conditionOptions } from './state.js';
import { createAgreement } from './agreement.js';

const app = document.getElementById('app');
let state = createState();
const screens = {
  knowledge: { step: 1, title: 'Do you know what GTA 6 is?', sub: 'Quick knowledge check before the very important part.', choices: [
    ['Yes, I know it', 'Proceed to the official presentation.', 'proposal'],
    ['Not really', 'I would like a tiny explanation, please.', 'explanation']
  ] },
  explanation: { step: 2, title: 'GTA 6 is…', sub: 'A highly anticipated open-world video game where you explore a fictional version of Vice City, follow a story, drive around, and cause fictional chaos. It is played on a screen, not in real life.', choices: [
    ['Okay, got it', 'Continue to the next question.', 'proposal']
  ] },
  proposal: { step: 3, title: 'Would you be open to hearing my November proposal?', sub: 'No pressure. This is a conversation, not a legally binding contract.', choices: [
    ['Sure, tell me', 'I am curious.', 'permission'],
    ['Not right now', 'Let us talk about it another time.', 'declined']
  ] },
  permission: { step: 4, title: 'May I play GTA 6 during the month of November?', sub: 'I am asking for dedicated game time while still being a loving, present, and responsible boyfriend.', choices: [
    ['Yes, I support the mission', 'Permission granted with good vibes.', 'contract'],
    ['Yes, with some conditions', 'Let us agree on the ground rules together.', 'conditions'],
    ['I would rather not', 'That is okay — your answer matters.', 'declined']
  ] }
};

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function button(label, action, className = 'restart') {
  const node = element('button', className, label);
  node.type = 'button'; node.addEventListener('click', action);
  return node;
}
function go(screen) { navigate(state, screen); render(); }
function restart() { state = createState(); render(); }
function title(text, sub) {
  const heading = element('h2', '', text);
  heading.tabIndex = -1;
  app.append(heading);
  if (sub) app.append(element('p', 'sub', sub));
}
function progress(step) {
  app.append(element('div', 'question-number', `Step ${step} of 4`));
  const bar = element('div', 'progress'); bar.setAttribute('aria-hidden', 'true');
  for (let i = 1; i <= 4; i++) bar.append(element('span', `dot ${i <= step ? 'active' : ''}`));
  app.append(bar);
}
function renderQuestion(screen) {
  progress(screen.step); title(screen.title, screen.sub);
  const choices = element('div', 'choices');
  for (const [label, description, destination] of screen.choices) {
    const choice = button('', () => {
      if (destination === 'contract') state.terms = [...defaultTerms];
      go(destination);
    }, `choice ${destination === 'declined' ? 'no' : 'soft'}`);
    choice.append(element('strong', '', label), element('small', '', description));
    choices.append(choice);
  }
  app.append(choices);
}
function renderConditions() {
  title('What conditions would you like?', 'Pick any that feel important. We can always talk about them together.');
  const list = element('div', 'condition-list');
  conditionOptions.forEach(term => {
    const label = element('label', 'condition');
    const input = document.createElement('input'); input.type = 'checkbox'; input.checked = state.conditions.includes(term);
    input.addEventListener('change', () => {
      state.conditions = input.checked ? [...state.conditions, term] : state.conditions.filter(item => item !== term);
    });
    label.append(input, element('span', '', term)); list.append(label);
  });
  app.append(list, button('Save these conditions', () => { state.terms = agreedTerms(state.conditions); go('contract'); }));
}
function renderContract() {
  title('Sign the contract', 'These are the terms you chose. Type your name below, then create and download the agreement as a PNG image.');
  const list = element('ul', 'contract-list');
  state.terms.forEach(term => list.append(element('li', '', term)));
  const box = element('div', 'signature-box');
  const label = element('label', '', 'Your signature (up to 120 characters)'); label.htmlFor = 'signature';
  const input = document.createElement('input'); input.id = 'signature'; input.type = 'text'; input.maxLength = 120;
  input.autocomplete = 'name'; input.placeholder = 'Type your name here'; input.value = state.signature;
  const error = element('p', 'sub'); error.setAttribute('role', 'alert');
  const create = button('Create signed picture', () => {
    try {
      state.image = createAgreement(state.terms, state.signature.trim());
      go('image');
    } catch (err) { error.textContent = `Could not create the image. ${err.message} Please try again.`; }
  }, 'download');
  create.disabled = !state.signature.trim();
  input.addEventListener('input', () => { state.signature = input.value; create.disabled = !input.value.trim(); });
  box.append(label, input); app.append(list, box, create, error);
}
function renderImage() {
  title('Your signed picture', 'Download this PNG image and share it with your partner.');
  const image = element('img', 'contract-image'); image.src = state.image;
  image.alt = `November Agreement signed by ${state.signature.trim()}. Terms: ${state.terms.join('; ')}.`;
  app.append(image, button('Download signed picture', () => {
    const link = document.createElement('a'); link.href = state.image; link.download = 'Signed-November-Agreement.png';
    document.body.append(link); link.click(); link.remove();
  }, 'download'), button('Start over', restart));
}
function render() {
  app.replaceChildren();
  if (screens[state.screen]) renderQuestion(screens[state.screen]);
  else if (state.screen === 'conditions') renderConditions();
  else if (state.screen === 'contract') renderContract();
  else if (state.screen === 'image') renderImage();
  else {
    title('Your answer matters.', 'No problem. We can leave it here or talk another time. No game is more important than us.');
    app.append(button('Start over', restart));
  }
  if (state.history.length) app.append(button('← Go back', () => { back(state); render(); }, 'back'));
  app.querySelector('h2')?.focus({ preventScroll: true });
}
render();
