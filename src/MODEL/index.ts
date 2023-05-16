export interface BotMessageResponseModel {
  result?: boolean;
  botMessage?: {
    message?: string;
    tag?: string;
    description?: string;
    suggestionsText?: string;
    suggestions?: string[];
  };
}

