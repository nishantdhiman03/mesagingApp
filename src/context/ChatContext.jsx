import { useReducer, createContext, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const initialState = {
    user: {},
    chatId: "",
  };
  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE__USER":
        return {
          user: action.payload,
          chatId:
            action.payload.uid > user.uid
              ? action.payload.uid + user.uid
              : user.uid + action.payload.uid,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, initialState);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
