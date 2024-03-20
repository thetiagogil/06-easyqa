import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../../context/UserContext";
import useIsConnected from "../../components/useIsConnected";
import supabase from "../../utils/supabase";
import FormLayout from "../../components/FormCreateLayout";

const QuestionForm = () => {
  useIsConnected();
  const { userId } = useContext(AuthContext);
  const router = useRouter();

  // States
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
  const handleSubmitButton = async (event) => { 
    event.preventDefault();
    await createQuestion();
    router.push("/dashboard");
  };

  // Handle cancel button click
  const handleCancelButton = () => {
    router.push("/dashboard");
  };

  return (
    <FormLayout
      isQuestionForm={true}
      title={title}
      setTitle={setTitle}
      price={price}
      setPrice={setPrice}
      content={content}
      setContent={setContent}
      handleSubmitButton={handleSubmitButton}
      handleCancelButton={handleCancelButton}
    />
  );
};

export default QuestionForm;
