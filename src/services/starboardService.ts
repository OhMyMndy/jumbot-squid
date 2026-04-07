import { apiClient } from "../util/helpers";

async function updateStarboard(channel_id: String, message_id: String, guild_id: String, emoji: String, count: number, posted_message_id?: String) {
  let reaction = await apiClient.resource("reactions").updateOrCreate({
    filterKeys: [
      "channel_id", "message_id", "guild_id", "emoji"
    ],
    values: {
      "channel_id": channel_id,
      "message_id": (message_id),
      "guild_id": (guild_id),
      "emoji": emoji,
      "count": count,
      "posted_message_id": posted_message_id
    }
  })
  console.log(reaction.data)
  if (reaction.data.data && reaction.data.data.id) {
    return reaction.data.data
  }
  return reaction.data.data[0]
}


// async function updateMessage(message) {
//
// }
export {
  updateStarboard
}
