import axios from "axios";

const BaseURL = "https://fyp-chatbot-python.azurewebsites.net/";

export function postBotMessage(Message: string) {
  let data = {
    MessageStr: Message || "hi",
  };
  return axios.post(BaseURL + "Chat", data);
}

export function postImage(ImageByte: FormData) {
  const config = {
    headers: { "content-type": "multipart/form-data", },
  };
  return axios.post(BaseURL + "files", ImageByte, config);
}
