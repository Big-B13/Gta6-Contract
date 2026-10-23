# Project November

A playful, unofficial GTA VI relationship proposal. A short questionnaire leads to optional ground rules and a downloadable signed PNG agreement. Refusals end the proposal respectfully.

## Run locally

Serve the folder over HTTP (JavaScript modules do not work reliably via `file://`):

```sh
python3 -m http.server 8000 --bind 0.0.0.0
```

Open http://localhost:8000. Alternatively, use `npm start`. Deployment requires only a static host, with all HTML and JavaScript files included. No build step, runtime dependencies, backend, or database is needed.

## Tests

With Node.js 18 or newer:

```sh
npm test
```

Tests cover route history, preserved state, refusal destinations, terms, text wrapping, and export bounds using a mocked Canvas context. They do not replace real-browser testing.

### Browser smoke checklist

- Try both knowledge answers; Back should follow the route you actually took.
- Decline at either proposal question; confirm a respectful end screen appears.
- Approve directly; Back from the contract should return to the permission question.
- Select all conditions; enter a long name, go back, and confirm selections and name remain.
- Confirm empty or whitespace-only names cannot generate an image.
- Generate the image; check that terms, signature, and footer fit; download the PNG.
- Start over; confirm all prior selections and signature are cleared.
- Use keyboard-only navigation and check focus follows headings after transitions.
- Check the layout on mobile and with a screen reader.

## Structure

- `index.html`: page shell and responsive styles.
- `app.js`: accessible DOM rendering and event handlers; user content uses text nodes.
- `state.js`: session state, navigation history, and agreement terms.
- `agreement.js`: measured Canvas layout, wrapping, and PNG generation.
- `tests/app.test.js`: dependency-free Node tests.

## Privacy and limitations

Names, selections, and images remain in browser memory and reset on refresh. Nothing is uploaded by the application. The name is limited to 120 characters; text wraps and image height grows to fit content. The output is a PNG, not a PDF. Signatures are typed names, not verified electronic signatures. This is a humorous agreement, not a legally binding contract. Dates use the viewer's local clock.
