import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/UserContext";
import Link from "next/link";
import useIsConnected from "../../components/useIsConnected";
import supabase from "../../utils/supabase";

const QuestionDetails = () => {
  useIsConnected();
  const { userId } = useContext(AuthContext);
  const router = useRouter();
  const { id } = router.query;
  const questionId = id;

  // States
  const [userQuestion, setUserQuestion] = useState(null);
  const [userQuestionAnswers, setUserQuestionAnswers] = useState(null);

  // Function to fetch user's questions
  const fetchUserQuestion = async () => {
    try {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("id", questionId)
        .single();

      if (error) {
        console.error("Error fetching user question:", error.message);
        return;
      }

      setUserQuestion(data);
    } catch (error) {
      console.error("Error fetching user question:", error.message);
    }
  };

  // Function to fetch user's question answers
  const fetchUserQuestionAnswers = async () => {
    try {
      const { data, error } = await supabase
        .from("answers")
        .select("*")
        .eq("question_id", questionId);

      if (error) {
        console.error("Error fetching user question:", error.message);
        return;
      }

      setUserQuestionAnswers(data);
    } catch (error) {
      console.error("Error fetching user question:", error.message);
    }
  };

  // Function to delete a user answer
  const deleteAnswerByUser = async (answerId) => {
    try {
      await supabase.from("answers").delete().eq("id", answerId);
      setUserQuestionAnswers(
        userQuestionAnswers.filter((answer) => answer.id !== answerId)
      );
    } catch (error) {
      console.error("Error deleting user answer:", error.message);
    }
  };

  // Checking if the user has already answered the question
  const userHasAnswered = userQuestionAnswers?.some(
    (answer) => answer.user_id === userId
  );

  useEffect(() => {
    fetchUserQuestion();
    fetchUserQuestionAnswers();
  }, []);

  return (
    <div className="container">
      <div className="mt-4 d-flex justify-content-between align-items-center">
        <Link href={`/dashboard`} className="btn btn-primary">
          Back
        </Link>

        {!userHasAnswered ? (
          <Link
            href={`/answer/form/?questionId=${questionId}`}
            className="btn btn-primary"
          >
            Add Answer
          </Link>
        ) : null}
      </div>

      <div>
        <h3 className="mt-4">Question</h3>

        <div className="mt-2 p-4 border">
          <p className="mb-1">Question Title: {userQuestion?.title}</p>
          <p className="mb-1">Question Content: {userQuestion?.content}</p>
          <p className="mb-1">Question Price: {userQuestion?.price}</p>
        </div>
      </div>

      <div>
        {userQuestionAnswers?.length > 0 && <h3 className="mt-4">Answers</h3>}

        {userQuestionAnswers?.map((answer, index) => {
          return (
            <div key={index} className="mt-2 p-4 border">
              <p className="mb-1">Question Title: {answer?.title}</p>
              <p className="mb-1">Question Content: {answer?.content}</p>
              <p className="mb-1">Question Price: {answer?.price}</p>
              {userId === answer.user_id ? (
                <button
                  className="btn btn-danger btn-sm me-2"
                  onClick={() => {
                    deleteAnswerByUser(answer.id);
                  }}
                >
                  X
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionDetails;
