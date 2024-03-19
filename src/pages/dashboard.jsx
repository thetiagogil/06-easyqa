import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/UserContext";
import Connect from "../components/Connect";
import Link from "next/link";
import useIsConnected from "../components/useIsConnected";
import supabase from "../utils/supabase";

const Dashboard = () => {
  useIsConnected();
  const { userId } = useContext(AuthContext);

  // States
  const [userQuestions, setUserQuestions] = useState(null); // all user the questions
  const [othersQuestions, setOthersQuestions] = useState(null); // other users questions that have user answers

  // Function to fetch user's questions
  const fetchUserQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching user questions:", error.message);
        return;
      }

      setUserQuestions(data);
    } catch (error) {
      console.error("Error fetching user questions:", error.message);
    }
  };

  // Function to delete a user question
  const deleteUserQuestion = async (questionId) => {
    try {
      await supabase.from("questions").delete().eq("id", questionId);
      setUserQuestions(
        userQuestions.filter((question) => question.id !== questionId)
      );
    } catch (error) {
      console.error("Error deleting user question:", error.message);
    }
  };

  // Function to fetch user's answers to other questions
  const fetchOtherQuestionsWithUserAnswers = async () => {
    try {
      const { data: currentUserAnswers, error: currentUserAnswersError } =
        await supabase.from("answers").select("*").eq("user_id", userId);

      if (currentUserAnswersError) {
        console.error(
          "Error fetching user answers:",
          currentUserAnswersError.message
        );
        return;
      }

      const { data: allQuestions, error: allQuestionsError } = await supabase
        .from("questions")
        .select("*");

      if (allQuestionsError) {
        console.error(
          "Error fetching all questions:",
          allQuestionsError.message
        );
        return;
      }

      const otherQuestions = allQuestions.filter((question) =>
        currentUserAnswers.some((answer) => answer.question_id === question.id)
      );

      setOthersQuestions(otherQuestions);
    } catch (error) {
      console.error("Error fetching:", error.message);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserQuestions();
      fetchOtherQuestionsWithUserAnswers();
    }
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-end mb-4">
        <Connect />
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mt-4">Dashboard</h1>

        <Link href={`/question/form`}>
          <p className="btn btn-primary">Add Question</p>
        </Link>
      </div>

      {userId ? (
        <div className="d-flex flex-column gap-4">
          {/* Questions Table */}
          <div>
            {userQuestions?.length > 0 ? <h4>Questions Table</h4> : null}

            <ul className="list-group">
              {userQuestions?.map((question, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex w-50">
                    <div className="w-75">
                      <p className="mb-0">{question.title}</p>
                    </div>

                    <div>
                      <div
                        className="mx-2"
                        style={{
                          width: "1px",
                          height: "100%",
                          backgroundColor: "lightgray",
                        }}
                      />
                    </div>

                    <div>
                      <p className="mb-0">Price: {question.price}</p>
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <Link
                      href={`/question/${question.id}?userId=${userId}`}
                      className="btn btn-primary btn-sm"
                    >
                      View Details
                    </Link>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteUserQuestion(question.id)}
                    >
                      X
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Answers Table */}
          <div>
            {othersQuestions?.length > 0 ? (
              <h4>Answered Questions Table</h4>
            ) : null}

            <ul className="list-group">
              {othersQuestions?.map((question, index) => (
                <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div className="d-flex w-50">
                  <div className="w-75">
                    <p className="mb-0">{question.title}</p>
                  </div>

                  <div>
                    <div
                      className="mx-2"
                      style={{
                        width: "1px",
                        height: "100%",
                        backgroundColor: "lightgray",
                      }}
                    />
                  </div>

                  <div>
                    <p className="mb-0">Price: {question.price}</p>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <Link
                    href={`/question/${question.id}?userId=${userId}`}
                    className="btn btn-primary btn-sm"
                  >
                    View Details
                  </Link>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteUserQuestion(question.id)}
                  >
                    X
                  </button>
                </div>
              </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
