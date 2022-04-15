import { StreamChat } from "stream-chat"
import { Chat, Channel, ChannelHeader, ChannelList, MessageInput, Window, Thread, MessageList } from "stream-chat-react"

/**
 * Refer tot he file below for the custom picker
 * implementation and the custom emoji rendering.
 * the rendering is necessary so that the custom emoji are properly replaced in the messages.
 */
import { CustomEmojiPicker, customEmojiRenderText } from "./CustomEmoji"

import "@stream-io/stream-chat-css/dist/css/index.css"
import "./styles.css"

const API_KEY = "t442dfkucxcj"

// Setup two users, so that we can simulate send/receive messages using two urls:.
// https://m3j4h.csb.app/
// https://m3j4h.csb.app/?alt
const USER_ID1 = "ricky"
const USER_TOKEN1 =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoicmlja3kifQ.I1ekamSR9TGO3TIi-I07zg8noKmr_AnFLbBR9auM7Fc"
const USER_ID2 = "julian"
const USER_TOKEN2 =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoianVsaWFuIn0.Tb2rdur-P3HOh1-hiug4R0Nk_8LGZZ8zkCXNOfAnE94"

const chatClient = StreamChat.getInstance(API_KEY)

const alt = window.location.search === "?alt"
const userId = alt ? USER_ID2 : USER_ID1
const userToken = alt ? USER_TOKEN2 : USER_TOKEN1

document.title = `${userId} - Stream test`

chatClient.connectUser(
  {
    id: userId,
    name: userId,
    image: `https://getstream.io/random_png/?id=${userId}&name=${userId}`,
  },
  userToken
)

const channel = chatClient.channel("messaging", "hallway", { members: [USER_ID1, USER_ID2] })
channel.watch()

const App = () => (
  <Chat client={chatClient}>
    <ChannelList />
    <Channel EmojiPicker={CustomEmojiPicker}>
      <Window>
        <ChannelHeader />
        <MessageList renderText={customEmojiRenderText} />
        <MessageInput />
      </Window>
      <Thread />
    </Channel>
  </Chat>
)

export default App
