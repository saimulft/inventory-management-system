const express = require("express");
const connectDatabase = require("../config/connectDatabase");
const { ObjectId } = require("mongodb");
const router = express.Router();

const run = async () => {
  const db = await connectDatabase();
  const all_users_collection = db.collection("all_users");
  const conversationsCollection = db.collection("coversations");

  // get all all users
  router.get("/add_users_list", async (req, res) => {
    try {
      const loginUser = req?.query?.user || {};

      const allConversations = await conversationsCollection
        .find({
          participants: { $all: [loginUser] },
        })
        .toArray();

      let alreadyExistUserEmail = [loginUser];
      allConversations?.filter((u) => {
        const existEmail = u.participants.find((e) => e != loginUser);
        alreadyExistUserEmail.push(existEmail);
      });

      const alreadyConversationExistJoin = alreadyExistUserEmail.join("");

      const result = await all_users_collection.find({}).toArray();
      const newResult = result.filter(
        (e) => !alreadyConversationExistJoin.includes(e.email)
      );

      if (result.length) {
        res.status(200).json(newResult);
      } else {
        res
          .status(500)
          .json({ message: "Failed to get conversation users list" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });


  router.post("/send_message", async (req, res) => {
    try {
      const request = req || {};
      const sender = request.body.sender;
      const receiver = request.body.receiver;
      const text = request.body.text;
      const timestamp = request.body.timestamp;
      const full_name = request.body.full_name;


      const seenMassageStatus = (sender, receiver) => {
        const emailToUsername = (email) => email.split('@')[0]
      
        const userVale = {
          [emailToUsername(sender)]: true,
          [emailToUsername(receiver)]: false,
        };
      
        return userVale;
      };

 
      const prepareMessage = {
        participants: [sender, receiver],
        full_name,
        isMessageSeen: seenMassageStatus(sender, receiver),
        messages: [
          {
            _id: new ObjectId(),
            sender,
            receiver,
            text,
            timestamp,
          },
        ],
      };
      const newMessage = {
        _id: new ObjectId(),
        sender,
        receiver,
        text,
        timestamp,
      };

      const alreadyConversationExist = await conversationsCollection.findOne({
        participants: { $all: [sender, receiver] },
      });

      if (alreadyConversationExist?._id) {
        const newMessages = await conversationsCollection.updateOne(
          { _id: alreadyConversationExist._id },
          { $push: { messages: newMessage } },
          { upsert: true }
        );
        if (newMessages.acknowledged) {
          res.send(newMessage);
        }
      } else {
        const result = await conversationsCollection.insertOne(prepareMessage, {
          upsert: true,
        });
        res.send(result);
      }
    } catch (err) {
      console.log(err);
    }
  });

  router.get("/messages", async (req, res) => {
    try {
      const { sender } = req.query;
      const allConversations = await conversationsCollection
        .find({
          participants: { $all: [sender] },
        })
        .toArray();
      res.send(allConversations);
    } catch (err) {
      console.log(err);
    }
  });
  router.get("/user_messages_list", async (req, res) => {
    try {
      const { sender } = req.query;

      if (!sender) {
        const conversationDemo = {
          _id: "demo",
          full_name: "demo",
          isMessageSeen: "demo",
          participants: "demo",
          lastMassages: {
            _id: "demo",
            sender: "demo",
            receiver: "demo",
            text: "demo",
            timestamp: "demo",
          },
        };
        res.status(200).send([conversationDemo]);
      }

      const allConversations = await conversationsCollection
        .find({
          participants: { $all: [sender] },
        })
        .toArray();

      const messagesList = allConversations.map((con) => {
        const conversation = {
          _id: con?._id,
          full_name: con?.full_name,
          isMessageSeen: con?.isMessageSeen,
          participants: con?.participants,
          lastMassages: {
            ...con?.messages[con?.messages.length - 1],
          },
        };
        return conversation;
      });

      res.send(messagesList);
    } catch (err) {
      console.log(err);
    }
  });

  router.patch("/messages/seen_messages", async (req, res) => {
    try {
      const { id, seenUnseenStatus } = req.body;
      const query = { _id: new ObjectId(id) };
      let updateSeenStatus;
      if (seenUnseenStatus == "seen") {
        updateSeenStatus = {
          $set: {
            isMessageSeen: true,
          },
        };
      } else if (seenUnseenStatus == "unseen") {
        updateSeenStatus = {
          $set: {
            isMessageSeen: false,
          },
        };
      }

      const result = await conversationsCollection.updateOne(
        query,
        updateSeenStatus
      );
      res.status(200).send(result);
    } catch (err) {
      res.status(500).send({ err: "Internal server error" });
    }
  });

  router.get("/single_conversation", async (req, res) => {
    try {
      const { sender, receiver, page_no } = req.query || {};

      const singleConversationsData = await conversationsCollection.findOne({
        participants: { $all: [sender, receiver] },
      });

      if (singleConversationsData) {
        const totalMessageLength = singleConversationsData.messages.length;
        let start;
        let end;
        let startFilter;

        const sentMsgGroupCount = 15;
        if (page_no) {
          const prepareCount = (page_no - 1) * sentMsgGroupCount;

          end =
            totalMessageLength - prepareCount <= 0
              ? 0
              : totalMessageLength - prepareCount;
          start =
            totalMessageLength - prepareCount - sentMsgGroupCount <= 0
              ? 0
              : totalMessageLength - prepareCount - sentMsgGroupCount;

          if (start == 0 && end == 0) {
            res.status(200)
          }

          const chunk = singleConversationsData.messages.slice(start, end);
          const currentMessageIndex = {
            start,
            end,
          };

          console.log(currentMessageIndex, { totalMessageLength, page_no });
          res.status(200).send({message: chunk, isMessageSeen: singleConversationsData?.isMessageSeen});
        } else {
          console.log("page count not found");
          res.status(200).send({});
        }
      } else {
        console.log("user not found");
        const demoData = [
          {
            _id: "demo",
            sender: "demo",
            receiver: "demo",
            text: "demo",
            timestamp: "demo",
          },
        ];
        res.status(200).send(demoData);
      }
    } catch (err) {
      res.status(500).send({ error: "server error" });
      console.log(err);
    }
  });
};

run();
module.exports = router;
