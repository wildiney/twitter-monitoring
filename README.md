# Twitter Stream

Monitoring terms on twitter in real time.

## Installation

Rename src/config/researchTerms.template.ts to src/config/researchTerms.ts and edit with your terms

Rename src/config/excludedTerms.template.ts to src/config/excludedTerms.ts and edit with your terms. This terms are not mandatory. This file is used because there are a limit of excluded terms that you can inform in the Twitter API, so this file works like a second filter.

Rename .env.template to .env edit to fill Twitter Tokens and the port to run the application.

Run

```shell
npm install
```

and to test or publish with:

```shell
npm run build
```
