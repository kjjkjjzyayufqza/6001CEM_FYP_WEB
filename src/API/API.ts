import { BotMessageResponseModel } from "@/MODEL";
import axios, { AxiosResponse } from "axios";

let BaseURL = "https://fyp-chatbot-python.azurewebsites.net/";
let DevURL = "http://127.0.0.1:8000/";
const Mode = process.env.NODE_ENV;

const instance = axios.create({
  baseURL: Mode == "development" ? DevURL : BaseURL,
  timeout: 10000,
});

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // console.log(config);
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    return response;
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export function postBotMessage(
  Message: string
): Promise<AxiosResponse<BotMessageResponseModel>> {
  let data = {
    MessageStr: Message || "head hurt",
  };
  return instance.post("Chat", data);
}

export function postImage(ImageByte: FormData) {
  const config = {
    headers: { "content-type": "multipart/form-data" },
  };
  return instance.post("files", ImageByte, config);
}

export function getServerStatus(): Promise<AxiosResponse<any>> {
  return instance.get("");
}

export function getAllClass(): Promise<AxiosResponse<any>> {
  return instance.get("getAllChatClass");
}

export function addFeedBack({
  category,
  description,
  date,
}: any): Promise<AxiosResponse<any>> {
  const data = {
    category,
    description,
    date,
  };
  return instance.post("addFeedBack", data);
}
