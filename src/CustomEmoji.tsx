import { BaseEmoji, CustomEmoji, NimblePicker } from "emoji-mart"
import { renderText as defaultRenderText, useMessageInputContext } from "stream-chat-react"

import { ComponentProps } from "react"

type CustomEmojiProps = ComponentProps<typeof NimblePicker>

// use this event to close the picker.
const FAKE_MOUSE_EVENT = new MouseEvent("mouse") as any

const customEmoji = [
  {
    id: "octocat",
    name: "Octocat",
    // this is what we will insert in the text field:
    colons: ":octocat:",
    text: "octocat",
    search: "octocat",
    short_names: ["octocat"],
    emoticons: [],
    custom: true,
    imageUrl: "https://github.githubassets.com/images/icons/emoji/octocat.png",
  },
]

function toTokens<T>(string: string, regexp: RegExp, mapTokenTo: (token: string, index: number) => T) {
  const results = []
  let match: RegExpMatchArray | null
  // eslint-disable-next-line no-cond-assign
  while ((match = string.match(regexp))) {
    results.push(string.substr(0, match.index), mapTokenTo(match[0], match.index))
    string = string.substr(match.index! + match[0].length)
  }
  results.push(string)
  return results
}

const customEmojiRenderer = (text: { value: string }) => {
  const customEmojiRegExp = new RegExp(`:(${customEmoji.map((emoji) => emoji.id).join("|")}):`)
  return (
    <>
      {toTokens(text.value, customEmojiRegExp, (token, index) => {
        const emoji = customEmoji.find((emoji) => emoji.colons === token) as CustomEmoji
        return <img src={emoji.imageUrl} alt={emoji.id} key={`emoji-${index}`} />
      })}
    </>
  )
}

export const customEmojiRenderText = (text: string | undefined, mentionedUsers: any) => {
  return defaultRenderText(text, mentionedUsers, {
    customMarkDownRenderers: { text: customEmojiRenderer },
  })
}

const fullCustomEmojiData = {
  compressed: false,
  categories: [
    {
      id: "custom",
      name: "Custom",
      emojis: ["octocat"],
    },
  ],
  emojis: {
    octocat: customEmoji[0],
  },
  aliases: {},
}

// stop tsc from complaining
void fullCustomEmojiData

export const CustomEmojiPicker = ({ onSelect: defaultSelect, ...props }: CustomEmojiProps) => {
  const { insertText, closeEmojiPicker, textareaRef } = useMessageInputContext("CustomEmojiPicker")

  const onSelect: CustomEmojiProps["onSelect"] = (emoji: BaseEmoji) => {
    if (((emoji as unknown) as CustomEmoji).imageUrl) {
      insertText(emoji.colons!)
      closeEmojiPicker(FAKE_MOUSE_EVENT)
      textareaRef.current?.focus()
    } else {
      defaultSelect!(emoji)
    }
  }

  return <NimblePicker {...props} custom={customEmoji} onSelect={onSelect} />
  // alternatively, you can fully replace the emoji set with a new one:
  // return <NimblePicker {...props} data={fullCustomEmojiData} onSelect={onSelect} />
}
