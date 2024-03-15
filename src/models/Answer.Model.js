export default class Answer {
    constructor(id, content, createdAt, acceptedAt, userId, questionId) {
      this.id = id;
      this.content = content;
      this.createdAt = createdAt;
      this.acceptedAt = acceptedAt;
      this.userId = userId;
      this.questionId = questionId;
    }
  }
  