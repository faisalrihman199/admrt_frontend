import apiClient from "../util/apiClient";

export async function getChatConversationList(authHeader) {
  try {
    // const [_key, { authHeader }] = queryKey;
    const response = await apiClient.get("/newChat/conversations/", {
      headers: {
        Authorization: authHeader,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function getChatConversation(authHeader, conversation_id) {
  try {
    
    const response = await apiClient.get(`/newChat/conversation/?pk=${conversation_id}`, {
      headers: {
        Authorization: authHeader,
      },
    });
    return response.data;
  } catch (error) {
    return [];
  }
}

export async function getChatUsersForAdmin({
  authHeader,
  search = "",
  limit = 20,
}) {
  try {
    const response = await apiClient.get(
      `/chat/user/?search=${search}&limit=${limit}`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );
    console.log("called api");
    return response.data;
  } catch (error) {
    return [];
  }
}
