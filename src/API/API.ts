import { BotMessageResponseModel } from "@/MODEL";
import axios, { AxiosResponse } from "axios";

let BaseURL = "https://fyp-chatbot-python.azurewebsites.net/";

const Mode = process.env.NODE_ENV;

if (Mode == "development") {
  BaseURL = "http://127.0.0.1:8000/";
}

export function postBotMessage(
  Message: string
): Promise<AxiosResponse<BotMessageResponseModel>> {
  let data = {
    MessageStr: Message || "head hurt",
  };
  return axios.post(BaseURL + "Chat", data);
}

export function postImage(ImageByte: FormData) {
  const config = {
    headers: { "content-type": "multipart/form-data" },
  };
  return axios.post(BaseURL + "files", ImageByte, config);
}

export function getServerStatus(): Promise<AxiosResponse<any>> {
  return axios.get(BaseURL);
}
