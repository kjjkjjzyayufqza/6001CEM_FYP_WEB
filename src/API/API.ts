import axios from "axios";

export function postBotMessage(Message: string) {
  let data = {
    MessageStr: Message || "hi",
  };
  return axios.post("https://fyp-chatbot-python.azurewebsites.net/Chat", data);
}
