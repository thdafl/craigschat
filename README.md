### Database Structure :floppy_disk:


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