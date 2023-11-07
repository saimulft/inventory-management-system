const express = require("express");
const connectDatabase = require("../config/connectDatabase");
const { ObjectId } = require("mongodb");
const router = express.Router();

const run = async () => {
  const db = await connectDatabase();
  const conversationsCollection = db.collection("coversations");

  router.post("/send_message", async (req, res) => {
    try {
      const request = req || {};
      const sender = request.body.sender;
      const receiver = request.body.receiver;
      const text = request.body.text;
      const timestamp = request.body.timestamp;
      const full_name = request.body.full_name;
      const prepairMessage = {
        participants: [sender, receiver],
        full_name,
        isMessageSeen: false,
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
        const result = await conversationsCollection.insertOne(prepairMessage,{ upsert: true });
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

        const sentMsgGroupCount = 15;
        if (page_no) {
          const prepareCount = (page_no - 1) * sentMsgGroupCount;

          end = totalMessageLength - prepareCount;
          start = totalMessageLength - prepareCount - sentMsgGroupCount;

          const chunk = singleConversationsData.messages.slice(start, end);
          const currentMessageIndex = {
            start,
            end,
          };

          const messagesChunk = {
            ...singleConversationsData,
            messages: [...chunk],
            totalMessageLength,
            currentMessageIndex,
          };
          console.log("sent 5555", chunk?.length );
          res.send(chunk);
        }
        else{
          console.log("page count not found");
          res.status(200).send({})
        }
      }else{
        console.log("user not found");
        res.status(200).send({})
        
      }
    } catch (err) {
      res.status(500).send({ error: "server error"})
      console.log(err);
    }
  });
};

run();
module.exports = router;
