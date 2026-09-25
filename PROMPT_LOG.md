# AI Prompt Log

## Overview

I used ChatGPT for setup guidance, explanations, implementation help, debugging, and documentation. I set up and ran the project locally, integrated suggestions, requested revisions, and tested behavior in Postman and the browser.

AI assistance included backend code examples and generated frontend components and styling. These are selected prompts from two development conversations, edited for grammar and readability while preserving their intent. The retrospective styling entry is labeled separately.

## Backend Setup and Routing

### 1. Backend setup commands

**Prompt:**  
“I installed Express and CORS already. What commands do I need to set up TypeScript and tsx for my backend, including the types and tsconfig? Provide the commands and a brief explanation, without application code.”

**Purpose and outcome:**  
Established the TypeScript development environment while keeping the initial request focused on configuration.

### 2. Starting the server

**Prompt:**  
“Do I use a command such as npm run or npm start to run the backend?”

**Purpose and outcome:**  
Clarified how package.json scripts start the application. Configured the development command around the backend entry file.

### 3. Organizing routes

**Prompt:**  
“Should I create a routes folder inside src, import the Express Router, and define the GET request there?”

**Purpose and outcome:**  
Separated the stock endpoint from the server setup and connected it under `/api/stocks`.

### 4. Reviewing the initial route

**Prompt:**  
“How does this route implementation look so far?”

**Context:**  
Provided a screenshot of the initial stock route.

**Purpose and outcome:**  
Reviewed the route structure before connecting Yahoo Finance. Corrected the route parameter syntax and completed the router export.

### 5. Understanding route parameters

**Prompt:**  
“Why do we use `symbol: req.params.symbol`, and what does it do?”

**Purpose and outcome:**  
Clarified the difference between reading a symbol from the URL and returning it as a JSON field.

### 6. Confirming route registration

**Prompt:**  
“Does `app.use("/api/stocks", stockRoutes)` send requests under that path to the router in stockRoutes.ts, where the matching GET handler sends the response?”

**Purpose and outcome:**  
Checked my understanding of how the server entry file and router work together before continuing.

## External API and Data Processing

### 7. Calling Yahoo Finance

**Prompt:**  
“I tested the Yahoo API in Postman and it works. How do I call it from my Express route using the symbol from req.params? Keep the explanation brief so I can implement it myself.”

**Purpose and outcome:**  
Connected the external request to the backend using the symbol supplied by the client.

### 8. Reviewing the fetch implementation

**Prompt:**  
“I followed the suggested approach, but I’m not sure whether I implemented everything correctly. Can you review it?”

**Context:**  
Provided the route code containing the external request.

**Purpose and outcome:**  
Corrected the symbol’s position in the URL, removed the earlier echo response, and called `response.json()` correctly.

### 9. Understanding URL encoding

**Prompt:**  
“Is encodeURIComponent a built-in function? I haven’t defined anything with that name.”

**Purpose and outcome:**  
Clarified why a symbol should be encoded before being inserted into the request URL.

### 10. Identifying the required data

**Prompt:**  
“Here is the Yahoo response from my backend. Which fields do I need to group the data by day and calculate the average low, average high, and total volume? Explain how the arrays connect, without code yet.”

**Purpose and outcome:**  
Identified the timestamp, low, high, and volume arrays and learned how matching indexes describe the same interval.

### 11. Confirming the implementation flow

**Prompt:**  
“Would the next step be to extract these values, update the GET request to return them as JSON, and then build a frontend where users can enter a symbol and view the results?”

**Purpose and outcome:**  
Confirmed the overall flow. The response needed daily aggregation before being displayed in the frontend.

### 12. Grouping timestamps by date

**Prompt:**  
“Let’s work through two steps at a time. How do I extract the four arrays, convert each timestamp to a date, and collect entries with the same date?”

**Purpose and outcome:**  
Used explanations and code examples to group entries with a Map, using the exchange’s timezone for the date.

### 13. Reviewing backend readiness

**Prompt:**  
“The output is now more compact and straightforward. What remains before the backend is ready?”

**Purpose and outcome:**  
Moved from the successful response path to error handling, timeout behavior, and checks for missing data.

## Error Handling and Integration

### 14. Investigating a null result

**Prompt:**  
“Why does adding the question mark fix this error?”

**Context:**  
The previous request failed with `Cannot read properties of null (reading '0')`. Optional chaining and a guard had resolved that failure.

**Purpose and outcome:**  
Understood why optional chaining prevents unsafe access and why a separate guard is still needed to send an error response.

### 15. Locating CORS configuration

**Prompt:**  
“What does ‘before mounting the routes’ mean, and where exactly should I put that code?”

**Purpose and outcome:**  
Placed CORS configuration before the stock router so browser requests could receive the required headers.

## Frontend Structure and Styling

### 16. Choosing a frontend structure

**Prompt:**  
“What is an effective way to structure the frontend files for this application?”

**Purpose and outcome:**  
Organized the frontend into search and table components, an API request module, a shared type, and application-level state.

### 17. Color scheme

**Retrospective prompt summary — not a verbatim development prompt:**  
“Create a color scheme for both App.css and index.css that has a light gray-blue background, white cards, dark navy text, bright blue buttons and highlights, and pale red error messages.”

**Outcome:**  
The implemented styling uses this palette, with subtle borders and muted blue-gray secondary text.

## Review and Verification

### 18. Understanding frontend error types

**Prompt:**  
“What is the difference between TypeError and Error here?”

**Context:**  
Provided the API request function and catch block after an invalid symbol displayed a generic error.

**Purpose and outcome:**  
AI identified a repeated TypeError check. Changed the second check to Error and confirmed that the backend’s “Stock symbol not found” message reached the page.

### 19. Applying backend review changes

**Prompt:**  
“Please specify exactly which section of the code I should replace.”

**Context:**  
A review identified that the upstream error block calculated a status and message but never sent a response.

**Purpose and outcome:**  
Added the missing error response and early return, along with checks for the timestamp and quote arrays before processing them.

## Comments

### 20. Reviewing comment placement

**Prompt:**  
“Review the comments in my backend index.ts and help me keep the wording consistent with my existing style.”

**Purpose and outcome:**  
Used brief comments to identify application setup, frontend access, route registration, and server startup.

### 21. Understanding professional commenting practices

**Prompt:**  
“Is this amount of commenting typical in a professional environment? I personally might add more comments.”

**Purpose and outcome:**  
Discussed when comments add useful context and when they repeat clear code. Used that guidance when reviewing frontend comments.

## Checks Performed

- Tested the initial endpoint and Yahoo integration in Postman.
- Inspected grouped data and the final daily response.
- Displayed TSLA and AAPL results in the browser.
- Checked invalid-symbol behavior and the displayed error message.
- Observed and investigated a frontend connection error.
- Ran the frontend build command.

These checks covered integration and visible behavior. Automated tests for numerical aggregation and timezone boundaries remain a future improvement.

## Key Decisions and Revisions

- Kept stock routes separate from server setup.
- Requested an explanation of the API arrays before implementation.
- Used exchange-local dates for daily grouping.
- Adopted separate components for search and results.
- Revised generated code to match my arrow-function and export conventions.
- Used actual error output and screenshots to guide debugging.
- Documented missing-data behavior and known limitations.