export default class Question {
  constructor(id, content, price, status, createdAt, userId) {
    this.id = id;
    this.content = content;
    this.price = price;
    this.status = status;
    this.createdAt = createdAt;
    this.userId = userId;
  }
}
