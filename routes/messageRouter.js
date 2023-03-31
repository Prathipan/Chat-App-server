const Message = require("../model/messageModal");
const User = require("../model/userModal");
const Chat = require("../model/chatModal")
const { verifyToken } = require("./verifyToken");

const router = require("express").Router();

router.get("/all-messages/:chatId", verifyToken, async (req, res) => {
  try {
    const message = await Message.find({ chat: req.params.chatId })
      .populate("sender", "userName pic email")
      .populate("chat");
    res.json(message);
  } catch (error) {
    res.sendStatus(400);
    throw new Error(error.message);
  }
});

router.post("/send-message", verifyToken, async (req, res) => {
    const {content,chatId} = req.body;

    if(!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }
    var newMessage = {
        sender : req.user._id,
        content : content,
        chat : chatId
    }

    try {
        var message = await Message.create(newMessage);

        message = await message.populate("sender","name pic");
        message = await message.populate("chat");
        message = await User.populate(message , {
            path : "chat.users",
            select : "userName pic email"
        });
        await Chat.findByIdAndUpdate(req.body.chatId, {latestMessage : message});
        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

module.exports = router;
