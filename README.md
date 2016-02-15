# Pomodoro
The "Pomodoro" technique is based on the following <a href="http://lifehacker.com/productivity-101-a-primer-to-the-pomodoro-technique-1598992730" target="top">article</a>. 

## Table of Contents

- [Technologies Used](#technologies)
- [Deployment](#deployment)
- [Tests](#tests)

## Technologies
### Front-end

The front-end is built with AngularJS and SCSS (compiled with gulp). Most of the design elements were created using the Angular UI Bootstrap package, and the timer is built with <a href="http://siddii.github.io/angular-timer/" target="top">angular-timer</a>. All of the data and the timer are organized into one page, and the user can organize individual tasks into separate inboxes.

### Back-end

The back-end is built with Node.js and MongoDB. Given the limitations of time for this short-term project, I chose to use technologies that are most familiar to me, but I would've considered using a simple RDBMS-type database like SQLite, given the relationship between the "Inbox", "Task", and "User" models.

## Deployment

### Live!

Open the application <a href="https://angular-pomodoro.herokuapp.com/" target="top">here</a>.

## Tests

Tests are written for Mocha.js. To run the test suite, run the following commands:

```bash
npm install
```

then:
```bash
gulp testServerJS
```
<br>
<hr>

I hope you enjoy using the application - if you have any questions, pleaset feel free to ask me!
