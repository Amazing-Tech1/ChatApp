import { useEffect } from "react";
import { useChatStore } from "../store/chat";
import { useAuthStore } from "../store/auth";
import UsersLoadingSkeleton from "./UserLoadingSkeleton";
import { useSearchParams } from "react-router";

function ContactList() {
  const { getAllContacts, allContacts, setSelectedUser, isUserLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isUserLoading) return <UsersLoadingSkeleton />;

  return (
    <>
      {allContacts?.map((contact) => (
        <div
          key={contact._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => {
            setSelectedUser(contact);
            setSearchParams({ user: contact._id });
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className={`avatar ${
                onlineUsers.includes(String(contact._id)) ? "avatar-online" : "avatar-offline"
              }`}
            >
              {/* <div className={`avatar online`}> */}
              <div className="size-12 rounded-full">
                <img src={contact.image_url || "/avatar.png"} />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium">{contact.name}</h4>
          </div>
        </div>
      ))}
    </>
  );
}
export default ContactList;
