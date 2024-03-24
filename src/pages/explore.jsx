import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/UserContext";
import useIsConnected from "../components/useIsConnected";
import Navbar from "../components/Navbar";
import supabase from "../utils/supabase";
import QuestionsListLayout from "../components/QuestionsListLayout";

const Explore = () => {
  useIsConnected();
  const { userId } = useContext(AuthContext);

  // States
  const [allQuestions, setAllQuestions] = useState(null);

  // Function to fetch all questions except user's
  const fetchAllQuestions = async () => {
    try {
      // Fetch all questions
      const { data: allQuestionsData, error: allQuestionsError } =
        await supabase.from("questions").select("*");

      if (allQuestionsError) {
        console.error(
          "Error fetching all questions:",
          allQuestionsError.message
        );
        return;
      }

      // Filter out questions made by the user
      const { data: userQuestionsData, error: userQuestionsError } =
        await supabase.from("questions").select("*").eq("user_id", userId);

      if (userQuestionsError) {
        console.error(
          "Error fetching user questions:",
          userQuestionsError.message
        );
        return;
      }

      // Filter out user questions from all questions
      const otherQuestions = allQuestionsData.filter(
        (question) =>
          !userQuestionsData.some(
            (userQuestion) => userQuestion.id === question.id
          )
      );

      // Set State
      setAllQuestions(otherQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error.message);
    }
  };

  // Renderization
  useEffect(() => {
    fetchAllQuestions();
  }, [userId, allQuestions]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-end mb-4">
        <Navbar />
      </div>

      <h1>Other Users Questions</h1>

      {allQuestions ? (
        <div>
          <QuestionsListLayout
            map={allQuestions}
            userId={userId}
            needsDelete={false}
          />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Explore;
