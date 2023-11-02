const express = require('express')
const connectDatabase = require('../config/connectDatabase')
const { ObjectId } = require('mongodb')
const router = express.Router()


const run = async () => {
   const db = await connectDatabase()
   const conversationsCollection = db.collection('coversations')

   router.post("/send_message", async (req, res) => {
      try {
         const sender = req.body.sender
         const receiver = req.body.receiver
         const text = req.body.text
         const date = new Date()
         const timestamp = date.toISOString();
         const prepairMessage = {
                  participants: [sender, receiver],
                  isMessageSeen: false,
            messages: [
               {
                  _id: new ObjectId(),
                  sender,
                  receiver,
                  text,
                  timestamp
               }
            ]
         }
         const newMessage = {
            _id: new ObjectId(),
            sender,
            receiver,
            text,
            timestamp
         }

         const alreadyConversationExist = await conversationsCollection.findOne({
            participants: { $all: [sender, receiver] }
         })

         if (alreadyConversationExist?._id) {
            const newMessages = await conversationsCollection.updateOne({ _id: alreadyConversationExist._id }, { $push: { messages: newMessage } }, { upsert: true })
               if(newMessages.acknowledged){
                  res.send(newMessage)
               }               
         }
         else {
            const result = await conversationsCollection.insertOne(prepairMessage)
            res.send(result)
         }



      } catch (err) {
         console.log(err)
      }
   })

   router.get("/messages", async (req, res) => {
      try {
         const {sender} = req.query
         const allConversations = await conversationsCollection.find({
            participants: { $all: [sender] }
         }).toArray()
         res.send(allConversations)
      }
      catch (err) {
         console.log(err)
      }

   })
   router.get("/user_messages_list", async (req, res) => {
      try {
         const {sender} = req.query
         const allConversations = await conversationsCollection.find({
            participants: { $all: [sender] }
         }).toArray()

         console.log(allConversations);
         

         res.send(allConversations)
      }
      catch (err) {
         console.log(err)
      }

   })

   router.patch("/messages/seen_messages", async (req, res) => {
try{
   const {id, seenUnseenStatus} = req.body
   console.log(id,seenUnseenStatus)
   const query = {_id: new ObjectId(id)}
   let updateSeenStatus;
   if(seenUnseenStatus == "seen"){
      // console.log("inside if")
      updateSeenStatus = {
      $set: {
         isMessageSeen: true,
      },
   }
   }
   else if(seenUnseenStatus == "unseen"){
      // console.log("inside else")
      updateSeenStatus = {
         $set: {
            isMessageSeen: false,
         },
      }
   }
   // console.log(updateSeenStatus)

   const result = await conversationsCollection.updateOne(query, updateSeenStatus)
   res.status(200).send(result)
}
catch(err){
   res.status(500).send({err: "Internal server error"})
}
   })

   router.get('/single_conversation', async (req, res) => {
    try{
      const {sender, receiver} = req.query || {}
      const singleCoversationData = await conversationsCollection.findOne({
         participants: { $all: [sender, receiver] }
      })
      if(singleCoversationData){
         res.send(singleCoversationData)
      }
      else{
         res.send({
            participants: ["", ""],
      messages: [
         {
            _id: '',
            sender: "",
            receiver:"",
            text:"",
            timestamp:""
         }
      ]
   })
      }
    }
    catch(err){
      console.log(err)
    }
   })



}

run()
module.exports = router