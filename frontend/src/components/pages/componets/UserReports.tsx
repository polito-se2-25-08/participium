import { useEffect, useState } from "react";
import SubTitle from "../../titles/SubTitle";
import type { UserReport } from "../../../interfaces/dto/report/UserReport";
import { fetchUserReportsById } from "../../../action/UserAction";
import { postMessage } from "../../../action/reportAction";
import { useUser } from "../../providers/AuthContext";
import { formatTimestamp } from "../../../utilis/utils";

import Spinner from "../../loaders/Spinner";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import TextInput from "../../input/variants/TextInput";

// 1. Tipo di Stato Aggiornato
type ReportState = {
  isExpanded: boolean;
  newMessage: string; // Rinominato da textValue a newMessage per chiarezza
};

export default function UserReports() {
  const [userReports, setUserReports] = useState<UserReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reportFetched, setReportFetched] = useState(false);
  const { user } = useUser();

  const [reportStates, setReportStates] = useState<Record<number, ReportState>>(
    {}
  ); // Rinominato reportClicked in reportStates per chiarezza

  // --- Funzioni di gestione dello Stato ---

  // 2. Handler per la modifica del testo
  const handleMessageChange = (reportId: number, newText: string) => {
    setReportStates((prev) => ({
      ...prev,
      [reportId]: {
        ...prev[reportId], // Mantiene lo stato isExpanded
        newMessage: newText, // Aggiorna solo il campo newMessage
      },
    }));
  };

  const handleToggleExpand = (reportId: number) => {
    setReportStates((prev) => ({
      ...prev,
      [reportId]: {
        ...prev[reportId],
        isExpanded: !prev[reportId].isExpanded,
      },
    }));
  };

  const handleSendMessage = async (reportId: number) => {
    const messageText = reportStates[reportId]?.newMessage;
    if (!messageText || !messageText.trim()) return;

    const response = await postMessage(reportId, messageText);
    if (response.success) {
      const reponse = await fetchUserReportsById(user.id);
      if (reponse.success) {
        setUserReports(reponse.data);
      }
      handleMessageChange(reportId, "");
    } else {
      console.error("Failed to send message");
    }
  };

  useEffect(() => {
    const init = async () => {
      setReportFetched(false);
      setIsLoading(true);
      const reponse = await fetchUserReportsById(user.id);
      if (reponse.success) {
        setUserReports(reponse.data);
      }

      setIsLoading(false);
      setReportFetched(true);
    };
    init();
  }, [user.id]);

  useEffect(() => {
    if (!reportFetched) return;

    const initialState = Object.fromEntries(
      userReports.map((report) => [
        report.id,
        { isExpanded: false, newMessage: "" },
      ])
    );

    setReportStates(initialState);
  }, [userReports, reportFetched]);

  return (
    <div className="flex flex-col rounded-xl shadow-xl border border-gray-600 gap-3 w-1/2 h-full">
      <SubTitle fontSize="text-[1.9rem]">Your Reports</SubTitle>
      <div className="overflow-scroll max-h-[50vh] flex flex-col pr-8 pb-5 pl-8">
        {isLoading ? (
          <div className="flex flex-col h-full w-full justify-center items-center">
            <Spinner />
          </div>
        ) : userReports.length === 0 ? (
          <div className="flex flex-col h-full w-full justify-center items-center opacity-60">
            <span>No reports found</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {userReports.map((report) => {
              const state = reportStates[report.id] || {
                isExpanded: false,
                newMessage: "",
              };
              return (
                <div
                  key={report.id}
                  className="flex flex-col gap-2 shadow hover:shadow-md p-2 rounded-2xl"
                >
                  <button
                    onClick={() => handleToggleExpand(report.id)} // Usa il nuovo handler
                    className="flex flex-row items-center gap-3 hover:cursor-pointer w-full"
                  >
                    <div className="flex flex-row justify-between items-center w-full">
                      <div className="w-1/2">
                        <SubTitle textStart>{report.title}</SubTitle>
                      </div>

                      <div className="flex flex-row items-center gap-4">
                        <span className="">{report.status}</span>
                        <FontAwesomeIcon
                          icon={state.isExpanded ? faArrowUp : faArrowDown}
                        />
                      </div>
                    </div>
                  </button>
                  {state.isExpanded && (
                    <div className="flex flex-col p-8">
                      {report.anonymous && (
                        <>
                          <span className="border-b-2 my-2"></span>
                          <span>This report is anonymous</span>
                        </>
                      )}

                      <SubTitle>{report.category}</SubTitle>
                      <span className="border-b-2 my-2"></span>

                      <div>{report.description}</div>

                      <SubTitle>Photos</SubTitle>
                      <span className="border-b-2 my-2"></span>

                      <div className="flex flex-wrap gap-4">
                        {report.photos.map((photo, idx) => (
                          <img
                            key={photo ?? idx}
                            className="h-50 w-50 object-cover"
                            src={photo}
                            alt="report"
                          />
                        ))}
                      </div>

                      <span className="text-end">
                        {formatTimestamp(report.timestamp)}
                      </span>
                      {report.status != "PENDING_APPROVAL" && (
                        <div className="flex flex-col">
                          <SubTitle>Updates</SubTitle>
                          <span className="border-b-2 my-2"></span>

                          <div className="flex flex-col">
                            <div className="max-h-40 overflow-y-scroll p-2 rounded-lg mb-2 space-y-2">
                              {report.messages && report.messages.length > 0 ? (
                                report.messages.map((msg) => (
                                  <div
                                    key={msg.id}
                                    className={`p-2 rounded-lg text-sm ${
                                      msg.senderId === user.id
                                        ? "bg-blue-100 ml-auto text-right"
                                        : "bg-gray-100 mr-auto text-left"
                                    } max-w-[80%]`}
                                  >
                                    <p>{msg.message}</p>
                                    <span className="text-xs opacity-50">
                                      {new Date(msg.createdAt).toLocaleString()}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <p className="opacity-50 text-center">
                                  No updates yet
                                </p>
                              )}
                            </div>

                            <div className="flex flex-row gap-4">
                              <TextInput
							  
                                placeholder="Write a message here..."
                                id={`update-input-${report.id}`}
                                name={`update-input-${report.id}`}
                                hasLabel={false}
                                value={state.newMessage}
                                onChange={(e) =>
                                  handleMessageChange(report.id, e.target.value)
                                }
                              />
                              <button
                                onClick={() => handleSendMessage(report.id)}
                                className="border rounded-full p-2 flex items-center justify-center hover:cursor-pointer"
                              >
                                <FontAwesomeIcon icon={faPaperPlane} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
