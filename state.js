export const defaultTerms = ['GTA 6 gaming time during November', 'Real life, plans, and communication come first'];
export const conditionOptions = [
  'Agree on specific gaming times',
  'Our plans and dates come first',
  'Chores and responsibilities stay on track',
  'Pause the game whenever you need me',
  'No suspicious visits to the “shoe store” 😇',
  'In-game chaos stays fictional and does not become real-life chaos',
  'No spending real money on game extras without discussing it first',
  'No ignoring me because of a mission, race, or “five more minutes”'
];
export function createState() {
  return { screen: 'knowledge', history: [], conditions: [], signature: '', terms: [], image: null };
}
export function navigate(state, screen) {
  state.history.push(state.screen);
  state.screen = screen;
}
export function back(state) {
  if (state.history.length) state.screen = state.history.pop();
}
export function agreedTerms(conditions) {
  return conditions.length ? [...conditions] : ['We will talk about the ground rules together'];
}
