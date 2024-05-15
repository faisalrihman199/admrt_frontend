import chatClient from "../util/chatClient";

export async function getConversationWithUser({ receiver_id, token }) {
  try {
    const cleanedToken = token.replace(/^JWT\s/, "");
    // const response = await chatClient.get(
    //   `/chat?receiver_id=${receiver_id}&token=${cleanedToken}`
    // );
    // return response.data;
    return [
      {
        sender_id: "7",
        receiver_id: "5",
        text: "1st msg",
        id: 20,
        created_at: 1715784839577098,
        conversation_id: "5-7",
      },
      {
        sender_id: "5",
        receiver_id: "7",
        text: "yes i got it",
        id: 19,
        created_at: 1715784827438910,
        conversation_id: "5-7",
      },
      {
        sender_id: "5",
        receiver_id: "7",
        text: "yes i got it",
        id: 18,
        created_at: 1715784773245123,
        conversation_id: "5-7",
      },
      {
        sender_id: "7",
        receiver_id: "5",
        text: "1st msg",
        id: 16,
        created_at: 1715784729355908,
        conversation_id: "5-7",
      },
      {
        sender_id: "5",
        receiver_id: "7",
        text: "HI how are you doing today",
        id: 11,
        created_at: 1715778516946922,
        conversation_id: "5-7",
      },
      {
        sender_id: "5",
        receiver_id: "7",
        text: "HI how are you doing today",
        id: 10,
        created_at: 1715775216830810,
        conversation_id: "5-7",
      },
      {
        sender_id: "5",
        receiver_id: "7",
        text: "HI how are you",
        id: 9,
        created_at: 1715775182921810,
        conversation_id: "5-7",
      },
    ];
  } catch (error) {
    console.log(error);
    throw error;
  }
}
