const url = require('url');

const dbHandlers = require('./db/dbQueryHandler');
const userHandlers = require('./db/userHandlers');
const checkAuth = require('./utils').checkAuth;

module.exports = (app) => {
  app.get('/regex/challenges', (req, res) => {
  // Review if async issues become a problem!
  const user = req.user;
    dbHandlers.getChallenges((challenges) => {
      const payload = {
        challenges
      };
      if (user) {
        payload.user_completed = user.completed_challenges;
      } else {
        payload.user_completed = null;
      }
      res.send(payload);
    });
  });
  app.get('/regex/tutorial', (req, res) => {
    dbHandlers.getTutorial((tutorial) => {
      res.send(tutorial);
    });
  });
  app.post('/regex/challenges/new-challenge', (req, res) => {
    dbHandlers.postChallenge(req.body, () => {
      res.end('challenge created');
    });
  });
  app.post('/regex/challenges/completed-challenge?', (req, res) => {
    const userId = url.parse(req.url).query;
    userHandlers.postCompletedChallenge(req.body.challengeId, userId, (updatedUser) => {
      res.end('challenge created');
    });
  });
  app.post('/regex/challenges/new-answer?', (req, res) => {
    const query = url.parse(req.url).query;
    dbHandlers.postChallengeAnswer(req.body, query, (updatedChallenge) => {
      res.end('Successftully updated answer!');
    });
  });
  // TODO: Save more.
  app.get('/regex/challenges/user-completed?', (req, res) => {
    const userId = url.parse(req.url).query;
    userHandlers.findUserRelatedChallenges(userId, 'completed_challenges', (completedChallenges) => {
      res.send(completedChallenges)
    })
  });
  app.get('/regex/user-info/authored-challenges?', (req, res) => {
    const userId = url.parse(req.url).query;
    userHandlers.findUserRelatedChallenges(userId, 'authored_challenges', (authoredChallenges) => {
      res.send(authoredChallenges);
    });
  });
  app.get('/regex/user-info', (req, res) => {
    if (req.user) {
      console.log('requested user info is ', req.user._id);
      res.send(req.user);
    } else {
      res.send('Not logged in!')
    }
  });
  app.get('/regex/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) throw err;
      res.redirect('/');
    });
  })
};
