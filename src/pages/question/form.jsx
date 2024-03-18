import { useState } from "react";
import { useRouter } from "next/router";
import supabase from "../../utils/supabase";
import useIsConnected from "../../components/useIsConnected";

const QuestionForm = ({ userId }) => {
  useIsConnected();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [price, setPrice] = useState("");

  // Function to create question
  const createQuestion = async () => {
    try {
      const { data, error } = await supabase
        .from("questions")
        .insert({ title, content, price, user_id: userId })
        .select();

      if (error) {
        console.error("Error creating question:", error.message);
        return;
      }
    } catch (error) {
      console.error("Error creating question:", error.message);
    }
  };

  // Handle form submission
  const handleSubmitButton = (event) => {
    event.preventDefault();
    createQuestion();
    router.push("/dashboard");
  };

  // Handle cancel button click
  const handleCancelButton = () => {
    router.push("/dashboard");
  };

  return (
    <div className="container">
      <h2 className="mt-4 mb-4">Question Form</h2>

      <form onSubmit={handleSubmitButton}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="content" className="form-label">
            Content
          </label>
          <input
            type="text"
            className="form-control"
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price
          </label>
          <input
            type="text"
            className="form-control"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary me-2">
          Submit
        </button>

        <button
          type="button"
          onClick={handleCancelButton}
          className="btn btn-secondary"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default QuestionForm;
