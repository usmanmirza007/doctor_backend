const {
  profileDal,
} = require('../dal/index');
const { Forbidden } = require('../helpers/errors');
const { generateChatKey } = require('../helpers/utils');
const { Chat } = require('../models/Chat');

const sendMessage = async (data) => {

  const { senderId, receiverId, messageData, messageType, messageId } = data;
  
  if (!senderId || !receiverId) {
    // return res.status(400).json({ error: 'Both user IDs are required' });
    throw new Forbidden('User id is requird')
  }


  const chatKey = generateChatKey(senderId, receiverId);

  try {
    let chat = await Chat.findOne({ chatKey });

    const newMessage = {
      messageId: messageId,
      senderId: senderId,
      receiverId: receiverId,
      message: messageType === 'TEXT' ? messageData : messageData.uri,
      messageType: messageType,
      ...(messageType === 'IMAGE' || messageType === 'DOCUMENT' ? { file: messageData } : {})
    };

    if (!chat) {
      chat = new Chat({
        chatKey,
        users: [senderId, receiverId],
        messages: [newMessage]
      });
      await chat.save();
    } else {
      chat.messages.push(newMessage);
      await chat.save();
    }
    return chat
    // res.status(200).json({ chat });
  } catch (error) {
    console.log('err messafe', error);

    // res.status(500).json({ error: 'Error creating chat' });
  }
};


const getUserChat = async (data) => {

  const { senderId, receiveId, } = data;

  if (!senderId || !receiveId) {
    throw new Forbidden('Both user IDs are required')
  }
  const chatKey = generateChatKey(senderId, receiveId);

  try {
    // Fetch the chat with the unique chatKey
    const chat = await Chat.find({ chatKey })
      .populate('users', 'username')  // Optionally, populate user data (e.g., username)

    if (!chat) {
      return 'Chat not found'
    }

    // Return the chat with messages
    // res.status(200).json({ chat });
    return chat
  } catch (error) {
    console.log('err', error);

    // res.status(500).json({ error: 'Error fetching chat' });
  }
};

const getChatList = async (data, res) => {

  const { userId } = data;

  if (!userId) {
    throw new Forbidden('UserId is required')
  }

  try {
    const chats = await Chat.find({
      users: userId
    }).populate('users', 'username')


    const chatList = chats?.map((item) => {
      return {
        _id: item?._id,
        chatKey: item?.chatKey,
        users: item?.users,
        lastMessage: item.messages[item.messages.length - 1]
      }
    })

    if (!chatList.length) {
      return 'No chats found for the user'
      // return res.status(404).json({ message: 'No chats found for the user' });

    }
    return chatList
  } catch (error) {
    console.log('err', error);

    // res.status(500).json({ error: 'Error fetching chat' });
  }
};



// Module pattern to create a singleton instance of the service functions
const ChatService = (() => {
  return {
    sendMessage: sendMessage,
    getUserChat: getUserChat,
    getChatList: getChatList
  };
})();

module.exports = {
  chatService: ChatService,
};
