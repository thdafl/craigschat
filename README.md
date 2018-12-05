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
        "chatroom1": {
            "owner": "John"
        },
        "chatroom2": {
            "owner": "Paul"
        }
    },
    "messages": {
        "chatroom1": {
            "message1": {
                "user": "user1",
                "text": "Hello",
                "date": "1234567890"
            }, 
            "message2": {
                "user": "user2",
                "text": "Goodbye",
                "date": "1234567890"
            }
        },
        "chatroom2": {
            "message1": {
                "user": "user1",
                "text": "Hey!",
                "date": "1234567890"
            }, 
            "message2": {
                "user": "user2",
                "text": "Ho!",
                "date": "1234567890"
            }
        }
    }
}