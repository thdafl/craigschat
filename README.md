
https://craigschat-230e6.firebaseapp.com/

# Set up

1. `git clone https://github.com/ychino/craigschat.git`
2. Login `https://craigschat-230e6.firebaseapp.com/`
3. Say Hi (👋) in the Dev Room `https://craigschat-230e6.firebaseapp.com/chatroom/-LTjkAhH4vn9ejXzBvYX` to meet the team
4. Create your Firebase project and create a Realtime database (Reference: https://css-tricks.com/intro-firebase-react/). If you have any trouble with setting it up, please ask any questions in the Dev Room in the app.
5. Copy Config info and the create a file `in src/config` and name it `config.js`. Paste the config info in the file as follows:
```
export const firebaseConfig = {
    apiKey: "<API_KEY>",
    authDomain: "<PROJECT_ID>.firebaseapp.com",
    databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
    projectId: "<PROJECT_ID>",
    storageBucket: "<BUCKET>.appspot.com",
    messagingSenderId: "<SENDER_ID>",
  };
```   
6. `npm run install`
7. `npm run start`
8. You are ready!

# How to contribute
1. Go to issues and grab what would like to work on
2. Checkout a branch in your local machine naming it feature/IssueID ShortDiscription (for example `feature/#3-Add-Avatar-in-chatroom-card`)
3. Once it's done, please push it to the remote `git push origin feature/#3-Add-Avatar-in-chatroom-card`
4. Create a pull request to `dev` branch
5. Again, if you have any questions, please ask in the Dev Room `https://craigschat-230e6.firebaseapp.com/chatroom/-LTjkAhH4vn9ejXzBvYX`
