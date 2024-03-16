import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const QuestionForm = () => {
  const router = useRouter();

  const [content, setContent] = useState();
  const [price, setPrice] = useState();

  const payload = { content: content, price: price /* , user_id: userId */ };

  const createQuestion = async () => {
    try {
      const { data: newUser, error } = await supabase
        .from("questions")
        .insert(payload)
        .select();

      if (error) {
        console.log(error);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitButton = (event) => {
    event.preventDefault();
    createQuestion();
  };

  const handleCancelButton = () => {
    router.push("/dashboard");
  };

  return (
    <>
      <h2>Question Form</h2>
      <form onSubmit={handleSubmitButton}>
      <label>
          <p>Content</p>
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </label>

        <label>
          <p>Price</p>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </label>

        <button type="submit">Submit</button>
      </form>

      <button onClick={handleCancelButton}>Cancel</button>
    </>
  );
};

export default QuestionForm;
