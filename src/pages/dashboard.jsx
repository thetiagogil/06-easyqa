import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/UserContext";
import Navbar from "../components/Navbar";
import Link from "next/link";
import useIsConnected from "../components/useIsConnected";
import supabase from "../utils/supabase";
import QuestionsListLayout from "../components/QuestionsListLayout";

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

      // Set State
      setUserQuestions(data);
    } catch (error) {
      console.error("Error fetching user questions:", error.message);
    }
  };

  // Function to fetch user's answers to other questions
  const fetchOtherQuestionsWithUserAnswers = async () => {
    try {
      // Fetch the current user answers
      const { data: currentUserAnswers, error: currentUserAnswersError } =
        await supabase
          .from("answers")
          .select("*")
          .eq("user_id", userId)
          .single();

      if (currentUserAnswersError) {
        console.error(
          "Error fetching user answers:",
          currentUserAnswersError.message
        );
        return;
      }

      // Fetch all the questions to check which question has user answer
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

      // Set State
      const otherQuestions = allQuestions.filter((question) =>
        currentUserAnswers.some((answer) => answer.question_id === question.id)
      );

      setOthersQuestions(otherQuestions);
    } catch (error) {
      console.error("Error fetching:", error.message);
    }
  };

  // Function to delete a user question along with associated answers
  const deleteUserQuestion = async (questionId) => {
    try {
      // Delete associated answers first
      await supabase.from("answers").delete().eq("question_id", questionId);

      // delete the question after answers are deleted
      await supabase.from("questions").delete().eq("id", questionId);

      // State
      setUserQuestions(
        userQuestions.filter((question) => question.id !== questionId)
      );
    } catch (error) {
      console.error("Error deleting user question:", error.message);
    }
  };

  // Renderization
  useEffect(() => {
    if (userId) {
      fetchUserQuestions();
      fetchOtherQuestionsWithUserAnswers();
    }
  }, [userId]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-end mb-4">
        <Navbar />
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Dashboard</h1>

        <Link href={`/question/form`}>
          <span className="btn btn-primary">Add Question</span>
        </Link>
      </div>

      {userId ? (
        <div className="d-flex flex-column gap-4">
          {/* Questions Table */}
          {userQuestions?.length > 0 ? (
            <div>
              <h4>My Questions Table</h4>
              <QuestionsListLayout
                map={userQuestions}
                userId={userId}
                deleteUserQuestion={deleteUserQuestion}
                needsDelete={true}
              />
            </div>
          ) : null}

          {/* Answers Table */}
          {othersQuestions?.length > 0 ? (
            <div>
              <h4>My Answered Questions Table</h4>
              <QuestionsListLayout
                map={othersQuestions}
                userId={userId}
                deleteUserQuestion={deleteUserQuestion}
                needsDelete={false}
              />
            </div>
          ) : null}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
