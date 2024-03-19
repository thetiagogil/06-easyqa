import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../../context/UserContext";
import useIsConnected from "../../components/useIsConnected";
import supabase from "../../utils/supabase";
import FormLayout from "../../components/FormLayout";

const AnswerForm = () => {
  useIsConnected();
  const { userId } = useContext(AuthContext);
  const router = useRouter();
  const { questionId } = router.query;

  // States
  const [content, setContent] = useState("");

  // Function to create question
  const createAnswer = async () => {
    try {
      const { data, error } = await supabase
        .from("answers")
        .insert({ content, question_id: questionId, user_id: userId })
        .select();

      if (error) {
        console.error("Error creating answer:", error.message);
        return;
      }
    } catch (error) {
      console.error("Error creating answer:", error.message);
    }
  };

  // Handle form submission
  const handleSubmitButton = (event) => {
    event.preventDefault();
    if (content.length === 0) {
      window.alert("All boxes are mandatory");
    } else {
      createAnswer();
      router.push(`/question/${questionId}`);
    }
  };

  // Handle cancel button click
  const handleCancelButton = () => {
    router.push(`/question/${questionId}`);
  };

  return (
    <FormLayout isQuestionForm={false} content={content} setContent={setContent} handleSubmitButton={handleSubmitButton} handleCancelButton={handleCancelButton} />
  );
};

export default AnswerForm;
