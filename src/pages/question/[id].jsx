import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import supabase from "../../utils/supabase";

const QuestionDetails = () => {
  const router = useRouter();
  const { id, userId } = router.query;
  const questionId = id;

  // States
  const [userQuestion, setUserQuestion] = useState(null);
  const [otherUsersAnswers, setOtherUsersAnswers] = useState(null);

  // Function to fetch user details including wallet address
  const fetchUser = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("wallet_address")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user details:", error.message);
        return;
      }

      return data.wallet_address;
    } catch (error) {
      console.error("Error fetching user details:", error.message);
      return;
    }
  };

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

      // Fetch wallet address for the user who made the question
      const walletAddress = await fetchUser(data.user_id);
      setUserQuestion((obj) => ({ ...obj, walletAddress }));
    } catch (error) {
      console.error("Error fetching user question:", error.message);
    }
  };

  // Function to fetch user's question answers
  const fetchOtherUsersAnswers = async () => {
    try {
      const { data, error } = await supabase
        .from("answers")
        .select("*")
        .eq("question_id", questionId);

      if (error) {
        console.error("Error fetching user question:", error.message);
        return;
      }

      // Fetch wallet address for each user who provided answers
      const updatedAnswers = await Promise.all(
        data.map(async (answer) => {
          const walletAddress = await fetchUser(answer.user_id);
          return { ...answer, walletAddress };
        })
      );

      setOtherUsersAnswers(updatedAnswers);
    } catch (error) {
      console.error("Error fetching user question:", error.message);
    }
  };

  // Function to delete a user answer
  const deleteOtherUsersAnswers = async (answerId) => {
    try {
      await supabase.from("answers").delete().eq("id", answerId);
      setOtherUsersAnswers(
        otherUsersAnswers.filter((answer) => answer.id !== answerId)
      );
    } catch (error) {
      console.error("Error deleting user answer:", error.message);
    }
  };

  // Checking if the user has already answered the question
  const userHasAnswered = otherUsersAnswers?.some(
    (answer) => answer.user_id === userId
  );

  useEffect(() => {
    fetchUserQuestion();
    fetchOtherUsersAnswers();
  }, []);

  return (
    <div className="container">
      <div className="mt-4 d-flex justify-content-between align-items-center">
        <Link href={`/dashboard`} className="btn btn-primary">
          Back
        </Link>

        {userQuestion && otherUsersAnswers !== null && !userHasAnswered ? (
          <Link
            href={`/answer/form/?questionId=${questionId}`}
            className="btn btn-primary"
          >
            Add Answer
          </Link>
        ) : null}
      </div>

      {/* Question*/}
      {userQuestion ? (
        <div>
          <h3 className="mt-4">Question</h3>

          <div className="p-4 border">
            <div className="mb-2 d-flex gap-2 align-items-center">
              <h5 className="m-0">{userQuestion?.title}</h5>

              <p className="m-0">{userQuestion?.price} €</p>
            </div>

            <p className="mb-4">{userQuestion?.content}</p>

            <p
              className="m-0"
              style={{
                fontSize: "smaller",
                color: "lightGray",
              }}
            >
              Answer by: {userQuestion?.walletAddress}
            </p>
          </div>
        </div>
      ) : null}

      {/* Answers*/}
      <div>
        {otherUsersAnswers?.length > 0 && <h3 className="mt-4">Answers</h3>}

        {otherUsersAnswers?.map((answer, index) => {
          return (
            <div key={index} className="p-4 border">
              <div className="mb-2 d-flex justify-content-between align-items-center">
                <span></span>
                <div className="d-flex gap-2">
                  {userId === userQuestion.user_id ? (
                    <button className="btn btn-danger btn-sm">
                      Accept Answer
                    </button>
                  ) : null}

                  {userId === userQuestion.id || userId === answer.user_id ? (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        deleteOtherUsersAnswers(answer.id);
                      }}
                    >
                      X
                    </button>
                  ) : null}
                </div>
              </div>

              <p className="mb-4">{answer?.content}</p>

              <p
                className="m-0"
                style={{
                  fontSize: "smaller",
                  color: "lightGray",
                }}
              >
                Answer by: {userQuestion?.walletAddress}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionDetails;
