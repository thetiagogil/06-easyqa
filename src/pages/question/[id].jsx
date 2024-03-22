import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSendTransaction } from "wagmi";
import { Alchemy, Network } from "alchemy-sdk";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import useIsConnected from "../../components/useIsConnected";
import supabase from "../../utils/supabase";

const QuestionDetails = () => {
  useIsConnected();
  const router = useRouter();
  const { sendTransaction } = useSendTransaction();
  const [alchemy, setAlchemy] = useState(null); // Initialize Alchemy

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

      // Set State
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

      // Set State
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

  // Function to check if the user has already answered the question
  const userHasAnswered = otherUsersAnswers?.some(
    (answer) => answer.user_id === userId
  );

  // Function to check if the user is the question owner
  const isQuestionOwner = () => {
    if (userId === userQuestion?.user_id) {
      return true;
    } else {
      return false;
    }
  };

  // Function to handle accept answer
  const handleAcceptAnswer = async (answerWalletAddress) => {
    try {
      // Send transaction using the useSendTransaction hook
      const transactionHash = await sendTransaction({
        to: answerWalletAddress,
        value: userQuestion.price,
        currency: "ETH",
      });

      // Handle success
      console.log(
        "Transaction sent successfully. Transaction hash:",
        transactionHash
      );
    } catch (error) {
      // Handle error
      console.error("Error sending transaction:", error.message);
    }
  };

  // Function to get the latest block
  const getLatestBlock = async () => {
    if (!alchemy) return; // Ensure Alchemy is initialized
    try {
      const latestBlock = await alchemy.core.getBlock("latest");
      console.log("Latest block:", latestBlock);
    } catch (error) {
      console.error("Error getting latest block:", error.message);
    }
  };

  // Renderization
  useEffect(() => {
    fetchUserQuestion();
    fetchOtherUsersAnswers();
  }, [questionId]);

  useEffect(() => {
    const settings = {
      apiKey: "PpWGDO-5dKR7L6HMpdt2xAsteqPJAYZz",
      network: Network.ETH_MAINNET,
    };
    const alchemyInstance = new Alchemy(settings);
    setAlchemy(alchemyInstance);
  }, []);

  useEffect(() => {
    getLatestBlock();
  }, [alchemy]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-end mb-4">
        <Navbar />
      </div>

      <div className="mt-4 d-flex justify-content-between align-items-center">
        <h3 className="mt-4">Question</h3>

        {userQuestion &&
        !isQuestionOwner() &&
        otherUsersAnswers !== null &&
        !userHasAnswered ? (
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
          <div className="p-4 border">
            <div className="mb-2 d-flex gap-2 align-items-center">
              <h5 className="m-0">{userQuestion?.title}</h5>

              <p className="m-0">{userQuestion?.price} $</p>
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
              <p className="mb-4">{answer?.content}</p>

              <div className="mb-2 d-flex justify-content-between align-items-center">
                <p
                  className="m-0"
                  style={{
                    fontSize: "smaller",
                    color: "lightGray",
                  }}
                >
                  Answer by: {answer?.walletAddress}
                </p>

                <div className="d-flex gap-2">
                  {isQuestionOwner() && !userHasAnswered ? (
                    <button
                      onClick={() => handleAcceptAnswer(answer.walletAddress)}
                      className="btn btn-success btn-sm"
                    >
                      Accept Answer
                    </button>
                  ) : null}

                  {isQuestionOwner() || userId === answer.user_id ? (
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionDetails;
