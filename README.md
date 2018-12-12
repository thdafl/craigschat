##### Set up

1. `git clone https://github.com/ychino/craigschat.git`
2. Login `https://craigschat-230e6.firebaseapp.com/`
3. Say Hi in the Dev Room `https://craigschat-230e6.firebaseapp.com/chatroom/-LTUuvj-VA5oxP-kDUYL`. We will add you in our Firebase space.
4. Log in Firebase and get API key etc.
5. Create a file `in src/config` and name it `config.js`. Paste the Firebase account info as follows:
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

##### Database Structure :floppy_disk:

```
{
  "users": {
    "user1": {
      "name": "John"
    },
    "user2": {
      "name": "Paul"
    }
  },
  "chatrooms": {
    "chatroomUid": {
      "id": "chatroomuId"
      "owner": "John",
      "description": "This is a room for John and Yoko",
      "messages": {
        "messageUid": {
          "id": "messageUid"
            "user": "user1",
            "text": "Hello",
            "date": "1234567890"
        }, 
        "messageUid": {
         "id": "messageUid",
            "user": "user2",
            "text": "Goodbye",
            "date": "1234567890"
        }
      },
      "chatroomuId": {
        "id": "chatroomuId",
        "owner": "Paul",
        "description": "This is a room for Everyone",
        "messages": {
          "messageUid": {
            "id": "messageUid"
              "user": "user1",
              "text": "hey",
              "date": "1234567890"
          }, 
          "messageUid": {
            "id": "messageUid",
              "user": "user2",
              "text": "yo",
              "date": "1234567890"
          }
        }
      }
    }
  }
}
```