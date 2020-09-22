import * as ActionTypes from "./actionTypes";

export const FeedBack = (
  state = { feedBack: [] },
  action
) => {
  switch (action.type) {
    case ActionTypes.POST_FEEDBACK:
      return {
        ...state,
        feedBack: action.payload,
      };
    default:
      return state;
  }
};
