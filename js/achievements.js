// achievements.js
function addAchievement(username, title, description) {
  db.ref('users/' + username + '/achievements').push({
    title,
    description,
    date: new Date().toISOString()
  });
}
