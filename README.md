# Pomodoro

## Table of Contents

- [Hosting](#hosting)
- [Technologies Used](#technologies)
- [Tests](#tests)

## Hosting

### Live!

Open the application <a href="https://angular-pomodoro.herokuapp.com/" target="top">here</a>.

## Technologies
### Front-end

The front-end is build with AngularJS and SCSS (compiled with gulp). Most of the design elements were created using the Angular UI Bootstrap package, and the timer is built with "angular-timer".

The "Pomodoro" technique is based on the following: <a href="http://lifehacker.com/productivity-101-a-primer-to-the-pomodoro-technique-1598992730">click here</a>. 

### Back-end

The back-end is built with Node.js and MongoDB. Given the limitations of time for this short-term project, I chose to use the most familiar technologies for the back-end, but I would've considered using other RDBMS-type databases such as SQLite, given the relationship between the "Inbox", "Task", and "User".

## Tests

Mosts tests are written Mocha.js-style. To run the test suite, run the following command:

```bash
gulp testServerJS
```

Given more time, I would have moved on to making front-end tests as well.

<br>
<hr>

I hope you enjoy using the application - if you have any questions, pleaset feel free to ask me!