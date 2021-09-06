import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { emotions } from './const.js';
import * as CommentMock from './mock/mock-const.js';
import { getRandomItemFromArray, getRandomInteger } from './utils/common.js';

const comments = new Map();

const generateAuthor = () => getRandomItemFromArray(CommentMock.PEOPLE);

const generateEmotion = () => getRandomItemFromArray(Object.values(emotions));

const generateText = () => getRandomItemFromArray(CommentMock.COMMENT_PHRASES);

const generateCommentDate = () => {
  const commentDayShift = getRandomInteger(
    CommentMock.MIN_COMMENT_DAY_SHIFT,
    CommentMock.MAX_COMMENT_DAY_SHIFT,
  );

  const commentMinuteShift = getRandomInteger(
    CommentMock.MIN_COMMENT_MINUTE_SHIFT,
    CommentMock.MAX_COMMENT_MINUTE_SHIFT,
  );

  return dayjs().subtract(commentDayShift, 'day').subtract(commentMinuteShift, 'minute').toDate();
};

export const generateComment = () => {
  const comment = {
    id: nanoid(),
    text: generateText(),
    author: generateAuthor(),
    emotion: generateEmotion(),
    date: generateCommentDate(),
  };

  comments.set(comment.id, comment);

  return comment;
};

const getCommentById = (id) => comments.get(id);

export const getCommentsByIds = (ids) => ids.map((id) => getCommentById(id));

export const createComment = ({ text, emotion }) => {
  if (!text || !emotion) {
    throw new Error('Comment invalid');
  }

  const newComment = {
    text,
    emotion,
    author: 'Me',
    id: nanoid(),
    date: new Date(),
  };

  comments.set(newComment.id, newComment);

  return newComment;
};

export const deleteComment = (commentId) => {
  comments.delete(commentId);
};
